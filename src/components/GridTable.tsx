import styles from "./GridTable.module.css";

export default function GridTable({ children }: { children: React.ReactNode })
{
    return (
        <div className={styles.gridTable}>
            {children}
        </div>
    );
}
