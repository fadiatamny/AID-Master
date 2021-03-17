import styles from './Message.module.css';

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
      <div className={`${styles.messageContainer} ${styles.justifyEnd}`}>
        <p className={`${styles.sentText} ${styles.prTen}`}>{props.name}</p>
        <div className={`${styles.messageBox} ${styles.backgroundBlue}`}>
            <p className={`${styles.messageText} ${styles.colorWhite}`}>{props.message}</p>
        </div>
      </div>
        )
        : (
        <div className={`${styles.messageContainer} ${styles.justifyStart}`}>
            <div className={`${styles.messageBox} ${styles.backgroundLight}`}>
                 <p className={`${styles.messageText} ${styles.colorDark}`}>{props.message}</p>
            </div>
            <p className={`${styles.sentText} ${styles.plTen}`}>{props.name}</p>
        </div>
        )
  );
}
