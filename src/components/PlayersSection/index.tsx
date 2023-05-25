import clsx from "clsx";
import React, { ReactElement, useState } from "react";

const PlayersSection: React.FC<
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
> = ({ className, ...props }) => {
  return (
    <div
      className={clsx(
        "grid grid-flow-row gap-y-2 content-start",
        "p-4 bg-blue-50 rounded-md h-[312px]",
        className
      )}
      {...props}
    >
      <Avatar />
      <Avatar />
      {/* <Avatar /> */}
      {/* <Avatar /> */}
    </div>
  );
};

export default PlayersSection;

const Avatar = () => {
  const [isActive, setIsActive] = useState<boolean>(false);
  return (
    <div
      className={clsx(
        "relative w-16 h-16 rounded-full bg-gradient-to-br",
        { "from-orange-300 to-orange-500": isActive },
        { "from-blue-300 to-blue-500": !isActive }
      )}
    >
      <img
        className={clsx(
          "w-14 h-14 rounded-full object-cover z-10 border-2 border-white",
          "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 absolute"
        )}
        src="https://e7.pngegg.com/pngimages/898/761/png-clipart-squidward-tentacles-illustration-squidward-tentacles-patrick-star-drawing-funny-miscellaneous-face.png"
        alt="avatar player"
      />
    </div>
  );
};
