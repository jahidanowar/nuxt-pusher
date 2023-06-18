import {
  defineNuxtModule,
  addPlugin,
  createResolver,
  addTemplate,
  addImports,
  logger,
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

    if (!options.appId || options.appId === "") {
      logger.warn(
        "Pusher App ID not found. Please set the PUSHER_APP_ID environment variable."
      );
      return;
    }

    if (!options.key || options.key === "") {
      logger.warn(
        "Pusher Key not found. Please set the PUSHER_KEY environment variable."
      );
      return;
    }

    if (!options.secret || options.secret === "") {
      logger.warn(
        "Pusher Secret not found. Please set the PUSHER_SECRET environment variable."
      );
      return;
    }

    if (!options.cluster || options.cluster === "") {
      logger.warn(
        "Pusher Cluster not found. Please set the PUSHER_CLUSTER environment variable."
      );
      return;
    }

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

    // Nitro Auto import Serverside Helpers
    nuxt.hook("nitro:config", (nitroConfig) => {
      nitroConfig.alias = nitroConfig.alias || {};

      // Inline module runtime in Nitro bundle
      nitroConfig.externals = defu(
        typeof nitroConfig.externals === "object" ? nitroConfig.externals : {},
        {
          inline: [resolver.resolve("./runtime")],
        }
      );
      nitroConfig.alias["#nuxt/pusher"] = resolver.resolve(
        "./runtime/server/services"
      );
    });

    // Create vierual types
    addTemplate({
      filename: "./types/nuxt-pusher.d.ts",
      getContents: () =>
        `declare module "#nuxt/pusher" {
        const serverPusher: typeof import("${resolver.resolve(
          "./runtime/server/services"
        )}").serverPusher;
      }`,
    });

    nuxt.hook("prepare:types", (options) => {
      options.references.push({
        path: resolver.resolve(nuxt.options.buildDir, "types/nuxt-pusher.d.ts"),
      });
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
