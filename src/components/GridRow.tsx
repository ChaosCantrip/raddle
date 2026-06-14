import styles from "./GridRow.module.css";

type GridRowProps = {
    className?: string;
    children: React.ReactNode;
}

export default function GridRow({ className, children }: GridRowProps)
{
    return (
        <div className={[styles.gridRow, className].filter(Boolean).join(" ")}>
            {children}
        </div>
    );
}
