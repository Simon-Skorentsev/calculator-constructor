import React from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import styles from './App.module.css';
import { Canvas } from './features/canvas/Canvas';
import { Constructor } from './features/constructor/Constructor';
import { moveElements } from './features/elements/elementsSlice';
import { useAppDispatch } from './app/hooks';

function App() {
  const dispatch = useAppDispatch();
  
  const onDragEnd = (result: DropResult) => {
    dispatch(moveElements(result));
  };

  return (
    <div className={styles.app} tabIndex={0}>
      <DragDropContext onDragEnd={(result) => onDragEnd(result)}>
          <Canvas/>
          <Constructor/>
      </DragDropContext>
    </div>
  );
}

export default App;
