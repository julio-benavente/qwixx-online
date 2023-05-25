import clsx from "clsx";
import React, { ReactElement, useEffect, useState } from "react";
import { MdCircle } from "react-icons/md";
import _ from "lodash";

type DiceArrayType = { [key: number]: React.JSX.Element };

const DicesSection: React.FC<
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
> = ({ className, ...props }) => {
  const [dicesRolled, setDicesRolled] = useState<boolean>(false);

  return (
    <div
      className={clsx("grid grid-flow-col gap-x-8 items-center", className)}
      {...props}
    >
      <div className="grid grid-cols-3 grid-rows-2 gap-4">
        <Dice color="yellow" dicesRolled={dicesRolled} />
        <Dice color="green" dicesRolled={dicesRolled} />
        <Dice color="blue" dicesRolled={dicesRolled} />
        <Dice color="white" dicesRolled={dicesRolled} />
        <Dice color="red" dicesRolled={dicesRolled} />
        <Dice color="white" dicesRolled={dicesRolled} />
      </div>
      <RollDicesButton
        dicesRolled={dicesRolled}
        setDicesRolled={setDicesRolled}
      />
    </div>
  );
};

interface RollDicesButtonProps {
  dicesRolled: boolean;
  setDicesRolled: React.Dispatch<React.SetStateAction<boolean>>;
}
const RollDicesButton = (props: RollDicesButtonProps) => {
  const roollDices = () => {
    if (props.dicesRolled) return;

    props.setDicesRolled(true);
  };

  return (
    <button
      className="w-20 h-20 relative rounded-full bg-gradient-to-br from-orange-300 to-orange-500 group"
      onClick={roollDices}
    >
      <div
        className={clsx(
          "absolute w-16 h-16 rounded-full bg-red-700/75 top-2/4 left-2/4 -translate-x-1/2 -translate-y-[48%] grid items-center shadow-lg transition",
          "group-hover:bg-red-900/75 group-hover:-translate-y-[48%]"
        )}
      ></div>
      <div
        className={clsx(
          "absolute w-16 h-16 rounded-full  top-2/4 left-2/4 -translate-x-1/2 -translate-y-[52%] grid items-center shadow-lg",
          "bg-red-600",
          "group-active:bg-red-700/90"
        )}
      >
        <span
          className={clsx(
            "absolute w-16 h-16 rounded-full  top-2/4 left-2/4 -translate-x-1/2 -translate-y-1/2 grid items-center shadow-lg transition",
            "bg-gradient-to-br from-white/10 to-white-/0"
          )}
        ></span>
        <span className="text-white">Roll</span>
      </div>
    </button>
  );
};

interface DiceProps {
  color: Colors;
  dicesRolled: boolean;
}

const Dice = (props: DiceProps) => {
  const random = _.times(39, () => _.random(1, 6, false));
  const [diceSelected, setDiceSelected] = useState<number>(_.random(1, 6));

  const dices: DiceArrayType = {
    1: (
      <DiceWrapper color={props.color}>
        <NumberOneDots />
      </DiceWrapper>
    ),
    2: (
      <DiceWrapper color={props.color}>
        <NumberTwoDots />
      </DiceWrapper>
    ),
    3: (
      <DiceWrapper color={props.color}>
        <NumberThreeDots />
      </DiceWrapper>
    ),
    4: (
      <DiceWrapper color={props.color}>
        <NumberFourDots />
      </DiceWrapper>
    ),
    5: (
      <DiceWrapper color={props.color}>
        <NumberFiveDots />
      </DiceWrapper>
    ),
    6: (
      <DiceWrapper color={props.color}>
        <NumberSixDots />
      </DiceWrapper>
    ),
  };

  const loop = async () => {
    for (let number of random) {
      await new Promise((resolve, reject) =>
        setTimeout(() => resolve(setDiceSelected(number)), 200)
      );
    }
  };

  useEffect(() => {
    if (props.dicesRolled) {
      loop();
    }
  }, [props.dicesRolled]);

  return <>{dices[diceSelected]}</>;
};

export default DicesSection;
type Colors = "red" | "blue" | "green" | "yellow" | "white";

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

const Circle = () => {
  return <MdCircle className="w-3 h-3" />;
};

const NumberOneDots = () => {
  return (
    <>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span>
        <Circle />
      </span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </>
  );
};

const NumberTwoDots = () => {
  return (
    <>
      <span>
        <Circle />
      </span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span>
        <Circle />
      </span>
    </>
  );
};

const NumberThreeDots = () => {
  return (
    <>
      <span>
        <Circle />
      </span>
      <span></span>
      <span></span>
      <span></span>
      <span>
        <Circle />
      </span>
      <span></span>
      <span></span>
      <span></span>
      <span>
        <Circle />
      </span>
    </>
  );
};

const NumberFourDots = () => {
  return (
    <>
      <span>
        <Circle />
      </span>
      <span></span>
      <span>
        <Circle />
      </span>
      <span></span>
      <span></span>
      <span></span>
      <span>
        <Circle />
      </span>
      <span></span>
      <span>
        <Circle />
      </span>
    </>
  );
};

const NumberFiveDots = () => {
  return (
    <>
      <span>
        <Circle />
      </span>
      <span></span>
      <span>
        <Circle />
      </span>
      <span></span>
      <span>
        <Circle />
      </span>
      <span></span>
      <span>
        <Circle />
      </span>
      <span></span>
      <span>
        <Circle />
      </span>
    </>
  );
};

const NumberSixDots = () => {
  return (
    <>
      <span>
        <Circle />
      </span>
      <span></span>
      <span>
        <Circle />
      </span>
      <span>
        <Circle />
      </span>
      <span></span>
      <span>
        <Circle />
      </span>
      <span>
        <Circle />
      </span>
      <span></span>
      <span>
        <Circle />
      </span>
    </>
  );
};
