export interface IInputProps {
  message: string,
  setMessage: Function
  sendMessage: Function
}

export default function Input (props: IInputProps) {
  return (
    <form className="form">
        <input
        className="input"
        type="text"
        placeholder="Type a message..."
        value={props.message}
        onChange={(event) => props.setMessage(event.target.value)}
        onKeyPress={event => event.key === 'Enter' ? props.sendMessage(event) : null}
        />
        <button className="sendButton" onClick={(event) => props.sendMessage(event)}>Send</button>
    </form>
    );
}
