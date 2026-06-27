"use client";

import { useEffect, useRef, useState } from "react";
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
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() =>
    {
        function handlePointerDown(event: MouseEvent): void
        {
            if (!menuRef.current?.contains(event.target as Node))
            {
                setIsOpen(false);
            }
        }

        function handleEscape(event: KeyboardEvent): void
        {
            if (event.key === "Escape")
            {
                setIsOpen(false);
            }
        }

        document.addEventListener("mousedown", handlePointerDown);
        document.addEventListener("keydown", handleEscape);

        return () =>
        {
            document.removeEventListener("mousedown", handlePointerDown);
            document.removeEventListener("keydown", handleEscape);
        };
    }, []);

    return (
        <div className={styles.menu_root} ref={menuRef}>
            <button
                type="button"
                className={styles.main_button}
                aria-expanded={isOpen}
                aria-haspopup="menu"
                onClick={() =>
                {
                    setIsOpen((current) => !current);
                }}
            >
                <span>{session!.bungieName}</span>
                <span className={styles.chevron} aria-hidden="true">▾</span>
            </button>
            {isOpen ? (
                <div className={styles.dropdown} role="menu" aria-label="Account menu">
                    <div className={styles.dropdown_header} role="presentation">
                        <span className={styles.dropdown_label}>Signed in as</span>
                        <span className={styles.dropdown_value}>{session!.bungieName}</span>
                    </div>
                    <a className={styles.dropdown_link} href="/profile" role="menuitem">
                        View Profile
                    </a>
                    <a className={styles.dropdown_link} href="/account/settings" role="menuitem">
                        Account Settings
                    </a>
                    <a className={styles.dropdown_link} href="/logout" role="menuitem">
                        Log Out
                    </a>
                </div>
            ) : null}
        </div>
    )
}
