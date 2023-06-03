import clsx from "clsx";
import React, { useState } from "react";
import { MdLockOutline, MdOutlineLockOpen, MdClose } from "react-icons/md";
import { twMerge as tm } from "tailwind-merge";
import _, { divide } from "lodash";
import { useAppDispatch, useAppSelector } from "@/store-hooks";
import { BoxType, ColorsType, PenaltyType, PenaltyValuesType } from "@/types";
import {
  decreaseBoxesSelected,
  disableBox,
  increaseBoxesSelected,
  toggleCheckBox,
  toggleEndTurn,
  togglePenalty,
} from "@/ent-game";

const scoresIndicators = [
  { numberOfX: 1, score: 1 },
  { numberOfX: 2, score: 2 },
  { numberOfX: 3, score: 6 },
  { numberOfX: 4, score: 10 },
  { numberOfX: 5, score: 15 },
  { numberOfX: 6, score: 21 },
  { numberOfX: 7, score: 28 },
  { numberOfX: 8, score: 36 },
  { numberOfX: 9, score: 45 },
  { numberOfX: 10, score: 55 },
  { numberOfX: 11, score: 66 },
  { numberOfX: 12, score: 78 },
];

const ScoreSheet = () => {
  const scoreSheet = useAppSelector((state) => state.game.scoreSheetRows);
  return (
    <div className="grid grid-flow-col justify-center gap-4">
      <div className="grid grid-flow-row gap-y-1 justify-center">
        <ColorRow colorRow={scoreSheet.red} />
        <ColorRow colorRow={scoreSheet.yellow} />
        <ColorRow colorRow={scoreSheet.green} />
        <ColorRow colorRow={scoreSheet.blue} />
        <div className="grid grid-flow-col gap-x-1 mt-4">
          <ScoreIndicatorSection />
          <PenaltySection />
        </div>
        <ScoreSection />
      </div>
      <EndTurnButton />
    </div>
  );
};

export default ScoreSheet;

const EndTurnButton = () => {
  const userIsDone = useAppSelector((state) => state.game.done);
  const dispatch = useAppDispatch();
  const onToggleEndTurn = () => dispatch(toggleEndTurn());

  const endTurn = () => {
    // Validate there is at least one box selected
    // if not a penalty or one will be automatically selected
    // save all penalties
    // save all boxes selected
    // clean all penalties selected
    // clean all boxes selected
    // clean done button
    // clean dices
  };

  return (
    <button
      className={tm(
        clsx(
          "px-4 py-2 rounded grid items-center shadow-lg bg-gradient-to-l from-purple-700 to-purple-500 text-white",
          "hover:from-purple-900 hover:to-purple-600",
          {
            "from-gray-700 to-gray-500 hover:from-gray-700 hover:to-gray-500":
              userIsDone,
          }
        )
      )}
      onClick={onToggleEndTurn}
    >
      Done
    </button>
  );
};

const ScoreIndicatorSection = () => {
  return (
    <>
      <ScoreIndicatorLegend />
      <div className="grid grid-flow-col gap-x-1">
        {scoresIndicators.map((e) => (
          <ScoreIndicator
            key={e.numberOfX}
            numberOfX={e.numberOfX}
            score={e.score}
          />
        ))}
      </div>
    </>
  );
};

type RowType = {
  colorRow: BoxType[];
};

const ColorRow = ({ colorRow }: RowType) => {
  return (
    <div className={clsx("flex gap-x-1 p-0")}>
      {colorRow.map((e) =>
        e.number ? (
          <Box key={e.name} data={e} />
        ) : (
          <Lock key={e.name} color={e.color} />
        )
      )}
    </div>
  );
};

const PenaltySection = () => {
  const penalties = useAppSelector((state) => state.game.scoreSheetPenalties);

  return (
    <div className="grid justify-self-end mr-[52px]">
      <p className="text-sm text-right">Penalty (-5)</p>
      <div className={clsx("flex gap-x-1 p-0 justify-end")}>
        <PenaltyBox data={penalties.first} />
        <PenaltyBox data={penalties.second} />
        <PenaltyBox data={penalties.third} />
        <PenaltyBox data={penalties.fourth} />
      </div>
    </div>
  );
};

type Colors = "red" | "blue" | "green" | "yellow";

interface NumberInterface {
  data: BoxType;
}

const squareClass = (color: Colors, disabled?: boolean) =>
  tm(
    clsx(
      "w-11 h-11 border-2 rounded grid items-center justify-center font-bold cursor-pointer relative",
      {
        "hover:bg-red-100 bg-red-50 text-red-600 border-red-800":
          color === "red",
      },
      {
        "hover:bg-blue-100 bg-blue-50 text-blue-600 border-blue-800":
          color === "blue",
      },
      {
        "hover:bg-green-100 bg-green-50 text-green-600 border-green-800":
          color === "green",
      },
      {
        "hover:bg-yellow-100 bg-yellow-50 text-yellow-600 border-yellow-800":
          color === "yellow",
      },
      {
        "hover:bg-gray-300 bg-gray-300 text-gray-600 border-gray-800 cursor-auto":
          disabled,
      }
    )
  );

const Box = (props: NumberInterface) => {
  const { data } = props;

  const dispatch = useAppDispatch();
  const boxesSelected = useAppSelector((state) => state.game.boxesSelected);
  const scoreSheetPoints = useAppSelector(
    (state) => state.game.scoreSheetPoints
  );
  const dicesPossibleCombinations = useAppSelector(
    (state) => state.game.dicesPossibleCombinations
  );

  const isSelected = data.selected || data.temporalySelected;
  const isDisabled =
    data.disabled ||
    data.temporalyDisabled ||
    (data.number === (["red", "yellow"].includes(data.color) ? 12 : 2) &&
      scoreSheetPoints[data.color] < 5);
  const elementLocation = { color: data.color, name: data.name };

  const checkBox = () => {
    if (boxesSelected === 2 && !data.temporalySelected) return;
    if (isDisabled) return;

    // logic when box will be unchecked
    if (isSelected) {
      dispatch(toggleCheckBox(elementLocation));
      dispatch(decreaseBoxesSelected());
      return;
    }

    // validate combination of whites if first
    const isInAllPossibleCombinations = [
      ...dicesPossibleCombinations.white,
      ...dicesPossibleCombinations[data.color],
    ].includes(data.number);

    if (!isInAllPossibleCombinations) return;

    if (boxesSelected >= 1) {
      const isInSameColorPossibleCombinations = dicesPossibleCombinations[
        data.color
      ].includes(data.number);

      if (!isInSameColorPossibleCombinations) return;
    }

    dispatch(toggleCheckBox(elementLocation));
    dispatch(increaseBoxesSelected());
  };

  const onDoubleClick = () => {
    dispatch(disableBox(elementLocation));
  };

  return (
    <div
      className={clsx(squareClass(data.color, isDisabled))}
      onDoubleClick={onDoubleClick}
      onClick={checkBox}
    >
      {isSelected && (
        <MdClose className="absolute w-9 h-9 shadow-2xl self-center justify-self-center pointer-events-none" />
      )}
      {data.number}
    </div>
  );
};

const Lock = ({ color }: { color: ColorsType }) => {
  const [isLocked, setIsLocked] = useState(false);
  const handleOnClick = () => {
    setIsLocked(!isLocked);
  };

  const LockIcon = isLocked ? MdLockOutline : MdOutlineLockOpen;

  return (
    <div
      className={clsx(
        squareClass(color),
        "rounded-full ml-2",
        {
          "!bg-red-700 !text-white": isLocked && color === "red",
        },
        {
          "!bg-blue-700 !text-white": isLocked && color === "blue",
        },
        {
          "!bg-green-700 !text-white": isLocked && color === "green",
        },
        {
          "!bg-yellow-700 !text-white": isLocked && color === "yellow",
        }
      )}
      onClick={handleOnClick}
    >
      <LockIcon className={clsx("w-6 h-6 rotate-[30deg]")} />
    </div>
  );
};

type PenaltyBoxProps = {
  data: PenaltyType;
};

const PenaltyBox = (props: PenaltyBoxProps) => {
  const disabled = props.data.selected;
  const dispacth = useAppDispatch();

  const handleOnClick = () => {
    dispacth(togglePenalty({ name: props.data.name }));
  };
  return (
    <div
      className={clsx(
        "w-6 h-6 border rounded grid items-center justify-center font-bold border-gray-800 text-gray-800 cursor-pointer",
        { "bg-gray-300 cursor-auto": disabled }
      )}
      onClick={handleOnClick}
    >
      {props.data.selected && <MdClose className="w-4 h-4" />}
    </div>
  );
};

interface ScoreIndicatorInterface {
  numberOfX: number;
  score: number;
}

const ScoreIndicator = (props: ScoreIndicatorInterface) => {
  return (
    <div className="border rounded grid w-7 items-center text-sm px-0.5 border-gray-400">
      <p className="text-center">{props.numberOfX}x</p>
      <span className="border-t border-gray-400 block"></span>
      <p className="text-center">{props.score}</p>
    </div>
  );
};

const ScoreIndicatorLegend = () => {
  return (
    <div className="justify-self-start rounded grid items-center text-sm">
      <p className="">Xs</p>
      <span className="border-t border-gray-400 block"></span>
      <p className="">Score</p>
    </div>
  );
};

const ScoreSection = () => {
  const scoreSheetPoints = useAppSelector(
    (state) => state.game.scoreSheetPoints
  );

  const arrayOfColors: Array<{ color: ColorsType }> = [
    { color: "red" },
    { color: "yellow" },
    { color: "green" },
    { color: "blue" },
  ];

  return (
    <div
      className={clsx(
        "grid grid-flow-col justify-start gap-x-4 items-center mt-4"
      )}
    >
      <p>Points</p>
      <div className={clsx("grid grid-flow-col justify-start gap-x-4")}>
        {arrayOfColors.map((e, i, a) => (
          <div
            className={clsx("grid grid-flow-col justify-start gap-x-4")}
            key={e.color}
          >
            <div
              className={clsx(
                "w-12 h-9 border-2 rounded grid items-center justify-center font-bold relative",
                { "border-red-600": e.color === "red" },
                { "border-yellow-600": e.color === "yellow" },
                { "border-green-600": e.color === "green" },
                { "border-blue-600": e.color === "blue" }
              )}
            >
              {scoreSheetPoints[e.color]
                ? scoresIndicators.find(
                    (el) => el.numberOfX === scoreSheetPoints[e.color]
                  )?.score
                : 0}
            </div>
            {a.length !== i + 1 && (
              <span className={clsx("font-bold text-2xl")}>+</span>
            )}
          </div>
        ))}
        <span className={clsx("font-bold text-2xl")}>=</span>
        <div
          className={clsx(
            "w-20 h-9 border-2 rounded grid items-center justify-center font-bold relative border-gray-900"
          )}
        >
          1
        </div>
      </div>
    </div>
  );
};
