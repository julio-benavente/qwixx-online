import React, { useEffect } from "react";
import PlayersSection from "../PlayersSection";
import ScoreSheet from "../ScoreSheet";
import DicesSection from "../DicesSection";
import clsx from "clsx";
import { startMyTurn } from "@/store/entities/game";
import { useAppSelector, useAppDispatch } from "@/store-hooks";

const Board = () => {
  const state = useAppSelector((state) => state);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(startMyTurn());
  }, []);

  return (
    <div
      className={clsx(
        "grid grid-cols-[auto_1fr] grid-rows-[1fr_auto]",
        "min-h-screen p-8"
      )}
    >
      <PlayersSection className={clsx("row-span-2")} />
      <DicesSection className={clsx("justify-center")} />
      <ScoreSheet />
    </div>
  );
};

export default Board;
