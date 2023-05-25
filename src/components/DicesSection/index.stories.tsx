import DicesSection from ".";
import { Meta, StoryFn } from "@storybook/react";

const meta: Meta<typeof DicesSection> = {
  title: "Components/Dices section",
  component: DicesSection,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};
export default meta;

export const Main: StoryFn = (args) => <DicesSection {...args} />;
