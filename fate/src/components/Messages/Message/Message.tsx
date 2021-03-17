import './Message.module.css';

export interface IMessageProps {
    message: string,
    name: string
}

export default function Message (props: IMessageProps) {
    let isSentByCurrentUser = false;
    // const { text, user } = props.message;
    // console.log(user);
    // const trimmedName = user.trim().toLowerCase();
    
    // if(props.name === trimmedName){
    //     isSentByCurrentUser = true;
    // }
    
    return(
        isSentByCurrentUser ? (
      <div className="messageContainer justifyEnd">
        <p className="sentText pr-10">{props.name}</p>
        <div className="messageBox backgroundBlue">
            <p className="messageText colorWhite">{props.message}</p>
        </div>
      </div>
        )
        : (
        <div className="messageContainer justifyStart">
            <div className="messageBox backgroundLight">
                 <p className="messageText colorDark">{props.message}</p>
            </div>
            <p className="sentText pl-10">{props.name}</p>
        </div>
        )
  );
}
