import { defineBuildConfig } from "unbuild";

import pkg from "./package.json";

const externals = [...Object.keys(pkg.dependencies || {})];

export default defineBuildConfig({
  failOnWarn: false,
  clean: true,
  declaration: true,
  externals,
  outDir: "dist",
});
