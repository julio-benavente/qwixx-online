import { StoryFn } from "@storybook/react";
import PlayersSection from ".";

export default {
  title: "",
  component: PlayersSection,
  parameters: {
    layout: "centered",
  },
};

export const Main: StoryFn = (args) => <PlayersSection {...args} />;
