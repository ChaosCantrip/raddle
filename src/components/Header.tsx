import Image from "next/image";
import BannerImage from "@/../public/banner.webp";
import styles from "./Header.module.css";
import Link from "next/link";

export default function Header()
{
    return (
        <header className={styles.header}>
            <Link href="/" className={styles.link}>
                <Image src={BannerImage} className={styles.banner} alt="RaDdle"/>
            </Link>
        </header>
    )
}
