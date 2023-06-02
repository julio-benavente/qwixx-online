import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import _ from "lodash";
import { BoxType, ColorsType, PenaltyValuesType } from "@/types";
import { getDicesCombinations } from "@/helpers";

const dicesColor: ColorsType[] = ["red", "yellow", "green", "blue"];
const numbers = _.range(2, 13);
const scoreSheet = dicesColor
  .map((color: ColorsType) => {
    const array = numbers.map((number) => ({
      name: `${color}-${number}`,
      color,
      number,
      selected: false,
      temporalySelected: false,
      disabled: false,
      temporalyDisabled: false,
    }));

    const formatArray = ["green", "blue"].includes(color)
      ? array.reverse()
      : array;

    formatArray.push({
      name: `${color}-lock`,
      color,
      number: 0,
      selected: false,
      temporalySelected: false,
      disabled: false,
      temporalyDisabled: false,
    });
    return { [color]: array };
  })
  .reduce((a, b) => Object.assign(a, b), {}) as ScoreSheetRowsType;

interface Dices {
  whiteOne: number;
  whiteTwo: number;
  red: number;
  yellow: number;
  green: number;
  blue: number;
}

type ScoreSheetRowsType = {
  [key in ColorsType]: BoxType[];
};

interface InitialStateProps {
  isMyTurn: boolean;
  done: boolean;
  dices: Dices;
  dicesCombinationsPossible: [];
  dicesRolled: boolean;
  boxesSelected: number;
  scoreSheetRows: ScoreSheetRowsType;
  scoreSheetPoints: { [key in ColorsType]: number };
  scoreSheetPenalties: {
    [key in PenaltyValuesType]: { name: PenaltyValuesType; selected: boolean };
  };
  penaltiesSelected: number;
  scoreSheetPenaltyPoints: number;
}

const initialState: InitialStateProps = {
  isMyTurn: false,
  done: false,
  dices: {
    whiteOne: 0,
    whiteTwo: 0,
    red: 0,
    yellow: 0,
    green: 0,
    blue: 0,
  },
  dicesCombinationsPossible: [],
  dicesRolled: false,
  boxesSelected: 0,
  scoreSheetRows: scoreSheet,
  scoreSheetPoints: {
    red: 0,
    yellow: 0,
    green: 0,
    blue: 0,
  },
  scoreSheetPenalties: {
    first: {
      name: "first",
      selected: false,
    },
    second: {
      name: "second",
      selected: false,
    },
    third: {
      name: "third",
      selected: false,
    },
    fourth: {
      name: "fourth",
      selected: false,
    },
  },
  penaltiesSelected: 0,
  scoreSheetPenaltyPoints: 0,
};

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    reset: (state) => {
      state = initialState;
    },
    startMyTurn: (state) => {
      state.isMyTurn = true;
    },
    endMyTurn: (state) => {
      state.isMyTurn = false;
    },
    rollDices: (state) => {
      state.dicesRolled = true;
    },
    setDices: (state, action: PayloadAction<Dices>) => {
      state.dices = {
        whiteOne: action.payload.whiteOne,
        whiteTwo: action.payload.whiteTwo,
        red: action.payload.red,
        yellow: action.payload.yellow,
        green: action.payload.green,
        blue: action.payload.blue,
      };
    },
    increaseBoxesSelected: (state) => {
      state.boxesSelected = state.boxesSelected + 1;
    },
    decreaseBoxesSelected: (state) => {
      state.boxesSelected = state.boxesSelected - 1;
    },
    toggleCheckBox: (
      state,
      action: PayloadAction<{ color: ColorsType; name: string }>
    ) => {
      const { color, name } = action.payload;
      const row = state.scoreSheetRows[color];
      const index = row.findIndex((e) => e.name === name);
      const element = row[index];
      element.temporalySelected = !element.temporalySelected;
      const selectedBoxLastIndex = row.findLastIndex(
        (e) => e.selected || e.temporalySelected
      );

      if (!element.temporalySelected) {
        state.scoreSheetRows[action.payload.color] = row.map((e, i) => ({
          ...e,
          temporalyDisabled:
            selectedBoxLastIndex === -1 // if there is no box checked
              ? false
              : selectedBoxLastIndex <= i // all boxes after the first checked
              ? false
              : true,
        }));

        state.scoreSheetPoints[color] -= 1;
      }

      if (element.temporalySelected) {
        state.scoreSheetRows[action.payload.color] = row.map((e, i) => ({
          ...e,
          temporalyDisabled: i < index ? true : false,
        }));

        state.scoreSheetPoints[color] += 1;
      }
    },
    disableBox: (
      state,
      action: PayloadAction<{ color: ColorsType; name: string }>
    ) => {
      const row = state.scoreSheetRows[action.payload.color];
      const index = row.findIndex((e) => e.name === action.payload.name);
      const element = row[index];
      element.disabled = true;
    },
    togglePenalty: (
      state,
      action: PayloadAction<{ name: PenaltyValuesType }>
    ) => {
      const { name } = action.payload;
      state.scoreSheetPenalties[name].selected =
        !state.scoreSheetPenalties[name].selected;
    },
    toggleEndTurn: (state) => {
      state.done = !state.done;
    },
  },
});

export const {
  endMyTurn,
  reset,
  rollDices,
  setDices,
  startMyTurn,
  increaseBoxesSelected,
  decreaseBoxesSelected,
  toggleCheckBox,
  disableBox,
  togglePenalty,
  toggleEndTurn,
} = gameSlice.actions;

export default gameSlice.reducer;
