import { writeFile } from "fs/promises";
import path from "path";

import { getHighlighter } from "shiki";
import { generateGrammar, grammarPath } from "./cliLang";
import { theme } from "./theme";

const demoPath = path.resolve(__dirname, "../demo.html");
const themePath = path.resolve(__dirname, "../cli.theme.json");

async function main() {
  const grammar = await generateGrammar();
  await writeFile(grammarPath, grammar);
  await writeFile(themePath, JSON.stringify(theme, null, 2));

  const highlighter = await getHighlighter({
    theme: theme,
    langs: [
      {
        id: "cli",
        scopeName: "source.cli",
        path: path.resolve(__dirname, "../cli.tmLanguage.json"),
      },
    ],
  });

  const example = [
    "npm install -g nativescript",
    "yarn add -D @rigor789/cli-tmlanguage",
    "ps -ax | grep 'FOO'",
    "echo 'Hello' >> world.txt",
    "node -v && javac -version",
    "npm i --save-dev tsx",
    `ns run ios --for-device --no-hmr --env.env=stage`,
    "# comments",
    "// comments",
    "git pull # with an inline comment",
    "git push // With an inline comment",
    "$ ls -al // command with a $ prefix",
    "// interpolation:",
    "echo $(node -v && javac -version && cat test.txt) ~/Downloads/something.md",
    "cp C:\\foo\\bar\\baz.txt ~/path/to/target/",
    "// multi-line & placeholders",
    `ns build android --release \\`,
    `       --key-store-path <path-to-your-keystore> \\`,
    `       --key-store-password <your-keystore-password>`,
    "rm -rf / # hehe",
    "// example output rendering",
    `cat ../package.json`,
    "$<<<",
    JSON.stringify(
      {
        name: "hello-world",
        version: "1.0.0",
        main: "index.js",
        dependencies: {
          "@nativescript/core": "12.0.3",
        },
      },
      null,
      2
    ),
    ">>>$",
  ].join("\n");
  const html = highlighter.codeToHtml(example.trim(), { lang: "cli" });

  await writeFile(demoPath, html);
}

main().catch((err) => {
  console.log(err.stack ?? err);
  process.exit(1);
});
