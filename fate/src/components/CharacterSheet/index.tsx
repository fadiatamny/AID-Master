import { useState } from 'react'
import styles from './styles.module.css'
import { Col, Row, Container } from 'react-bootstrap'
import Button from '../Button'
import { CharacterSheet as ICharacterSheet } from '../../models/CharacterSheet.model'
import Input from '../Input'
import CharacterPicturePlaceholder from '../../assets/images/characterPicPlaceholder.png'
import EventsManager from '../../services/EventsManager'
import { SocketEvents } from '../../models/SocketEvents.model'

export interface CharaSheetProps {
    currsheet?: ICharacterSheet
    dm: boolean
    submitForm?: any
    playername?: string
}

const defaultCharacterSheet = (playername?: string): ICharacterSheet => {
    return {
        name: playername ?? 'Character name',
        abilities: [],
        equipment: [],
        level: 1,
        life: { current: 100, max: 100 },
        mana: { current: 100, max: 100 },
        shield: { current: 100, max: 100 },
        imageurl: ''
    }
}

const CharacterSheet = ({ currsheet, dm, submitForm, playername }: CharaSheetProps) => {
    const sheet = currsheet ?? defaultCharacterSheet(playername)
    const [newability, setNewability] = useState('')
    const [newequip, setNewequip] = useState('')
    const [abilities, setAbilities] = useState<string[]>(sheet.abilities)
    const [equipment, setEquipment] = useState<string[]>(sheet.equipment)
    const [level, setLevel] = useState(sheet.level)
    const [life, setLife] = useState(sheet.life)
    const [mana, setMana] = useState(sheet.mana)
    const [shield, setShield] = useState(sheet.shield)
    const [imageurl, setImageurl] = useState(sheet.imageurl)
    const imgURLPlaceholder = 'http://www.imagesharing.com/imageid/yourimage.png'

    const generateSheet = (): ICharacterSheet => {
        return {
            abilities: abilities,
            equipment: equipment,
            level: level,
            mana: mana,
            shield: shield,
            name: sheet.name,
            life: life,
            imageurl: imageurl
        }
    }

    const handleSubmit = () => {
        EventsManager.instance.trigger(SocketEvents.UPDATE_CHARACTER_SHEET, {
            roomId: sessionStorage.getItem('rid'),
            userId: localStorage.getItem('userId'),
            sheet: generateSheet()
        })
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
        const tmp = [...equipment, newequip]
        setEquipment(tmp)
        setNewequip('')
    }
    const changeImg = (e: any) => {
        setImageurl(e.target.value)
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
    const changeMaxLife = (e: any) => {
        setLife({ current: life.current, max: e.target.value })
    }
    const changeMaxMana = (e: any) => {
        setMana({ current: mana.current, max: e.target.value })
    }
    const changeMaxShield = (e: any) => {
        setShield({ current: shield.current, max: e.target.value })
    }

    const equipRemove = (eq: string) => {
        const tmp = [...equipment]
        const index = tmp.indexOf(eq)
        if (index !== -1) {
            tmp.splice(index, 1)
            setEquipment(tmp)
        }
    }

    return (
        <Container className="justify-content-center">
            <Row className="justify-content-center">
                <Col sm={9}>
                    <Input label="Name" placeholder="mr. Man" value={sheet.name} disabled />
                </Col>
                <Col sm={3}>
                    <Input
                        label="Level"
                        placeholder="1"
                        onChange={changeLevel}
                        value={level.toString()}
                        disabled={dm}
                    />
                </Col>
                <Col sm={12} className="justify-content-center">
                    <Row className="justify-content-center">
                        <Col>
                            <Input
                                label="HP"
                                placeholder="0"
                                value={life.current.toString()}
                                onChange={changeLife}
                                disabled={dm}
                            />
                            <Input
                                label="Max HP"
                                placeholder="100"
                                value={life.max.toString()}
                                onChange={changeMaxLife}
                                disabled={!submitForm}
                            />
                        </Col>
                        <Col>
                            <Input
                                label="Mana"
                                value={mana.current.toString()}
                                placeholder="0"
                                onChange={changeMana}
                                disabled={dm}
                            />
                            <Input
                                label="Max Mana"
                                value={mana.max.toString()}
                                placeholder="100"
                                onChange={changeMaxMana}
                                disabled={!submitForm}
                            />
                        </Col>
                        <Col>
                            <Input
                                label="Shield"
                                value={shield.current.toString()}
                                placeholder="0"
                                onChange={changeShield}
                                disabled={dm}
                            />
                            <Input
                                label="Max Shield"
                                value={shield.max.toString()}
                                placeholder="100"
                                onChange={changeMaxShield}
                                disabled={!submitForm}
                            />
                        </Col>
                    </Row>
                    <Row className="justify-content-center">
                        <Col className={styles.margin}>
                            <h3 className={`${styles.text}`}>Abilities</h3>
                            {dm ? null : (
                                <Input
                                    submitLabel="Add"
                                    onSubmit={abilityAdd}
                                    value={newability}
                                    placeholder="new ability"
                                    onChange={abilityChange}
                                    disabled={dm}
                                />
                            )}
                            <div className={`${styles.arrayCols}`}>
                                {abilities.length !== 0 ? (
                                    abilities.map((ability: string, key: number) => {
                                        return dm ? (
                                            <Input
                                                key={key}
                                                className={styles.text}
                                                value={ability}
                                                placeholder={ability}
                                                disabled
                                            />
                                        ) : (
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
                        <Col className={styles.margin}>
                            <h3 className={`${styles.text}`}>Equipment</h3>
                            {dm ? null : (
                                <Input
                                    submitLabel="Add"
                                    onSubmit={equipAdd}
                                    value={newequip}
                                    placeholder="new equipment"
                                    onChange={equipChange}
                                    disabled={dm}
                                />
                            )}
                            <div className={`${styles.arrayCols}`}>
                                {equipment.length !== 0 ? (
                                    equipment.map((eq: string, key: number) => {
                                        return dm ? (
                                            <Input
                                                key={key}
                                                className={styles.text}
                                                value={eq}
                                                placeholder={eq}
                                                disabled
                                            />
                                        ) : (
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
                        <img
                            className={styles.imageurl}
                            src={sheet.imageurl ? sheet.imageurl : CharacterPicturePlaceholder}
                        />
                        {dm ? null : (
                            <Input
                                className={styles.margin}
                                label="Image URL"
                                placeholder={imgURLPlaceholder}
                                value={sheet.imageurl}
                                onChange={changeImg}
                                disabled={dm}
                            />
                        )}
                    </Row>
                    <Row className="justify-content-center">
                        {dm || submitForm ? null : (
                            <Button onClick={handleSubmit}>
                                <p>Save Edits</p>
                            </Button>
                        )}
                        {submitForm ? (
                            <Button onClick={() => submitForm(generateSheet())}>
                                <p>Enter Room</p>
                            </Button>
                        ) : null}
                    </Row>
                </Col>
            </Row>
        </Container>
    )
}

export default CharacterSheet
