import fs from "fs-extra";
import path from "pathe";
import { defineTSConfig } from "pkg-types";

import { tsconfigJson } from "./utils-consts.js";
import { relinka } from "./utils-logs.js";

// ==============================
// tsconfig.json generation utils
// ==============================

/**
 * Creates a tsconfig.json file for the distribution.
 */
export async function createTSConfig(
  outDirRoot: string,
  allowImportingTsExtensions: boolean,
): Promise<void> {
  relinka(
    "commonVerbose",
    `Creating tsconfig.json in ${outDirRoot} (allowImportingTsExtensions=${allowImportingTsExtensions})`,
  );
  const tsConfig = defineTSConfig({
    compilerOptions: {
      allowImportingTsExtensions,
      allowJs: true,
      esModuleInterop: true,
      exactOptionalPropertyTypes: false,
      isolatedModules: true,
      lib: ["ESNext"],
      module: "NodeNext",
      moduleDetection: "force",
      moduleResolution: "nodenext",
      noEmit: true,
      noFallthroughCasesInSwitch: false,
      noImplicitAny: false,
      noImplicitOverride: true,
      noImplicitReturns: false,
      noUncheckedIndexedAccess: true,
      noUnusedLocals: false,
      noUnusedParameters: false,
      resolveJsonModule: true,
      skipLibCheck: true,
      strict: true,
      strictNullChecks: false,
      transpileTarget: "ESNext",
      verbatimModuleSyntax: true,
    },
    exclude: ["**/node_modules"],
    include: ["./bin/**/*.ts"],
  });
  await fs.writeJSON(path.join(outDirRoot, tsconfigJson), tsConfig, {
    spaces: 2,
  });
  relinka("commonVerbose", `Created tsconfig.json in ${outDirRoot}`);
}
