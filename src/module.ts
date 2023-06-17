import {
  defineNuxtModule,
  addPlugin,
  createResolver,
  addTemplate,
  addImports,
} from "@nuxt/kit";
import { defu } from "defu";

export interface PusherOptions {
  appId: string;
  key: string;
  secret: string;
  cluster: string;
  useTLS: boolean;
}
export interface ModuleOptions extends PusherOptions {}

const MODULE_NAME = "nuxt-pusher";
const MODULE_KEY = "pusher";

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: MODULE_NAME,
    configKey: MODULE_KEY,
    compatibility: {
      // Semver version of supported nuxt versions
      nuxt: "^3.0.0",
    },
  },
  // Default configuration options of the Nuxt module
  defaults: {
    appId: process.env.PUSHER_APP_ID as string,
    key: process.env.PUSHER_KEY as string,
    secret: process.env.PUSHER_SECRET as string,
    cluster: process.env.PUSHER_CLUSTER as string,
    useTLS: true,
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url);

    // Expose runtime public config
    nuxt.options.runtimeConfig.public = defu(
      nuxt.options.runtimeConfig.public,
      {
        pusherKey: options.key,
        pusherCluster: options.cluster,
      }
    );
    // Expose runtime private config
    nuxt.options.runtimeConfig.pusher = defu(
      nuxt.options.runtimeConfig.pusher,
      {
        pusherSecret: options.secret,
        pusherAppId: options.appId,
        pusherUseTLS: options.useTLS,
      }
    );

    // Serverside Helpers
    nuxt.hook("nitro:config", (nitroConfig) => {
      nitroConfig.alias = nitroConfig.alias || {};

      // Inline module runtime in Nitro bundle
      nitroConfig.externals = defu(
        typeof nitroConfig.externals === "object" ? nitroConfig.externals : {},
        {
          inline: [resolver.resolve("./runtime")],
        }
      );
      nitroConfig.alias["#nuxt-pusher"] = resolver.resolve(
        "./runtime/server/services"
      );
    });

    addTemplate({
      filename: "./types/nuxt-pusher.d.ts",
      getContents: () =>
        `declare module "#nuxt-pusher" {
        const serverPusher: typeof import(${resolver.resolve(
          "./runtime/server/services"
        )}).serverPusher;
      }`,
    });
    // Client Composable
    addImports({
      name: "usePusher",
      as: "usePusher",
      from: resolver.resolve("./runtime/composables/usePusher"),
    });
    // Client Plugin
    addPlugin({
      mode: "client",
      src: resolver.resolve("./runtime/plugin"),
    });
  },
});
