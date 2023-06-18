import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
  failOnWarn: false,
  clean: true,
  declaration: true,
  externals: ["pusher", "pusher-js"],
  outDir: "dist",
});
