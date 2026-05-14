import styles from "./GridRow.module.css";

export default function GridRow({ children }: { children: React.ReactNode })
{
    return (
        <div className={styles.gridRow}>
            {children}
        </div>
    );
}
