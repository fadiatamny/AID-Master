import React, { useState, useRef } from 'react'
import styles from './styles.module.css'
import { Modal } from 'react-bootstrap'
import Button from '../../../components/Button/Button'
import CharacterForm from './CharacterForm'
import { CharacterSheet as CH } from '../../../models/CharacterSheet.model'
import Input from '../../../components/Input/Input'

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

const CharacterSheet = () => {
    // const [show, setShow] = useState(false)
    // const handleClose = () => setShow(false)
    // const handleShow = () => setShow(true)
    const [sheet, setSheet] = useState<CH>()
    const sheetRef = useRef<CH>()

    const imgURLPlaceholder =
        'https://lh3.googleusercontent.com/proxy/-2InXxLiN8Pq3d60P7LxuhhTwyl1ljt5kSaieGtzwVxH8U-JZADocOfOQS5iElndk3D2-S9JXvVxt9L2wRzPtgEJ3FM9LZv8EDC8dZg'
    const [name, setName] = useState(sheet?.name ?? 'Character Name')
    const [abilities, setAbilities] = useState<string[]>(sheet?.abilities ?? [])
    const [newability, setNewability] = useState('')
    const [equip, setEquip] = useState<string[]>(sheet?.equipment ?? [])
    const [newequip, setNewequip] = useState('')
    const [level, setLevel] = useState(sheet?.level ?? 1)
    const [life, setLife] = useState(sheet?.life ?? { current: 100, max: 100 })
    const [mana, setMana] = useState(sheet?.mana ?? { current: 100, max: 100 })
    const [shield, setShield] = useState(sheet?.shield ?? { current: 100, max: 100 })
    const [imgurl, setImgurl] = useState(sheet?.imageurl ?? imgURLPlaceholder)

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
        <div className={`container-fluid justify-content-center ${styles.container}`}>
            <div className="row justify-content-center">
                <div className="col-9">
                    <Input label="Name" placeholder="mr. Man" onChange={changeName} value={name} />
                </div>
                <div className="col-3">
                    <Input label="Level" placeholder="1" onChange={changeLevel} value={level.toString()} />
                </div>
                <div className="col-12 justify-content-center">
                    <div className={`row justify-content-center `}>
                        <div className="col">
                            <Input label="HP" placeholder="0" value={life.current.toString()} onChange={changeLife} />
                            <Input label="HP" placeholder="100" value={life.max.toString()} disabled />
                        </div>
                        <div className="col">
                            <Input label="Mana" value={mana.current.toString()} placeholder="0" onChange={changeMana} />
                            <Input label="Mana" value={mana.max.toString()} placeholder="100" disabled />
                        </div>
                        <div className="col">
                            <Input
                                label="Shield"
                                value={shield.current.toString()}
                                placeholder="0"
                                onChange={changeShield}
                            />
                            <Input label="Shield" value={shield.max.toString()} placeholder="100" disabled />
                        </div>
                    </div>
                    <div className="row justify-content-center">
                        <div className="col">
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
                        </div>
                        <div className="col">
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
                        </div>
                    </div>
                    <div className="row justify-content-center">
                        <img className={styles.imageurl} src={imgurl} />
                        <Input label="Image URL" placeholder={imgURLPlaceholder} value={imgurl} onChange={changeImg} />
                    </div>
                    <div className="row justify-content-center">
                        <Button onClick={handleSubmit}>
                            <p>Save Edits</p>
                        </Button>
                    </div>
                </div>
            </div>

            {/* <>
                <Button onClick={handleShow}>
                    <p>Edit Info</p>
                </Button>

                <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false} size="xl">
                    <Modal.Header>
                        <Modal.Title>Character Sheet Update</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <CharacterForm sheet={sheet} setSheet={setSheet} />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={handleClose}>
                            <p>Close</p>
                        </Button>
                    </Modal.Footer>
                </Modal>
            </> */}
        </div>
    )
}

export default CharacterSheet