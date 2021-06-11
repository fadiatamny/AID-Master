import React, { useState } from 'react'
import { Type } from 'typescript'
import Input from '../../../../components/Input/Input'
import { CharacterSheet } from '../../../../models/CharacterSheet.model'

// type SheetType = {
//     class: string
//     alignment: string
//     armorClass: number
//     hitPoint: number
//     level: number
//     imageurl?: string
//     strenght: number
//     intelligence: number
//     wisdom: number
//     dexterity: number
//     constitution: number
//     charisma: number
//     poison?: number
//     magic?: number
//     paralysis?: number
//     dragon?: number
//     spells: number
//     abilities: string
//     skills: string
// }

export interface CharacterFormProps {
    sheet?: CharacterSheet
    setSheet?: any
}

const CharacterForm = ({ sheet, setSheet }: CharacterFormProps) => {
    const imgURLPlaceholder = 'https://i.pinimg.com/originals/85/e0/f5/85e0f5701d75fea54ac419ed35e99f54.jpg'
    const [abilities, setAbilities] = useState<string[]>(sheet?.abilities ?? [])
    const [equip, setEquip] = useState<string[]>(sheet?.equipment ?? [])
    const [level, setLevel] = useState(sheet?.level ?? 1)
    const [life, setLife] = useState(sheet?.life ?? { current: 100, max: 100 })
    const [mana, setMana] = useState(sheet?.mana ?? { current: 100, max: 100 })
    const [shield, setShield] = useState(sheet?.shield ?? { current: 100, max: 100 })
    // const name = sessionStorage('')

    // const imageChange = (e: any) => {
    //     setSheet(Object.assign({}, sheet, { imageurl: e.target.value }))
    // }

    // const imageChange = (e: any) => {
    //     setSheet(Object.assign({}, sheet, { imageurl: e.target.value }))
    // }

    return (
        <div className={`container-fluid row`}>
            <div className="col-6">
                    {/* <Input label="ability" placeholder="bum bum" onChange={abilityChange} value={sheet?.abilities} />
                    <Input label="name" placeholder="bum bum" onChange={nameChange} value={sheet?.name} />
                    <Input
                        label="Image URL"
                        placeholder={imgURLPlaceholder}
                        onChange={imageChange}
                        value={sheet?.imageurl}
                    /> */}
            </div>
            <div className="col-3">
                <Input label="Abilities" placeholder="6" />
            </div>
            <div className="col-3">
                <Input label="Equip" placeholder="6" />
            </div>
        </div>
    )
}

export default CharacterForm
