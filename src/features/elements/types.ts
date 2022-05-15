export type TaskIds = "dial"
  | "operators"
  | "buttons"
  | "equal";

interface Tasks {
  [key: string]: { id: TaskIds }
}

export interface InitialState {
  tasks: Tasks,
  columns: {
      [key: string]: {
          id: string,
          taskIds: string[],
      },
      constructor: {
          id: "constructor",
          taskIds: string[]
      },
      dial: {
          id: "dial",
          taskIds: string[]
      },
      operators: {
          id: "operators",
          taskIds: string[],
      },
      buttons: {
          id: "buttons",
          taskIds: string[],
      },
      equal: {
          id: "equal",
          taskIds: string[],
      },
  };
  columnOrder: string[],
  switchActive: "constructor" | "runtime",
  calc: {
      calcValue: string,
      saved: {
          a: string,
          b: string,
          operator: string
      },
      calculated: boolean
  }
}