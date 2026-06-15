"use client";

import { useEffect } from "react";

import styles from "./Toast.module.css";

type ToastProps = {
    message: string;
    onClose: () => void;
}

export default function Toast({ message, onClose }: ToastProps) 
{
    useEffect(() => 
    {
        const t = setTimeout(onClose, 2000);
        return () => clearTimeout(t);
    }, [onClose]);

    return (
        <div className={styles.toast}>
            {message}
        </div>
    );
}
