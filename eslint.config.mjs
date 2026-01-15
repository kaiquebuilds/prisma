import nx from "@nx/eslint-plugin";
import eslintConfigPrettier from "eslint-config-prettier/flat";

export default [
  ...nx.configs["flat/base"],
  ...nx.configs["flat/typescript"],
  ...nx.configs["flat/javascript"],
  eslintConfigPrettier,
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"],
    rules: {
      "@nx/enforce-module-boundaries": [
        "error",
        {
          allow: [],
          depConstraints: [
            {
              sourceTag: "scope:shared",
              onlyDependOnLibsWithTags: ["scope:shared"],
            },
            {
              sourceTag: "scope:api",
              onlyDependOnLibsWithTags: ["scope:shared", "scope:api"],
            },
            {
              sourceTag: "scope:web",
              onlyDependOnLibsWithTags: ["scope:shared", "scope:web"],
            },
          ],
        },
      ],
    },
  },
];
