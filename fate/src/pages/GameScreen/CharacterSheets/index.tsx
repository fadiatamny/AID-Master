import React, { useState } from 'react'
import { Pagination } from 'react-bootstrap'
import { CharacterSheet as CH } from '../../../models/CharacterSheet.model'
import CharacterSheet from './CharacterSheet'
import styles from './CharacterSheet/styles.module.css'

export interface CharaSheetsProps {
    sheets: CH[]
    toggleSheets: any
    type: string | null
}

const CharacterSheets = ({ sheets, toggleSheets, type }: CharaSheetsProps) => {
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
        <>
            <Pagination className={styles.pagination}>{items}</Pagination>
            {sheets.map((sheet: CH, key: number) => {
                if (key === active) return <CharacterSheet currsheet={sheet} toggleSheets={toggleSheets} dm={dm} />
            })}
        </>
    )
}

export default CharacterSheets
