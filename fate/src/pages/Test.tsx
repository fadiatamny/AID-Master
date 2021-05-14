import Button from '../components/RoundButton/RoundButton'
import newGame from '../assets/images/CircleNew.png'
import uploadGame from '../assets/images/CircleUpload.png'

const Test = () => {
    const clickNew = () => {
        alert('click new')
    }

    const clickUpload = () => {
        alert('click upload')
    }

    return (
        <div>
            <p>testing</p>
            <Button img={newGame} onClick={clickNew} />
            <Button img={uploadGame} onClick={clickUpload} />
        </div>
    )
}

export default Test
