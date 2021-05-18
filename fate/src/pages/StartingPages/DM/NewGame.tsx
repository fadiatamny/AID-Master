import styles from '../StartingPages.module.css'
import { Link } from 'react-router-dom'
import Form from 'react-bootstrap/Form'
import newCircle from '../../../assets/images/CircleNew.png'
import { useState } from 'react'

const NewGame = () => {
    const [campaign, setCampaign] = useState('')
    const [submitFlag, setSubmitFlag] = useState(false)

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault()
        setSubmitFlag(false)
        setCampaign(campaign)
        alert(campaign)
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCampaign(event.target.value)
    }

    return (
        <div className={styles.container}>
            <img src={newCircle} className={styles.roundImage} />
            <Form className={styles.textarea} onSubmit={handleSubmit}>
                <Form.Group controlId="campaignStory">
                    <Form.Label>Campaign Story</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={7}
                        readOnly={submitFlag}
                        onChange={handleChange}
                        value={campaign}
                    />
                </Form.Group>
                <input type="submit" value="submit" />
            </Form>
            <Link className={styles.backButton} to="/DMLogin">
                Back to Selection Page
            </Link>
            <Link className={styles.backButton} to="/">
                Back to Home Page
            </Link>
        </div>
    )
}

export default NewGame
