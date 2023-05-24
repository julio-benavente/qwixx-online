import ScoreSheet from ".";
import { Parameters, StoryFn } from "@storybook/react";

export default {
  title: "Components/Score sheet",
  component: ScoreSheet,
  args: {},
};

export const Main: StoryFn = (args) => <ScoreSheet {...args} />;
