import React from "react";
import PlayersSection from "../PlayersSection";
import ScoreSheet from "../ScoreSheet";
import DicesSection from "../DicesSection";
import clsx from "clsx";

const Board = () => {
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
