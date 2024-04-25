import styles from './CellInDifferentFile.module.scss';
export function CellInDifferentFile() {
    return (
        <div className={styles.mycell}>
            <p>Cell in a different file</p>
        </div>
    );
}