import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faUser } from "@fortawesome/free-solid-svg-icons";

import styles from "./Footer.module.css";

export default function Footer()
{
    return (
        <footer className={styles.footer}>
            <p><a href={"https://github.com/ChaosCantrip/raddle"} target="_blank"rel="noopener noreferrer"><GitHubIcon /> RaDdle</a> v{process.env.NEXT_PUBLIC_VERSION_NUMBER}</p>
            <p>by <a href={"https://chaoscantrip.com"} target="_blank"rel="noopener noreferrer"><UserIcon /> ChaosCantrip</a></p>
        </footer>
    )
}

function GitHubIcon()
{
    return (
        <FontAwesomeIcon icon={faGithub} className={styles.icon + " " + styles.github_icon} />
    )
}

function UserIcon()
{
    return (
        <FontAwesomeIcon icon={faUser} className={styles.icon + " " + styles.user_icon} />
    )
}
