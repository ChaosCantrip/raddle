import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./page.module.css";
import { faSquareXTwitter } from "@fortawesome/free-brands-svg-icons";


export default function HomePage() 
{
    return (
        <div className={styles.content}>
            <div className={styles.textbox}>
                <h1>Sorry for the inconvenience!</h1>
                <p>RaDdle is temporarily down for maintenance!</p>
                <p>We should be back up and running in a couple of minutes.</p>
                <p>Thank you for your patience!</p>
                <p>If RaDdle has been down for a while, and I haven&apos;t mentioned long term maintenance, please let me know at <a href="https://x.com/ChaosCantrip" target="_blank"rel="noopener noreferrer">@ChaosCantrip <TwitterIcon /></a>, or any of my <a href="https://chaoscantrip.com" target="_blank"rel="noopener noreferrer">other socials</a>.</p>
            </div>
        </div>
    );
}

function TwitterIcon() 
{
    return (
        <FontAwesomeIcon icon={faSquareXTwitter} className={styles.twitter_icon} />
    )
}
