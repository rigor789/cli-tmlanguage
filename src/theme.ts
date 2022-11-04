import { IShikiTheme } from "shiki";
import * as colors from "tailwindcss/colors";

export const theme: IShikiTheme = {
  name: "CLI Theme",
  fg: colors.gray[100],
  bg: colors.gray[900],
  type: "dark",
  colors: {
    "editor.foreground": colors.gray[100],
    "editor.background": colors.gray[900],
  },
  settings: [
    {
      name: "CLI Command Punctuation",
      scope: ["punctuation.cli"],
      settings: {
        foreground: colors.gray[400],
      },
    },
    {
      name: "CLI Command Name",
      scope: ["keyword.command-name.cli"],
      settings: {
        foreground: colors.pink[400],
      },
    },
    {
      name: "CLI Command Arg",
      scope: ["keyword.command-arg.cli"],
      settings: {
        foreground: colors.amber[400],
      },
    },
    {
      name: "CLI Double-Dash Flag",
      scope: ["flag.double-dash.cli"],
      settings: {
        foreground: colors.cyan[400],
      },
    },
    {
      name: "CLI Single-Dash Flag",
      scope: ["flag.single-dash.cli"],
      settings: {
        foreground: colors.cyan[300],
        fontStyle: "underline",
      },
    },
    {
      name: "CLI Assignment",
      scope: ["keyword.operator.assignment.cli"],
      settings: {
        foreground: colors.violet[300],
      },
    },
    {
      name: "CLI String",
      scope: ["string.cli"],
      settings: {
        foreground: colors.lime[300],
      },
    },
    {
      name: "CLI Single-Line Comment",
      scope: ["comment.line.double-slash.cli"],
      settings: {
        foreground: colors.gray[500],
      },
    },
    {
      name: "CLI Placeholder",
      scope: ["placeholder.cli"],
      settings: {
        foreground: colors.emerald[400],
        fontStyle: "underline",
      },
    },
    {
      name: "CLI Interpolation",
      scope: ["interpolation.begin.cli", "interpolation.end.cli"],
      settings: {
        foreground: colors.lime[600],
      },
    },
    {
      name: "CLI Operators",
      scope: ["operators.cli"],
      settings: {
        foreground: colors.teal[500],
      },
    },
    {
      name: "CLI Output",
      scope: ["output.begin.cli", "output.end.cli"],
      settings: {
        foreground: "#000001",
      },
    },
  ],
};
