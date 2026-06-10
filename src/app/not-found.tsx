import styles from "./not-found.module.css";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretLeft } from "@fortawesome/free-solid-svg-icons";

export default function NotFound() 
{
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>404 - Not Found</h1>
            <p className={styles.message}>The page you are looking for does not exist.</p>
            <Link href="/" className={styles.homeLink}><HomeLinkIcon /> Home</Link>
        </div>
    );
}

function HomeLinkIcon()
{
    return <FontAwesomeIcon icon={faCaretLeft} className={styles.caretIcon} />;
}
