import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DropResult } from "react-beautiful-dnd";
import { InitialState, TaskIds } from "./types";

const initialState: InitialState = {
    tasks: {
        dial: { id: "dial" },
        operators: { id: "operators", },
        buttons: { id: "buttons" },
        equal: { id: "equal" }
    },
    columns: {
        dial: {
            id: "dial",
            taskIds: ["dial"]
        },
        operators: {
            id: "operators",
            taskIds: ["operators"],
        },
        buttons: {
            id: "buttons",
            taskIds: ["buttons"],
        },
        equal: {
            id: "equal",
            taskIds: ["equal"],
        },
        constructor: {
            id: "constructor",
            taskIds: [],
        }
    },
    columnOrder: ["dial", "operators", "buttons", "equal", "constructor"],
    switchActive: "constructor",
    calc: {
        calcValue: "0",
        saved: {
            a: "0",
            b: "0",
            operator: ""
        },
        calculated: false
    }
};

export const elementsSlice = createSlice({
    name: "Elements",
    initialState,
    reducers: {
        moveElements(state, action: PayloadAction<DropResult>) {
            const result = action.payload;
            const { destination, source, draggableId } = result;

            if (!destination) {
                return;
            }

            const startColumn = state.columns[source.droppableId];
            const finishColumn = state.columns[destination.droppableId];

            //1 column and 1 card
            if (
                destination.droppableId === source.droppableId &&
                destination.index === source.index
            ) {
                return;
            }

            //1 column and different cards
            if (startColumn === finishColumn) {
                const newTaskIds = startColumn.taskIds;
                newTaskIds.splice(source.index, 1);
                newTaskIds.splice(destination.index, 0, draggableId); 
                return;
            }

            //from column to another column
            const startTaskIds = startColumn.taskIds;
            const finishTaskIds = finishColumn.taskIds;

            startTaskIds.splice(source.index, 1);
            finishTaskIds.splice(destination.index, 0, draggableId); 
        },
        doubleClick(state, action: PayloadAction<TaskIds>) {
            const elId = action.payload;

            if (state.columns.constructor.taskIds.indexOf(elId) !== -1) {
                const initialColumn = state.columns[elId];
                const currentColumn = state.columns.constructor;
                const elementIndex = currentColumn.taskIds.indexOf(elId);
    
                initialColumn.taskIds.push(elId);
                currentColumn.taskIds.splice(elementIndex, 1);
            }
        },
        toggleSwitch(state) {
            state.switchActive = state.switchActive === "constructor" ? "runtime" : "constructor";
        },
        tapeNumber(state, action: PayloadAction<string>) {
            const number = action.payload;

            if (state.calc.calcValue === "0") {
                if (number === ".") {
                    state.calc.calcValue = "0";
                } else {
                    state.calc.calcValue = "";
                }
            }

            if (isNaN(+state.calc.calcValue) || state.calc.calculated === true) {
                state.calc.calcValue = number;
                state.calc.calculated = false;
            } else if (state.calc.calcValue.toString().length < 9) {
                state.calc.calcValue += number;   
            }
        },
        tapeOperation(state, action: PayloadAction<string>) {
            const operator = action.payload;

            state.calc.calculated = false;

            if (isNaN(+state.calc.calcValue)) {  //if misclick (2+-2 ==> 2-2)
                state.calc.saved.operator = operator;
                state.calc.calcValue = operator;
            } else {
                state.calc.saved.a = state.calc.calcValue;
                state.calc.saved.operator = operator;
                state.calc.calcValue = operator;
            }
        },
        calculate(state) {
            const round = (a: number, b: number) => Math.round(a*b)/b;

            if (state.calc.calcValue.toString().search(/[^0-9*/+-.]/mi) !== -1) return;

            try {
                if (state.calc.calculated === false) {
                    state.calc.saved.b = state.calc.calcValue;
                }

                let out = eval(state.calc.saved.a + state.calc.saved.operator + state.calc.saved.b);
                if (out !== Infinity) {
                    out = round(+out, 10_000_000);
                    out.toString().length > 9 ? state.calc.calcValue = "over" : state.calc.calcValue = out;
                    state.calc.saved.a = out;
                } else {
                    state.calc.calcValue = "error";
                }
                
                state.calc.calculated = true;
            } catch {
                state.calc.calcValue = "error";
            }
        }
    },
    extraReducers: {

    }
});

export default elementsSlice.reducer;
export const { moveElements, doubleClick, toggleSwitch, tapeNumber, tapeOperation, calculate } = elementsSlice.actions;