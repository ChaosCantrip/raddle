import styles from "./Footer.module.css";

export default function Footer()
{
    return (
        <footer className={styles.footer}>
            <p className={styles.version_number}>RaDdle v{process.env.NEXT_PUBLIC_VERSION_NUMBER}</p>
            <p>by ChaosCantrip</p>
        </footer>
    )
}
