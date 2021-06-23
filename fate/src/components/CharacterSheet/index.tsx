/* eslint-disable @typescript-eslint/no-empty-function */
import { useState, useRef } from 'react'
import styles from './styles.module.css'
import { Col, Row, Container } from 'react-bootstrap'
import Button from '../Button'
import { CharacterSheet as ICharacterSheet } from '../../models/CharacterSheet.model'
import Input from '../Input'
import CharacterPicturePlaceholder from '../../assets/images/characterPicPlaceholder.png'

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
    const [sheet, setSheet] = useState<ICharacterSheet>(currsheet ?? defaultCharacterSheet(playername))
    const sheetRef = useRef(sheet)
    sheetRef.current = sheet
    const [newability, setNewability] = useState('')
    const [newequip, setNewequip] = useState('')
    const [name, setName] = useState(sheet.name)
    const [abilities, setAbilities] = useState<string[]>(sheet.abilities)
    const [level, setLevel] = useState('')
    const [life, setLife] = useState('')
    const [mana, setMana] = useState('')
    const [shield, setShield] = useState('')
    const [imgurl, setImgurl] = useState('')
    const imgURLPlaceholder = 'http://www.imagesharing.com/imageid/yourimage.png'

    const handleSubmit = () => {
        //Have to notify server of this change. this isnt enough.
    }

    const abilityChange = (e: any) => {
        setNewability(e.target.value)
    }

    const abilityAdd = () => {
        setSheet(Object.assign({}, sheetRef.current, { abilities: [...sheetRef.current.abilities, newability] }))
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
    const changeLife = (e: any) => {}
    const changeMana = (e: any) => {}
    const changeShield = (e: any) => {}
    const changeMaxLife = (e: any) => {}
    const changeMaxMana = (e: any) => {}
    const changeMaxShield = (e: any) => {}

    const equipRemove = (eq: string) => {
        // if (index !== -1) {
        //     tmp.splice(index, 1)
        //     setEquip(tmp)
        // }
    }

    return (
        <Container className="justify-content-center">
            <Row className="justify-content-center">
                <Col sm={9}>
                    <Input label="Name" placeholder="mr. Man" onChange={changeName} value={name} disabled={dm} />
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
                                value={sheetRef.current.life.current.toString()}
                                onChange={changeLife}
                                disabled={dm}
                            />
                            <Input
                                label="Max HP"
                                placeholder="100"
                                value={sheetRef.current.life.max.toString()}
                                onChange={changeMaxLife}
                                disabled={!submitForm}
                            />
                        </Col>
                        <Col>
                            <Input
                                label="Mana"
                                value={sheetRef.current.mana.current.toString()}
                                placeholder="0"
                                onChange={changeMana}
                                disabled={dm}
                            />
                            <Input
                                label="Max Mana"
                                value={sheetRef.current.mana.max.toString()}
                                placeholder="100"
                                onChange={changeMaxMana}
                                disabled={!submitForm}
                            />
                        </Col>
                        <Col>
                            <Input
                                label="Shield"
                                value={sheetRef.current.shield.current.toString()}
                                placeholder="0"
                                onChange={changeShield}
                                disabled={dm}
                            />
                            <Input
                                label="Max Shield"
                                value={sheetRef.current.shield.max.toString()}
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
                                {sheetRef.current.abilities.length !== 0 ? (
                                    sheetRef.current.abilities.map((ability: string, key: number) => {
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
                                {sheetRef.current.equipment.length !== 0 ? (
                                    sheetRef.current.equipment.map((eq: string, key: number) => {
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
                            src={sheetRef.current.imageurl ? sheetRef.current.imageurl : CharacterPicturePlaceholder}
                        />
                        {dm ? null : (
                            <Input
                                className={styles.margin}
                                label="Image URL"
                                placeholder={imgURLPlaceholder}
                                value={sheetRef.current.imageurl}
                                onChange={changeImg}
                                disabled={dm}
                            />
                        )}
                    </Row>
                    <Row className="justify-content-center">
                        {true || dm || submitForm ? null : (
                            <Button onClick={handleSubmit}>
                                <p>Save Edits</p>
                            </Button>
                        )}
                        {submitForm ? (
                            <Button onClick={() => submitForm(sheet)}>
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
