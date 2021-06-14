import React, { useState, useRef } from 'react'
import styles from './styles.module.css'
import { Col, Row, Container } from 'react-bootstrap'
import Button from '../../../components/Button/Button'
import { CharacterSheet as CH } from '../../../models/CharacterSheet.model'
import Input from '../../../components/Input/Input'
import CHPplaceholder from '../../../assets/images/characterPicPlaceholder.png'

export interface CharaSheetProps {
    sheets: CH[]
    setSheets: any
    showsheet: boolean
    toggleSheets: any
}

const CharacterSheet = ({ sheets, setSheets, showsheet, toggleSheets }: CharaSheetProps) => {
    const [sheet, setSheet] = useState<CH>()
    const sheetRef = useRef<CH>()

    const imgURLPlaceholder = 'http://www.imagesharing.com/imageid/yourimage.png'
    const [name, setName] = useState(sheet?.name ?? 'Character Name')
    const [abilities, setAbilities] = useState<string[]>(sheet?.abilities ?? [])
    const [newability, setNewability] = useState('')
    const [equip, setEquip] = useState<string[]>(sheet?.equipment ?? [])
    const [newequip, setNewequip] = useState('')
    const [level, setLevel] = useState(sheet?.level ?? 1)
    const [life, setLife] = useState(sheet?.life ?? { current: 100, max: 100 })
    const [mana, setMana] = useState(sheet?.mana ?? { current: 100, max: 100 })
    const [shield, setShield] = useState(sheet?.shield ?? { current: 100, max: 100 })
    const [imgurl, setImgurl] = useState(sheet?.imageurl ?? '')

    const handleSubmit = () => {
        const tmp = {
            abilities: abilities,
            equipment: equip,
            level: level,
            mana: mana,
            shield: shield,
            name: name,
            life: life,
            imageurl: imgurl
        }
        try {
            setSheet(tmp)
            alert('save successful' + sheet?.toString())
        } catch {
            alert('failed saving info')
        }
    }

    const abilityChange = (e: any) => {
        setNewability(e.target.value)
    }

    const abilityAdd = () => {
        const tmp = [...abilities, newability]
        setAbilities(tmp)
        setNewability('')
    }

    const abilityRemove = (ability: string) => {
        const tmp = [...abilities]
        const index = tmp.indexOf(ability)
        if (index !== -1) {
            tmp.splice(index, 1)
            setAbilities(tmp)
        }
    }

    const equipChange = (e: any) => {
        setNewequip(e.target.value)
    }

    const equipAdd = () => {
        const tmp = [...equip, newequip]
        setEquip(tmp)
        setNewequip('')
    }

    const changeName = (e: any) => {
        setName(e.target.value)
    }

    const changeImg = (e: any) => {
        setImgurl(e.target.value)
    }

    const changeLevel = (e: any) => {
        setLevel(e.target.value)
    }
    const changeLife = (e: any) => {
        setLife({ current: e.target.value, max: life.max })
    }
    const changeMana = (e: any) => {
        setMana({ current: e.target.value, max: mana.max })
    }
    const changeShield = (e: any) => {
        setShield({ current: e.target.value, max: shield.max })
    }

    const equipRemove = (eq: string) => {
        const tmp = [...equip]
        const index = tmp.indexOf(eq)
        if (index !== -1) {
            tmp.splice(index, 1)
            setEquip(tmp)
        }
    }

    return (
        <Container className={`justify-content-center ${styles.container}`}>
            <Row className="justify-content-center">
                <Col sm={9}>
                    <Input label="Name" placeholder="mr. Man" onChange={changeName} value={name} />
                </Col>
                <Col sm={3}>
                    <Input label="Level" placeholder="1" onChange={changeLevel} value={level.toString()} />
                </Col>
                <Col sm={12} className="justify-content-center">
                    <Row className={`justify-content-center `}>
                        <Col>
                            <Input label="HP" placeholder="0" value={life.current.toString()} onChange={changeLife} />
                            <Input label="HP" placeholder="100" value={life.max.toString()} disabled />
                        </Col>
                        <Col>
                            <Input label="Mana" value={mana.current.toString()} placeholder="0" onChange={changeMana} />
                            <Input label="Mana" value={mana.max.toString()} placeholder="100" disabled />
                        </Col>
                        <Col>
                            <Input
                                label="Shield"
                                value={shield.current.toString()}
                                placeholder="0"
                                onChange={changeShield}
                            />
                            <Input label="Shield" value={shield.max.toString()} placeholder="100" disabled />
                        </Col>
                    </Row>
                    <Row className="justify-content-center">
                        <Col>
                            <h3 className={`${styles.text}`}>Abilities</h3>
                            <Input
                                submitLabel="Add"
                                onSubmit={abilityAdd}
                                value={newability}
                                placeholder="new ability"
                                onChange={abilityChange}
                            />
                            <div className={`${styles.arrayCols}`}>
                                {abilities.length !== 0 ? (
                                    abilities.map((ability: string, key: number) => {
                                        return (
                                            <Input
                                                key={key}
                                                className={styles.text}
                                                value={ability}
                                                submitLabel="X"
                                                onSubmit={() => abilityRemove(ability)}
                                                placeholder={ability}
                                                disabled
                                            />
                                        )
                                    })
                                ) : (
                                    <p className={styles.text}>no abilities</p>
                                )}
                            </div>
                        </Col>
                        <Col>
                            <h3 className={`${styles.text}`}>Equipment</h3>
                            <Input
                                submitLabel="Add"
                                onSubmit={equipAdd}
                                value={newequip}
                                placeholder="new equipment"
                                onChange={equipChange}
                            />
                            <div className={`${styles.arrayCols}`}>
                                {equip.length !== 0 ? (
                                    equip.map((eq: string, key: number) => {
                                        return (
                                            <Input
                                                key={key}
                                                className={styles.text}
                                                value={eq}
                                                submitLabel="X"
                                                onSubmit={() => equipRemove(eq)}
                                                placeholder={eq}
                                                disabled
                                            />
                                        )
                                    })
                                ) : (
                                    <p className={styles.text}>no equipment</p>
                                )}
                            </div>
                        </Col>
                    </Row>
                    <Row className="justify-content-center">
                        <img className={styles.imageurl} src={imgurl ? imgurl : CHPplaceholder} />
                        <Input label="Image URL" placeholder={imgURLPlaceholder} value={imgurl} onChange={changeImg} />
                    </Row>
                    <Row className="justify-content-center">
                        <Button onClick={handleSubmit}>
                            <p>Save Edits</p>
                        </Button>

                        <Button onClick={toggleSheets}>
                            <p>Hide Sheet</p>
                        </Button>
                    </Row>
                </Col>
            </Row>
        </Container>
    )
}

export default CharacterSheet
