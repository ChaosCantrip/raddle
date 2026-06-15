"use client";

import styles from "./error.module.css";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function ErrorPage({ error, unstable_retry }: { error: Error, unstable_retry: () => void })
{
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Something went wrong!</h1>
            <p className={styles.message}>That&apos;s not ideal :(</p>
            <button onClick={unstable_retry} className={styles.button}>Reload</button>
        </div>
    );
}
