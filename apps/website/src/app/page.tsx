import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretRight } from "@fortawesome/free-solid-svg-icons";

import styles from "./page.module.css";


export default function HomePage() 
{
    return (
        <div className={styles.content}>
            <div className={styles.introduction}>
                <p className={styles.mainText}>Welcome to RaDdle!</p>
                <p className={styles.subText}>Play <span className={styles.daily}>Daily</span> to guess today&apos;s Raid or Dungeon Encounter!</p>
                <Link href="/daily" className={styles.button + " " + styles.dailyLink}>
                    Play Daily <CaretRightIcon />
                </Link>
                <p className={styles.subText}>Or play <span className={styles.arcade}>Arcade</span> to guess random Encounters to your heart&apos;s content!</p>
                <Link href="/arcade" className={styles.button + " " + styles.arcadeLink}>
                    Play Arcade <CaretRightIcon />
                </Link>
            </div>
        </div>
    );
}

function CaretRightIcon()
{
    return <FontAwesomeIcon icon={faCaretRight} className={styles.caretIcon} />;
}
