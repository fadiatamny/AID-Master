import { useState } from 'react'
import styles from './styles.module.css'
import { Row, Container, Pagination } from 'react-bootstrap'
import { CharacterSheet as CH } from '../../../models/CharacterSheet.model'
import CharacterSheet from '../../../components/CharacterSheet'
import Divider from '../../../components/Divider'

export interface CharaSheetsProps {
    sheets: CH[]
    type: string | null
}

const CharacterSheets = ({ sheets, type }: CharaSheetsProps) => {
    const dm = type === 'dm' ? true : false
    const [active, setActive] = useState<number>(1)
    const items: any[] = []

    const clickPagination = (item: number) => {
        setActive(item)
    }
    sheets.map((sheet: CH, key: number) =>
        items.push(
            <Pagination.Item
                key={key}
                className={active === key ? styles.activepage : ''}
                active={key === active}
                onClick={() => clickPagination(key)}
                activeLabel=""
            >
                {sheet.name}
            </Pagination.Item>
        )
    )

    return (
        <Container className={`justify-content-center ${styles.container}`}>
            {sheets.length ? (
                <>
                    <Row>
                        {sheets.length > 1 ? <Pagination className={styles.pagination}>{items}</Pagination> : <></>}
                    </Row>
                    <Row className="justify-content-center">
                        {sheets.length > 1 ? <Divider style={{ width: '80%' }} /> : <></>}
                    </Row>
                    <Row>
                        <CharacterSheet currsheet={sheets[0]} dm={dm} />
                    </Row>
                </>
            ) : (
                <p className={styles.empty}>No Character Sheets Availbale</p>
            )}
        </Container>
    )
}

export default CharacterSheets
