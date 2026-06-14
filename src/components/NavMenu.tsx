"use client";

import styles from "./NavMenu.module.css";
import { faBars, faHome } from "@fortawesome/free-solid-svg-icons";
import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useState } from "react";

export default function NavMenu() 
{
    const [isOpen, setOpen] = useState(false);

    return (
        <div className={styles.nav_menu}>
            <div className={styles.top} onClick={() => setOpen(!isOpen)}>
                <HamburgerIcon />
                <p>Menu</p>
            </div>
            <div className={styles.menu + " " + (isOpen ? styles.is_open : "")}>
                <NavMenuItem icon={faHome} href="/">Home</NavMenuItem>
                <NavMenuItem icon={faHome} href="/">Home</NavMenuItem>
                <NavMenuItem icon={faHome} href="/">Home</NavMenuItem>
                <NavMenuItem icon={faHome} href="/">Home</NavMenuItem>
                <NavMenuItem icon={faHome} href="/">Home</NavMenuItem>
            </div>
        </div>
    )
}

function NavMenuItem({ icon, href, children }: { icon: IconDefinition, href: string, children: React.ReactNode}) 
{
    return (
        <Link href={href} className={styles.nav_item}>
            <FontAwesomeIcon icon={icon} className={styles.nav_item_icon} />
            <p>{children}</p>
        </Link>
    )
}

function HamburgerIcon() 
{
    return (
        <FontAwesomeIcon icon={faBars} className={styles.hamburger_icon} />
    )
}
