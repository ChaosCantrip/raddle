import styles from "./GridRow.module.css";

export default function GridRow({ children, className }: { children: React.ReactNode; className?: string })
{
    return (
        <div className={[styles.gridRow, className].filter(Boolean).join(" ")}>
            {children}
        </div>
    );
}
