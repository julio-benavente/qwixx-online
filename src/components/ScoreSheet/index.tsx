import clsx from "clsx";
import React, { useState } from "react";
import { MdLockOutline, MdOutlineLockOpen, MdClose } from "react-icons/md";
import { twMerge as tm } from "tailwind-merge";

interface RowInterface {
  color: Colors;
  startsAt: 1 | 12;
}

const rows: RowInterface[] = [
  { color: "red", startsAt: 1 },
  { color: "yellow", startsAt: 1 },
  { color: "green", startsAt: 12 },
  { color: "blue", startsAt: 12 },
];

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
  return (
    <>
      <div className="grid grid-flow-row gap-y-1 justify-center">
        {rows.map((e) => (
          <div
            className={clsx(
              "flex gap-x-1 p-0"
              //   { "bg-red-600": e.color === "red" },
              //   { "bg-blue-600": e.color === "blue" },
              //   { "bg-green-600": e.color === "green" },
              //   { "bg-yellow-600": e.color === "yellow" }
            )}
          >
            {Array(12)
              .fill(null)
              .map((_, i) => (
                <Number
                  key={i}
                  number={e.startsAt === 1 ? i + 1 : 12 - i}
                  color={e.color}
                />
              ))}
            <Lock color={e.color} />
          </div>
        ))}
        <div className="grid grid-flow-col gap-x-1 mt-4">
          <ScoreIndicatorLegend />
          <div className="grid grid-flow-col gap-x-1">
            {scoresIndicators.map((e) => (
              <ScoreIndicator numberOfX={e.numberOfX} score={e.score} />
            ))}
          </div>
          <div className="grid justify-self-end mr-[52px]">
            <p className="text-sm text-right">Penalty (-5)</p>
            <div className={clsx("flex gap-x-1 p-0 justify-end")}>
              {Array(4)
                .fill(null)
                .map((_, i) => (
                  <Penalty key={i} />
                ))}
            </div>
          </div>
        </div>
        <ScoreSection />
      </div>
    </>
  );
};

export default ScoreSheet;

type Colors = "red" | "blue" | "green" | "yellow";

interface NumberInterface {
  number: number;
  color: Colors;
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

const Number = (props: NumberInterface) => {
  const [isSelected, setIsSelected] = useState(false);
  const disabled = props.number === 1;
  const handleOnClick = () => {
    if (disabled) return;

    setIsSelected(!isSelected);
  };

  return (
    <div
      className={clsx(squareClass(props.color, disabled))}
      onClick={handleOnClick}
    >
      {isSelected && (
        <MdClose className="absolute w-9 h-9 shadow-2xl self-center justify-self-center" />
      )}
      {props.number}
    </div>
  );
};

const Lock = ({ color }: { color: Colors }) => {
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

const Penalty = () => {
  const [isSelected, setIsSelected] = useState(true);
  const disabled = true;
  const handleOnClick = () => {
    if (disabled) return;
    setIsSelected(!isSelected);
  };
  return (
    <div
      className={clsx(
        "w-6 h-6 border rounded grid items-center justify-center font-bold border-gray-800 text-gray-800",
        { "bg-gray-300": disabled }
      )}
      onClick={handleOnClick}
    >
      {isSelected && <MdClose className="w-4 h-4" />}
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
  return (
    <div
      className={clsx(
        "grid grid-flow-col justify-start gap-x-4 items-center mt-4"
      )}
    >
      <p>Points</p>
      <div className={clsx("grid grid-flow-col justify-start gap-x-4")}>
        {[
          { color: "red" },
          { color: "yellow" },
          { color: "green" },
          { color: "blue" },
        ].map((e, i, a) => (
          <>
            <div
              className={clsx(
                "w-12 h-9 border-2 rounded grid items-center justify-center font-bold relative",
                { "border-red-600": e.color === "red" },
                { "border-yellow-600": e.color === "yellow" },
                { "border-green-600": e.color === "green" },
                { "border-blue-600": e.color === "blue" }
              )}
            >
              1
            </div>
            {a.length !== i + 1 && (
              <span className={clsx("font-bold text-2xl")}>+</span>
            )}
          </>
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
