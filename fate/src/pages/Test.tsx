import PlusMinus from '../components/PlusMinus/PlusMinus'
import Clickable from '../components/Clickable/Clickable'
import newGame from '../assets/images/CircleNew.png'
import uploadGame from '../assets/images/CircleUpload.png'
import Input from '../components/Input/Input'
import Message from '../components/Message/Message'

const Test = () => {
    const clickNew = () => {
        alert('click new')
    }

    const clickUpload = () => {
        alert('click upload')
    }

    const clickButtton = () => {
        alert('click button lol')
    }

    const username = 'Smittens the Unbroken'
    const playerName = 'Blake Holt'
    const messageText =
        'He removes his tall black hat to reveal a balding pate. “I apologize for disturbing you,” he says in a deep, monotone voice. “I assume you are adventurers for hire, and I seek your expertise for a small matter.”'

    return (
        <div>
            <h1 style={{ textAlign: 'center', fontSize: '48px' }}>testing page</h1>
            <Clickable onclick={clickNew}>
                <img src={newGame} />
            </Clickable>
            <Clickable onclick={clickUpload}>
                <img src={uploadGame} />
            </Clickable>
            <PlusMinus onClick={clickButtton}>
                <p>+</p>
            </PlusMinus>
            <PlusMinus onClick={clickButtton}>
                <p>-</p>
            </PlusMinus>
            <Input label="Character Name" placeholder="Smittens the Unbroken" />
            <Message username={username} playerName={playerName} messageText={messageText} myMessage={true} />
            <Message username={username} playerName={playerName} messageText={messageText} myMessage={false} />
        </div>
    )
}

export default Test
