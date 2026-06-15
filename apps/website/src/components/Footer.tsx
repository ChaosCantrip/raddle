import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

import styles from "./Footer.module.css";

export default function Footer()
{
    return (
        <footer className={styles.footer}>
            <p><a href={"https://github.com/ChaosCantrip/raddle"} target="_blank"rel="noopener noreferrer"><GitHubIcon /> RaDdle</a> v{process.env.NEXT_PUBLIC_VERSION_NUMBER} by <a href={"https://chaoscantrip.com"} target="_blank"rel="noopener noreferrer">ChaosCantrip</a></p>
            <p>Logo & Banner by <a href={"https://x.com/LukeCB14"} target="_blank"rel="noopener noreferrer">LukeCB14</a></p>
        </footer>
    )
}

function GitHubIcon()
{
    return (
        <FontAwesomeIcon icon={faGithub} className={styles.icon + " " + styles.github_icon} />
    )
}
