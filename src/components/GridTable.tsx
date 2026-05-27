import styles from "./GridTable.module.css";

export default function GridTable({ children }: { children: React.ReactNode })
{
    return (
        <div className={styles.gridTable}>
            <div className={styles.columnHeaders}>
                <div className={styles.columnHeader}>Encounter</div>
                <div className={styles.columnHeader}>Raid or Dungeon</div>
                <div className={styles.columnHeader}>Activity</div>
                <div className={styles.columnHeader}>Enemy Type(s)</div>
                <div className={styles.columnHeader}>Encounter Number</div>
                <div className={styles.columnHeader}>Expansion</div>
            </div>
            {children}
        </div>
    );
}
