import styles from './styles.module.css'
import Header from '../../components/Header'
import { useEffect, useState, useRef, ReactElement } from 'react'
import { SocketEvents } from '../../models/SocketEvents.model'
import EventsManager from '../../services/EventsManager'
import { Col, Row, Container } from 'react-bootstrap'
import Button from '../../components/Button'
import Divider from '../../components/Divider'
import Clickable from '../../components/Clickable'
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
    const scenariosRef = useRef(scenarios)
    scenariosRef.current = scenarios
    const [score, setScore] = useState(5)
    const [selectedScenarios, setSelectedScenarios] = useState<Scenario[]>([])
    const [currPage, setCurrPage] = useState(1)
    const [maxPages, setMaxPages] = useState(1)
    const scenariosPerPage = 8

    const maxPagesRef = useRef<number>(maxPages)
    maxPagesRef.current = maxPages
    const currPageRef = useRef<number>(currPage)
    currPageRef.current = currPage
    const scoreRef = useRef<number>(score)
    scoreRef.current = score
    const selectedScenariosRef = useRef<Scenario[]>(selectedScenarios)
    selectedScenariosRef.current = selectedScenarios

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
        debugger
        let curr = [...selectedScenariosRef.current]
        if (curr.includes(scenario)) {
            curr = curr.filter((s) => !isEqual(s, scenario))
        } else {
            curr.push(scenario)
        }
        setSelectedScenarios(curr)
    }

    const generateScenarioList = () => {
        const scenariosList: any = []
        for (let i = currPageRef.current; i < scenariosPerPage && i < scenariosRef.current.length; i++) {
            const s = scenariosRef.current[i]
            scenariosList.push(
                <Clickable
                    key={i}
                    onClick={() => handleScenarioSelection(s)}
                    className={`${styles.scenarioItem} ${selectedScenarios.includes(s) ? styles.selectedScenario : ''}`}
                >
                    <Row className="justify-content-center">
                        <Col xs={{ span: 10 }}>{s.text}</Col>
                    </Row>
                </Clickable>
            )
        }
        return scenariosList
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
        setMaxPages(Math.ceil(scenarios.length / scenariosPerPage))
    }

    useEffect(() => {
        if (!roomId) {
            history.push(`/`)
        }
        eventsManager.on(SocketEvents.SCENARIO_LIST, 'feedback-component', (obj: { scenarios: Scenario[] }) =>
            handleScenarios(obj)
        )
        eventsManager.trigger(SocketEvents.REQUEST_SCENARIOS, { roomId })
    }, [])

    useEffect(
        () => () => {
            eventsManager.off(SocketEvents.SCENARIO_LIST, 'feedback-componment')
            eventsManager.trigger(SocketEvents.LEAVE_ROOM, {
                id: sessionStorage.getItem('rid'),
                userId: localStorage.getItem('userId'),
                username: sessionStorage.getItem('username')
            })
        },
        []
    )

    const generateThreePages = (current: number, max: number) => {
        const items: any = []

        if (current - 1 > 2) {
            items.push(
                <Col xs={{ span: 1 }} className={styles.paginationItem}>
                    <Button disabled={true}>{'...'}</Button>
                </Col>
            )
        }

        for (let i = Math.max(current - 1, 1); i <= 3 && i <= max; i++) {
            items.push(
                <Col xs={{ span: 1 }} className={styles.paginationItem}>
                    <Button className={current === i ? styles.selectedValue : ''} onClick={() => setCurrPage(i)}>
                        {i.toString()}
                    </Button>
                </Col>
            )
        }

        if (current + 1 < max) {
            items.push(
                <Col xs={{ span: 1 }} className={styles.paginationItem}>
                    <Button disabled={true}>{'...'}</Button>
                </Col>
            )
        }

        return items
    }

    const generatePaginationItems = () => {
        const items: any = []

        items.push(
            <Col xs={{ span: 1 }} className={styles.paginationItem}>
                <Button onClick={() => setCurrPage(1)}>{'<<'}</Button>
            </Col>,
            <Col xs={{ span: 1 }} className={styles.paginationItem}>
                <Button onClick={() => setCurrPage(currPageRef.current - 1 < 1 ? 1 : currPageRef.current - 1)}>
                    {'<'}
                </Button>
            </Col>
        )
        items.push(...generateThreePages(currPageRef.current, maxPagesRef.current))
        items.push(
            <Col xs={{ span: 1 }} className={styles.paginationItem}>
                <Button
                    onClick={() =>
                        setCurrPage(
                            currPageRef.current + 1 > maxPagesRef.current
                                ? maxPagesRef.current
                                : currPageRef.current + 1
                        )
                    }
                >
                    {'>'}
                </Button>
            </Col>,
            <Col xs={{ span: 1 }} className={styles.paginationItem}>
                <Button onClick={() => setCurrPage(maxPagesRef.current)}>{'>>'}</Button>
            </Col>
        )

        return items
    }

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
                            <div className={styles.pagination}>
                                <Row className="justify-content-center">{generatePaginationItems()}</Row>
                            </div>
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
