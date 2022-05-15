import React from 'react';
import styles from "./Constructor.module.css";
import image from "./assets/image.svg";
import eye from "./assets/eye.svg";
import eyeActive from "./assets/eyeActive.svg";
import selector from "./assets/selector.svg";
import selectorActive from "./assets/selectorActive.svg";
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { Elements } from '../elements/Elements';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import cn from "classnames";
import { toggleSwitch } from '../elements/elementsSlice';

export function Constructor() {
  const dispatch = useAppDispatch();
  const column = useAppSelector(state => state.elementsSliceReducer.columns.constructor);
  const tasks = useAppSelector(state => state.elementsSliceReducer.tasks);
  const switchActive = useAppSelector(state => state.elementsSliceReducer.switchActive);

  const columnElements = column.taskIds.map(taskId => tasks[taskId]);

  return (
    <div>
      <div className={styles.switcher}>
        <div className={cn(styles.wrapper, {
          [styles.active]: switchActive === "runtime"
        })}
        onClick={() => dispatch(toggleSwitch())} >
          <img src={`${switchActive === "runtime" ? eyeActive : eye}`}
          />
          <span>Runtime</span>
        </div>
        <div className={cn(styles.wrapper, {
          [styles.active]: switchActive === "constructor" 
        })}
        onClick={() => dispatch(toggleSwitch())} >
          <img src={`${switchActive === "constructor" ? selectorActive : selector}`} />
          <span>Constructor</span>
        </div>
      </div>

      <Droppable droppableId={column.id} isDropDisabled={switchActive === "runtime"}>
        {(provided, snapshot) => (
          <div style={{ backgroundColor: `${snapshot.isDraggingOver ? "var(--light-blue)" : "white"}`, height: "480px" }}
            {...provided.droppableProps}
            ref={provided.innerRef}>
            {columnElements.length === 0 ?
              <div className={styles.border}>
                <img className={styles.image} src={image} />
                <span className={styles.main}>Перетащите сюда</span>
                <span className={styles.back}>любой элемент <br /> из левой панели</span>
              </div>
              : <div className={styles.dndWrapper} />}
            {columnElements.map((element, index) => (
              <Draggable draggableId={element.id} index={index} key={element.id}>
                {provided => (
                  <div
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}>
                    <Elements elId={element.id}/>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}