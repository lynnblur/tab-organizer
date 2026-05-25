export const GROUP_COLORS = [
  "grey",
  "blue",
  "red",
  "yellow",
  "green",
  "pink",
  "purple",
  "cyan",
  "orange",
] as const;

export type GroupColor = (typeof GROUP_COLORS)[number];
export const GROUP_COLOR_COUNT = GROUP_COLORS.length;
