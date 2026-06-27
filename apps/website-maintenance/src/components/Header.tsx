import Image from "next/image";
import Link from "next/link";

import BannerImage from "@/../public/banner.webp";

import styles from "./Header.module.css";

export default function Header()
{
    return (
        <header className={styles.header}>
            <Link href="/" className={styles.link}>
                <Image src={BannerImage} className={styles.banner} alt="RaDdle" loading="eager"/>
            </Link>
        </header>
    )
}
