import styles from "./Elements.module.css";
import React from "react";
import cn from 'classnames';
import { TaskIds } from "./types";
import { calculate, doubleClick, tapeNumber, tapeOperation } from "./elementsSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";

export function Elements({ elId }: { elId: TaskIds }) {
    const dispatch = useAppDispatch();
    const switchActive = useAppSelector(state => state.elementsSliceReducer.switchActive);
    const calcValue = useAppSelector(state => state.elementsSliceReducer.calc.calcValue);

    if (elId === "dial") {
        return (
            <div className={cn(styles.dialWrapper, {
                [styles.cursorPointer]: switchActive === "runtime"
            })}
                onDoubleClick={() => switchActive === "constructor" && dispatch(doubleClick(elId))}>
                <span className={styles.dial}>{calcValue}</span>
            </div>
        );
    }

    if (elId === "operators") {
        return (
            <div className={cn(styles.operators, {
                [styles.cursorPointer]: switchActive === "runtime"
            })} onDoubleClick={() => switchActive === "constructor" && dispatch(doubleClick(elId))}>
                {["/", "*", "-", "+"].map((operator, i) => (
                    <span key={i} className={styles.operator}
                        onClick={() => switchActive === "runtime" && dispatch(tapeOperation(operator))}>
                        {operator}
                    </span>
                ))}
            </div>
        );
    }

    if (elId === "buttons") {
        return (
            <div className={cn(styles.buttons, {
                [styles.cursorPointer]: switchActive === "runtime"
            })} onDoubleClick={() => switchActive === "constructor" && dispatch(doubleClick(elId))}>
                {["0", "7", "8", "9", "4", "5", "6", "1", "2", "3", "."].map((button, i) => {
                    return (
                        <span key={i} className={cn(styles.button, {
                            [styles.null]: button === "0"
                        })}
                            onClick={() => switchActive === "runtime" && dispatch(tapeNumber(button))} >
                            {button}
                        </span>
                    );
                })}
            </div>
        );
    }
    return (
        <div className={cn(styles.equalWrapper, {
            [styles.cursorPointer]: switchActive === "runtime"
        })} onDoubleClick={() => switchActive === "constructor" && dispatch(doubleClick(elId))}>
            <span className={styles.equal}
                onClick={() => switchActive === "runtime" && dispatch(calculate())}>
                =
            </span>
        </div>
    );
}