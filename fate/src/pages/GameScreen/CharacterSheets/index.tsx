import { useState, useRef } from 'react'
import styles from './styles.module.css'
import { Row, Container, Col } from 'react-bootstrap'
import { CharacterSheet as CH } from '../../../models/CharacterSheet.model'
import CharacterSheet from '../../../components/CharacterSheet'
import Divider from '../../../components/Divider'
import Button from '../../../components/Button'
import { shortifyString } from '../../../utils'
import { PlayerType } from '../../../models/Player.model'

export interface CharaSheetsProps {
    sheets: CH[]
    type: string | null
}

const CharacterSheets = ({ sheets, type }: CharaSheetsProps) => {
    const dm = type === PlayerType.DM ? true : false
    const [currPage, setCurrPage] = useState<number>(1)
    const currPageRef = useRef(currPage)
    currPageRef.current = currPage

    const generateThreePages = (current: number, max: number) => {
        const items: any = []

        if (current - 2 > 2) {
            items.push(
                <Col xs={{ span: 1 }} className={styles.paginationItem}>
                    <Button disabled={true}>{'...'}</Button>
                </Col>
            )
        }

        items.push(
            <Col xs={{ span: 2 }} className={styles.paginationItem}>
                <Button className={styles.selectedValue} disabled={true}>
                    {shortifyString(sheets[current - 1].name, 10)}
                </Button>
            </Col>
        )

        if (current + 2 < max) {
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
        items.push(...generateThreePages(currPageRef.current, sheets.length))
        items.push(
            <Col xs={{ span: 1 }} className={styles.paginationItem}>
                <Button
                    onClick={() =>
                        setCurrPage(currPageRef.current + 1 > sheets.length ? sheets.length : currPageRef.current + 1)
                    }
                >
                    {'>'}
                </Button>
            </Col>,
            <Col xs={{ span: 1 }} className={styles.paginationItem}>
                <Button onClick={() => setCurrPage(sheets.length)}>{'>>'}</Button>
            </Col>
        )

        return items
    }

    return (
        <Container className={`justify-content-center ${styles.container}`}>
            {sheets.length ? (
                <>
                    <Row>
                        {sheets.length > 1 ? (
                            <div className={styles.pagination}>
                                <Row className="justify-content-center">{generatePaginationItems()}</Row>
                            </div>
                        ) : (
                            <></>
                        )}
                    </Row>
                    <Row className="justify-content-center">
                        {sheets.length > 1 ? <Divider style={{ width: '80%' }} /> : <></>}
                    </Row>
                    <Row className="justify-content-center">
                        <>
                            <CharacterSheet currsheet={sheets[0]} dm={dm} />
                        </>
                    </Row>
                </>
            ) : (
                <p className={styles.empty}>No Character Sheets Availbale</p>
            )}
        </Container>
    )
}

export default CharacterSheets
