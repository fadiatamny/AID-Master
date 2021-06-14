import styles from './styles.module.css'
import Header from '../../components/Header/Header'
import { useEffect, useState, useRef, ReactElement } from 'react'
import { SocketEvents } from '../../models/SocketEvents.model'
import EventsManager from '../../services/EventsManager'
import { Col, Row, Container } from 'react-bootstrap'
import Button from '../../components/Button/Button'
import Divider from '../../components/Divider'
import Clickable from '../../components/Clickable/Clickable'
import { Scenario } from '../../models/Scenario.model'
import { History } from 'history'
import { isEqual } from 'lodash'

interface FeedbackProps {
    history: History
}

const Feedback = ({ history }: FeedbackProps) => {
    const eventsManager = EventsManager.instance
    const roomId = sessionStorage.getItem('rid')

    const [scenarios, setScenarios] = useState<Scenario[]>([])
    const [score, setScore] = useState(5)
    const [selectedScenarios, setSelectedScenarios] = useState<Scenario[]>([])

    const scoreRef = useRef<number>(score)
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
        let curr = [...selectedScenariosRef.current]
        if (curr.includes(scenario)) {
            curr = curr.filter((s) => !isEqual(s, scenario))
        } else {
            curr.push(scenario)
        }
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

    const sendFeedback = () => {
        eventsManager.trigger(SocketEvents.FEEDBACK, { roomId, score: scoreRef.current, scenarios: selectedScenarios })
        history.push(`/`)
    }

    const skipFeedback = () => {
        history.push(`/`)
    }

    const handleScenarios = ({ scenarios }: { scenarios: Scenario[] }) => {
        setScenarios(scenarios)
    }

    useEffect(() => {
        // if (!roomId) {
        //     history.push(`/`)
        // }
        eventsManager.on(SocketEvents.SCENARIO_LIST, 'feedback-component', (obj: { scenarios: Scenario[] }) =>
            handleScenarios(obj)
        )
        eventsManager.trigger(SocketEvents.REQUEST_SCENARIOS, { roomId })
    }, [])

    useEffect(
        () => () => {
            eventsManager.off(SocketEvents.SCENARIO_LIST, 'feedback-componment')
        },
        []
    )

    // return scenarios.length === 0 ? <Loading /> : (
    return (
        <>
            <Header />
            <Container fluid className={`justify-content-center ${styles.container}`}>
                <Row className="justify-content-center">
                    <h2 className={styles.h2}>We Value Your Feedback!</h2>
                    <p>Please fill out the following form and help us improve our service</p>
                </Row>
                <Row className={`justify-content-center ${styles.content}`}>
                    <Row className={styles.score}>
                        <Row className="justify-content-center">
                            <h3 className={styles.h3}> How satisfied are you with the our predictions?</h3>
                        </Row>
                        <Row className="justify-content-center">{generateValues()}</Row>
                    </Row>
                    {scenarios.length ? (
                        <>
                            <Divider />
                            <Row className={styles.scenarios}>
                                <Row className="justify-content-center">
                                    <h3 className={styles.h3}> How satisfied are you with the our predictions?</h3>
                                    <p>Please select the scenarios and predictions you thought were good</p>
                                </Row>
                                <Row className="justify-content-center">{generateScenarioList()}</Row>
                            </Row>
                        </>
                    ) : null}
                </Row>
                <Row className="justify-content-center">
                    <Col xs={{ order: 'first' }}>
                        <Button onClick={sendFeedback}>
                            <p>Send Feedback</p>
                        </Button>
                    </Col>
                    <Col xs={{ order: 'last' }}>
                        <Row className="justify-content-end">
                            <Button onClick={skipFeedback}>
                                <p>Skip Feedback</p>
                            </Button>
                        </Row>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default Feedback