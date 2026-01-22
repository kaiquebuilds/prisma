import baseConfig from "../../eslint.config.mjs";
import { globalIgnores } from "eslint/config";

export default [
  ...baseConfig,
  globalIgnores(["dist/", "out-tsc/"]),
  {
    rules: {
      "no-console": "error",
    },
  },
];
