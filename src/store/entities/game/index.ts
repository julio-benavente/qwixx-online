import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import _ from "lodash";
import { BoxType, ColorsType, PenaltyType, PenaltyValuesType } from "@/types";
import { getDicesCombinations } from "@/helpers";

const colorsType: ColorsType[] = ["red", "yellow", "green", "blue"];
const numbers = _.range(2, 13);
const scoreSheet = colorsType
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
  dicesPossibleCombinations: {
    white: number[];
    red: number[];
    yellow: number[];
    green: number[];
    blue: number[];
  };
  dicesRolled: boolean;
  boxesSelected: number;
  scoreSheetRows: ScoreSheetRowsType;
  scoreSheetPoints: { [key in ColorsType]: number };
  scoreSheetPenalties: PenaltyType[];
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
  dicesPossibleCombinations: {
    white: [],
    red: [],
    yellow: [],
    green: [],
    blue: [],
  },
  dicesRolled: false,
  boxesSelected: 0,
  scoreSheetRows: scoreSheet,
  scoreSheetPoints: {
    red: 0,
    yellow: 0,
    green: 0,
    blue: 0,
  },
  scoreSheetPenalties: [
    {
      name: "first",
      selected: false,
      temporalySelected: false,
    },
    {
      name: "second",
      selected: false,
      temporalySelected: false,
    },
    {
      name: "third",
      selected: false,
      temporalySelected: false,
    },
    {
      name: "fourth",
      selected: false,
      temporalySelected: false,
    },
  ],
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
    endTurn: (state) => {
      // Validate there is at least one box selected
      // if not a penalty or one will be automatically selected
      // save all penalties
      // save all boxes selected
      for (let color of colorsType) {
        state.scoreSheetRows[color] = state.scoreSheetRows[color].map((e) => ({
          ...e,
          disabled: e.temporalyDisabled,
          selected: e.temporalySelected,
          temporalyDisabled: e.temporalyDisabled,
          temporalySelected: e.temporalySelected,
        }));
      }

      state.scoreSheetPenalties = state.scoreSheetPenalties.map((e) => ({
        ...e,
        selected: e.temporalySelected,
        temporalySelected: e.temporalySelected,
      }));
      state.done = initialState.done;
      state.dices = initialState.dices;
      state.dicesPossibleCombinations = initialState.dicesPossibleCombinations;
      state.dicesRolled = initialState.dicesRolled;
      state.boxesSelected = initialState.boxesSelected;
      state.penaltiesSelected = initialState.penaltiesSelected;
    },

    rollDices: (state) => {
      state.dicesRolled = true;

      // this functionality could be done on the server
      const dicesSelected = {
        whiteOne: _.random(1, 6),
        whiteTwo: _.random(1, 6),
        red: _.random(1, 6),
        yellow: _.random(1, 6),
        green: _.random(1, 6),
        blue: _.random(1, 6),
      };
      state.dices = dicesSelected;

      state.dicesPossibleCombinations = {
        white: [dicesSelected.whiteOne + dicesSelected.whiteTwo],
        red: [
          dicesSelected.red + dicesSelected.whiteOne,
          dicesSelected.red + dicesSelected.whiteTwo,
        ],
        yellow: [
          dicesSelected.yellow + dicesSelected.whiteOne,
          dicesSelected.yellow + dicesSelected.whiteTwo,
        ],
        green: [
          dicesSelected.green + dicesSelected.whiteOne,
          dicesSelected.green + dicesSelected.whiteTwo,
        ],
        blue: [
          dicesSelected.blue + dicesSelected.whiteOne,
          dicesSelected.blue + dicesSelected.whiteTwo,
        ],
      };
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
      const index = state.scoreSheetPenalties.findIndex((e) => e.name === name);
      const element = state.scoreSheetPenalties[index];

      if (element.temporalySelected) {
        state.penaltiesSelected -= 1;
      } else {
        state.penaltiesSelected += 1;
      }
      state.scoreSheetPenalties[index].temporalySelected =
        !state.scoreSheetPenalties[index].temporalySelected;
    },
    toggleEndTurn: (state) => {
      state.done = !state.done;
    },
  },
});

export const {
  endMyTurn,
  endTurn,
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
