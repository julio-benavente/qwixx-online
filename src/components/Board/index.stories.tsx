import { StoryFn } from "@storybook/react";
import Board from ".";

export default {
  title: "",
  component: Board,
  parameters: {
    layout: "fullscreen",
  },
};

export const Main: StoryFn = (args) => <Board {...args} />;
