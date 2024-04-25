import clsx from 'clsx';
import styles from './PageWithGrid.module.scss';
import { CellInDifferentFile } from './CellInDifferentFile';

export function PageWithGrid() {
    return (
        <div className={clsx(styles.container)}>
            <div className={clsx(styles['grid-item'], styles.cell1)}>Cell 1</div>
            <div className={clsx(styles['grid-item'], styles.cell2)}>Cell 2</div>
            <CellInDifferentFile />
        </div>
    );
}