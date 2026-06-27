import Image from "next/image";
import Link from "next/link";

import BannerImage from "@/../public/banner.webp";
import { getSession } from "@/lib/auth";

import BungieLoginMenu from "./BungieLoginMenu";

import styles from "./Header.module.css";

export default async function Header()
{
    const session = await getSession();

    return (
        <header className={styles.header}>
            <Link href="/" className={styles.link}>
                <Image src={BannerImage} className={styles.banner} alt="RaDdle" loading="eager"/>
            </Link>
            <BungieLoginMenu session={session} />
        </header>
    )
}
