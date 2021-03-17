import closeIcon from '../../icons/closeIcon.png';
import onlineIcon from '../../icons/onlineIcon.png';
import styles from './InfoBar.module.css';

export interface IInfoBarProps {
  room: String,
}

export default function InfoBar (props: IInfoBarProps) {
  return (
    <div className={styles.infoBar}>
        <div className={styles.leftInnerContainer}>
            <img className={styles.onlineIcon} src={onlineIcon} alt="online icon" />
            <h3>{props.room}</h3>
        </div>

        <div className={styles.rightInnerContainer}>
            <a href="/">
                <img src={closeIcon} alt="close icon" />
            </a>
        </div>
    </div>
  );
}
