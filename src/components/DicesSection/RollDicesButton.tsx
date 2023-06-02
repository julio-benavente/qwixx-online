import { rollDices } from "@/store/entities/game";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import clsx from "clsx";

interface RollDicesButtonProps {}
const RollDicesButton = (props: RollDicesButtonProps) => {
  const dicesRolled = useAppSelector((state) => state.game.dicesRolled);
  const dispatch = useAppDispatch();

  const onRollDices = () => {
    if (dicesRolled) return;

    dispatch(rollDices());
  };

  return (
    <button
      className="w-20 h-20 relative rounded-full bg-gradient-to-br from-orange-300 to-orange-500 group"
      onClick={onRollDices}
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

export default RollDicesButton;
