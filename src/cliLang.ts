import * as tm from "tmlanguage-generator";
import path from "path";
// import plist from "plist";

export const grammarPath = path.resolve(__dirname, "../cli.tmlanguage.json");

type Rule = tm.Rule<CLIScope>;
type IncludeRule = tm.IncludeRule<CLIScope>;
type BeginEndRule = tm.BeginEndRule<CLIScope>;
type MatchRule = tm.MatchRule<CLIScope>;
type Grammar = tm.Grammar<CLIScope>;

export type CLIScope =
  | "comment.line.double-slash.cli"
  | "keyword.operator.assignment.cli"
  | "flag.single-dash.cli"
  | "punctuation.cli"
  | "interpolation.begin.cli"
  | "interpolation.end.cli"
  | "keyword.command-name.cli"
  | "flag.double-dash.cli"
  | "string.cli"
  | "placeholder.cli"
  | "placeholder.content.cli"
  | "operators.cli"
  | "output.begin.cli"
  | "output.end.cli"
  | "keyword.command-arg.cli";

const bound = (text: string) => `\\b${text}\\b`;
const after = (regex: string) => `(?<=${regex})`;
const notAfter = (regex: string) => `(?<!${regex})`;
const before = (regex: string) => `(?=${regex})`;
const notBefore = (regex: string) => `(?!${regex})`;

const punctuation = "punctuation.cli";

const commandName: IncludeRule = {
  key: "commandName",
  patterns: [
    {
      key: "commandNameStart",
      scope: "keyword.command-name.cli",
      match: `^([^$\\s])+`,
    },
    {
      key: "commandNameInterpolation",
      scope: "keyword.command-name.cli",
      match: bound(`${after("\\$\\(")}\\S+`),
    },
    {
      key: "commandNameAfterShellPrefix",
      scope: "keyword.command-name.cli",
      match: `^(\\$)\\s(\\S)+`,
      captures: {
        1: { scope: punctuation },
      },
    },
    {
      key: "commandNameAfterOperator",
      scope: tm.meta,
      match: `${after(`([\\&|])\\s`)}(\\S+)`,
      captures: {
        2: { scope: "keyword.command-name.cli" },
      },
    },
  ],
};

const commandArgs: MatchRule = {
  key: "commandArgs",
  scope: "keyword.command-arg.cli",
  match: `[\\./~@]*(\\b[\\w\\/:\\\\-]+\\b/?`,
};

const singleQuoteString: BeginEndRule = {
  key: "singleQuoteString",
  scope: "string.cli",
  begin: "'",
  end: "'",
  beginCaptures: {
    0: { scope: punctuation },
  },
  endCaptures: {
    0: { scope: punctuation },
  },
};

const doubleQuoteString: BeginEndRule = {
  key: "doubleQuoteString",
  scope: "string.cli",
  begin: `"`,
  end: `"`,
  beginCaptures: {
    0: { scope: punctuation },
  },
  endCaptures: {
    0: { scope: punctuation },
  },
};

const strings: IncludeRule = {
  key: "strings",
  patterns: [singleQuoteString, doubleQuoteString],
};

const flagDot: MatchRule = {
  key: "flagDot",
  scope: punctuation,
  match: `\\.`,
};

const flagName = `[\\w\\-\\_\\.]+`;

const flags: IncludeRule = {
  key: "flags",
  patterns: [
    {
      key: "doubleDashFlag",
      scope: "flag.double-dash.cli",
      match: `\\s(--)(${flagName})(=([^\\s\\(\\)]+))?`,
      captures: {
        1: { scope: punctuation },
        2: {
          patterns: [flagDot],
        },
        3: { scope: "keyword.operator.assignment.cli" },
        4: {
          scope: "string.cli",
          patterns: [strings],
        },
      },
    },
    {
      key: "singleDashFlag",
      scope: "flag.single-dash.cli",
      match: `\\s(-)(${flagName})`,
      captures: {
        1: { scope: punctuation },
        2: {
          patterns: [flagDot],
        },
      },
    },
  ],
};

const placeholder: BeginEndRule = {
  key: "placeholder",
  scope: "placeholder.cli",
  begin: `<`,
  end: `>`,
  beginCaptures: {
    0: { scope: punctuation },
  },
  endCaptures: {
    0: { scope: punctuation },
  },
};

const lineComment: MatchRule = {
  key: "line-comment",
  scope: "comment.line.double-slash.cli",
  match: `(#|//).*${before(`$`)}`,
};

const comments: IncludeRule = {
  key: "comments",
  patterns: [lineComment],
};

const interpolations: BeginEndRule = {
  key: "interpolation",
  scope: tm.meta,
  begin: "\\$\\(",
  end: "\\)\\s",
  beginCaptures: {
    0: { scope: "interpolation.begin.cli" },
  },
  endCaptures: {
    0: { scope: "interpolation.end.cli" },
  },
  patterns: [
    // @ts-ignore
    { key: "$self" },
  ],
};

const output: BeginEndRule = {
  key: "output",
  scope: "string.cli",
  begin: "^(\\$<<<)",
  end: "^(>>>\\$)",
  beginCaptures: {
    0: { scope: "output.begin.cli" },
  },
  endCaptures: {
    0: { scope: "output.end.cli" },
  },
  patterns: [
    // @ts-ignore
    { key: "source.json" },
  ],
};

const commands: IncludeRule = {
  key: "commands",
  patterns: [commandName, commandArgs, flags],
};

const operators: MatchRule = {
  key: "operators",
  scope: "operators.cli",
  match: `\\s[>|\\\\&]+\\s`,
};

const grammar: Grammar = {
  $schema: tm.schema,
  name: "CLI",
  scopeName: "source.cli",
  fileTypes: [".cli"],
  patterns: [
    output,
    comments,
    commands,
    strings,
    placeholder,
    interpolations,
    operators,
  ],
};

export async function generateGrammar(): Promise<string> {
  const json = await tm.emitJSON(grammar);

  return json; //plist.build(JSON.parse(json));
}
