/* eslint-disable @typescript-eslint/no-empty-function */
import styles from './styles.module.css'
import Header from '../../components/Header/Header'
import { useEffect, useState, useRef, ReactElement } from 'react'
import { SocketEvents } from '../../models/SocketEvents.model'
import EventsManager from '../../services/EventsManager'
import { generate } from '../../services/ScenarioGuide'
import { Col, Row, Container, InputGroup } from 'react-bootstrap'
import Input from '../../components/Input/Input'
import Button from '../../components/Button/Button'
import Divider from '../../components/Divider'
import Clickable from '../../components/Clickable/Clickable'
import { Scenario } from '../../models/Scenario.model'

type MessageType = {
    username: string
    playername: string
    messageText: string | string[]
    myMessage: boolean
}

const Feedback = () => {
    const eventsManager = EventsManager.instance
    const uid = localStorage.getItem('userId')
    const username = sessionStorage.getItem('username')
    const playertype = sessionStorage.getItem('type')
    const playername = sessionStorage.getItem('playername')
    const roomid = sessionStorage.getItem('rid')

    const scenarios: Scenario[] = []
    const [score, setScore] = useState(5)
    const [selectedScenarios, setSelectedScenarios] = useState<Scenario[]>([])
    const selectedScenariosRef = useRef<Scenario[]>(selectedScenarios)

    const generateValues = () => {
        const values: Array<ReactElement> = []
        for (let i = 0; i < 10; ++i) {
            values.push(
                <Col xs={{ span: 1 }}>
                    <Button onClick={() => setScore(i + 1)} className={score === i + 1 ? styles.selectedValue : ''}>
                        <p>{i + 1}</p>
                    </Button>
                </Col>
            )
        }

        return values
    }

    const handleScenarioSelection = (scenario: Scenario) => {
        const curr = [...selectedScenariosRef.current]
        curr.push(scenario)
        setSelectedScenarios(curr)
    }

    const generateScenarioList = () => {
        return scenarios.map((s: Scenario, index: number) => (
            <Clickable
                key={index}
                onClick={() => handleScenarioSelection(s)}
                className={`${styles.scenarioItem} ${selectedScenarios.includes(s) ? 'selectedScenario' : ''}`}
            >
                <Row className="justify-content-center">
                    <Col xs={{ span: 10 }}>{s.text}</Col>
                </Row>
            </Clickable>
        ))
    }

    return (
        <div>
            <Header />
            <Container fluid className={`justify-content-center ${styles.container}`}>
                <Row className="justify-content-center">
                    <h2 className={styles.h2}>We Value Your Feedback!</h2>
                    <p>Please fill out the following form and help us improve our service</p>
                </Row>
                <Container className={`justify-content-center ${styles.content}`}>
                    <Container className={styles.score}>
                        <Row className="justify-content-center">
                            <h3 className={styles.h3}> How satisfied are you with the our predictions?</h3>
                        </Row>
                        <Row className="justify-content-center">{generateValues()}</Row>
                    </Container>
                    {scenarios.length ? (
                        <>
                            <Divider />
                            <Container className={styles.scenarios}>
                                <Row className="justify-content-center">
                                    <h3 className={styles.h3}> How satisfied are you with the our predictions?</h3>
                                    <p>Please select the scenarios and predictions you thought were good</p>
                                </Row>
                                <Row className="justify-content-center">{generateScenarioList()}</Row>
                            </Container>
                        </>
                    ) : null}
                </Container>
                <Row className="justify-content-center">
                    <Col xs={{ order: 'first' }}>
                        <Button onClick={() => {}}>
                            <p>Send Feedback</p>
                        </Button>
                    </Col>
                    <Col xs={{ order: 'last' }}>
                        <Row className="justify-content-end">
                            <Button onClick={() => {}}>
                                <p>Skip Feedback</p>
                            </Button>
                        </Row>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default Feedback
