import React, { useRef } from 'react';
import styles from './Canvas.module.css';
import cn from 'classnames';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { Elements } from '../elements/Elements';
import { useAppSelector } from '../../app/hooks';

export function Canvas() {
  const elements = ["dial", "operators", "buttons", "equal"];
  const [dial, operators, buttons, equal] = [useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null)]
  const refs = [dial, operators, buttons, equal];

  return (
    <div className={styles.canvas}>
      <div className={styles.opacityElements}>
        <div className={styles.dialWrapper} ref={dial}>
          <span className={styles.dial}>0</span>
        </div>
        <div className={styles.operators} ref={operators}>
          <span className={styles.operator}>/</span>
          <span className={styles.operator}>*</span>
          <span className={styles.operator}>-</span>
          <span className={styles.operator}>+</span>
        </div>
        <div className={styles.buttons} ref={buttons}
        >
          <span className={cn(styles.button, styles.null)}>0</span>
          <span className={styles.button}>7</span>
          <span className={styles.button}>8</span>
          <span className={styles.button}>9</span>
          <span className={styles.button}>4</span>
          <span className={styles.button}>5</span>
          <span className={styles.button}>6</span>
          <span className={styles.button}>1</span>
          <span className={styles.button}>2</span>
          <span className={styles.button}>3</span>
          <span className={styles.button}>.</span>
        </div>
        <div className={styles.equalWrapper} ref={equal}>
          <span className={styles.equal}>=</span>
        </div>
      </div>

      {elements.map((columnId, columnIndex) => {
        const column = useAppSelector(state => state.elementsSliceReducer.columns[columnId]);
        const tasks = useAppSelector(state => state.elementsSliceReducer.tasks);
        const columnElements = column.taskIds.map(taskId => tasks[taskId]);
        const height = refs[columnIndex].current?.clientHeight;
        return (
          <Droppable key={column.id} ignoreContainerClipping={true} droppableId={column.id}
            isDropDisabled={true}>
            {(provided) => (
              <div style={{ height: `${height && height}px`, marginTop: `${columnIndex !== 0 ? "12px" : "0px"}` }}
                {...provided.droppableProps}
                ref={provided.innerRef} >
                {columnElements.map((element, index) => (
                  <Draggable draggableId={element.id} index={index} key={element.id}>
                    {provided => (
                      <div
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}>
                        <Elements elId={element.id} />
                      </div>
                    )}
                  </Draggable>
                )
                )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        );
      })}
    </div>
  );
}
