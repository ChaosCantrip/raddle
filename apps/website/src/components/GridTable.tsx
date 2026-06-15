import styles from "./GridTable.module.css";

type GridTableProps = {
    children: React.ReactNode;
}

export default function GridTable({ children }: GridTableProps)
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
