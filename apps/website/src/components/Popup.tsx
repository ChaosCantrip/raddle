import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquareXmark } from "@fortawesome/free-solid-svg-icons";

import styles from "./Popup.module.css";

type PopupProps = {
    open: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

export default function Popup({ open, onClose, children }: PopupProps) 
{
    if (!open) return null;

    return (
        <div className={styles.popup_overlay} onClick={onClose}>
            <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
                <button className={styles.close_button} onClick={onClose}>
                    <FontAwesomeIcon icon={faSquareXmark} className={styles.close_icon} />
                </button>
                {children}
            </div>
        </div>
    )
}
