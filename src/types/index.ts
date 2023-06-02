export type ColorsType = "red" | "yellow" | "green" | "blue";

export type BoxType = {
  name: string;
  number: number;
  color: ColorsType;
  selected: boolean;
  temporalySelected: boolean;
  disabled: boolean;
  temporalyDisabled: boolean;
};

export type PenaltyValuesType = "first" | "second" | "third" | "fourth";

export type PenaltyType = { name: PenaltyValuesType; selected: boolean };
