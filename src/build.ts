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
    "ns -v -v.test",
    "ns migrate && ns clean",
    `ns run ios --for-device --flag --flagTest="value" --flag=value --env.foo="bar"`,
    `test --flag='cool' -v`,
    "# comment",
    "$ some command --cool // with a $ prefix",
    "ns do stuff # cool",
    "ns do stuff // cool",
    "",
    "// interpolation!",
    "ln -s $(which python -v --flag --flag.name --flag-with='value') /usr/local/bin",
    "",
    "cp C:\\foo\\bar\\baz /to/target",
    "",
    "// multi-line",
    `ns build android --release \\`,
    `       --key-store-path <path-to-your-keystore> \\`,
    `       --key-store-alias-password <your-alias-password>`,
    "",
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
    "ls -al | grep test",
    `echo "cat" > pool.txt`,
    // `ns build android --release --key-store-path C:\\keystore\\NativeScriptApp.keystore --key-store-password sample_password --key-store-alias NativeScriptApp --key-store-alias-password sample_password`
  ].join("\n");
  const html = highlighter.codeToHtml(example.trim(), { lang: "cli" });

  await writeFile(demoPath, html);
}

main().catch((err) => {
  console.log(err.stack ?? err);
  process.exit(1);
});
