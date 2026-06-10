import Image from "next/image";
import BannerImage from "@/../public/banner.png";
import styles from "./Header.module.css";

export default function Header()
{
    return (
        <header className={styles.header}>
            <Image src={BannerImage} className={styles.banner} alt="RaDdle"/>
        </header>
    )
}
