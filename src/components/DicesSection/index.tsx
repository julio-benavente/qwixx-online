import clsx from "clsx";
import React, { ReactElement, useEffect, useState } from "react";
import { MdCircle } from "react-icons/md";
import _ from "lodash";
import { useAppDispatch, useAppSelector } from "@/store-hooks";
import { rollDices } from "@/ent-game";
import {
  NumberOneDots,
  NumberTwoDots,
  NumberThreeDots,
  NumberFourDots,
  NumberFiveDots,
  NumberSixDots,
} from "@/components/DicesSection/DicesDots";
import RollDicesButton from "./RollDicesButton";

type DiceArrayType = { [key: number]: React.JSX.Element };

const DicesSection: React.FC<
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
> = ({ className, ...props }) => {
  return (
    <div
      className={clsx("grid grid-flow-col gap-x-8 items-center", className)}
      {...props}
    >
      <div className="grid grid-cols-3 grid-rows-2 gap-4">
        <Dice type="yellow" />
        <Dice type="green" />
        <Dice type="blue" />
        <Dice type="whiteOne" />
        <Dice type="red" />
        <Dice type="whiteTwo" />
      </div>
      <RollDicesButton />
    </div>
  );
};

interface DiceProps {
  type: DicesType;
}

const Dice = (props: DiceProps) => {
  // const random = _.times(_.random(24, 28), () => _.random(1, 6, false));
  const random = _.times(_.random(2, 4), () => _.random(1, 6, false));
  const [diceSelected, setDiceSelected] = useState<number>(1);
  const dispatch = useAppDispatch();
  const dicesRolled = useAppSelector((state) => state.game.dicesRolled);
  const dicesSelected = useAppSelector((state) => state.game.dices);
  const color =
    props.type === "whiteOne" || props.type === "whiteTwo"
      ? "white"
      : props.type;

  const dices: DiceArrayType = {
    1: (
      <DiceWrapper color={color}>
        <NumberOneDots />
      </DiceWrapper>
    ),
    2: (
      <DiceWrapper color={color}>
        <NumberTwoDots />
      </DiceWrapper>
    ),
    3: (
      <DiceWrapper color={color}>
        <NumberThreeDots />
      </DiceWrapper>
    ),
    4: (
      <DiceWrapper color={color}>
        <NumberFourDots />
      </DiceWrapper>
    ),
    5: (
      <DiceWrapper color={color}>
        <NumberFiveDots />
      </DiceWrapper>
    ),
    6: (
      <DiceWrapper color={color}>
        <NumberSixDots />
      </DiceWrapper>
    ),
  };

  const rollDices = async () => {
    for (let number of random) {
      await new Promise((resolve, reject) =>
        setTimeout(() => resolve(setDiceSelected(number)), _.random(140, 200))
      );
    }

    setDiceSelected(dicesSelected[props.type]);
  };

  useEffect(() => {
    if (dicesSelected[props.type] === 0) {
      setDiceSelected(1);
    }
  }, [dicesSelected[props.type]]);

  useEffect(() => {
    if (dicesRolled) {
      rollDices();
    }
  }, [dicesRolled]);

  return <>{dices[diceSelected]}</>;
};

export default DicesSection;
type Colors = "red" | "blue" | "green" | "yellow" | "white";
type DicesType = "red" | "blue" | "green" | "yellow" | "whiteOne" | "whiteTwo";

interface DiceInterface {
  children: ReactElement | ReactElement[];
  color?: Colors;
}

const DiceWrapper = ({ children, color }: DiceInterface) => {
  return (
    <div
      className={clsx(
        "grid w-14 h-14 rounded-md border-2 p-1 grid-cols-3 grid-rows-3 items-center justify-items-center bg-gradient-to-t",
        { "from-red-600 to-red-500 border-red-800": color === "red" },
        {
          "from-yellow-600 to-yellow-500 border-yellow-800": color === "yellow",
        },
        { "from-green-600 to-green-500 border-green-800": color === "green" },
        { "from-blue-600 to-blue-500 border-blue-800": color === "blue" },
        { "from-gray-100 to-white border-gray-800": color === "white" }
      )}
    >
      {children}
    </div>
  );
};
