"use client";

import Image from "next/image";

import BungieShieldSVG from "../../public/bungie_shield.svg";
import styles from "./BungieLoginMenu.module.css";

interface BungieLoginMenuProps {
    session: { bungieName: string} | null
}

export default function BungieLoginMenu({ session } : BungieLoginMenuProps) 
{
    return (
        <div className={styles.wrapper}>
            {session ? (
                <LoggedInMenu session={session} />
            ) : (
                <LoginWithBungieButton />
            )}
        </div>
    )
}

function LoginWithBungieButton() 
{
    return (
        <a className={styles.main_button} href="/api/auth/bungie/start">
            <Image src={BungieShieldSVG} className={styles.bungie_logo} alt="" />
            <p>Login With Bungie</p>
        </a>
    )
}

function LoggedInMenu({ session } : BungieLoginMenuProps) 
{
    return (
        <div className={styles.main_button}>
            <p>{session!.bungieName}</p>
        </div>
    )
}
