import type { Plugin } from "rollup";

import { FixDtsDefaultCjsExportsPlugin } from "fix-dts-default-cjs-exports/rollup";
import MagicString from "magic-string";
import { findStaticImports } from "mlly";

import type { BuildContext } from "~/libs/sdk/sdk-impl/build/bundlers/unified/types.js";

export function cjsPlugin(_opts?: any): Plugin {
  return {
    name: "relidler-cjs",
    renderChunk(code, _chunk, opts) {
      if (opts.format === "es") {
        return CJSToESM(code);
      }
      return null;
    },
  } as Plugin;
}

export function fixCJSExportTypePlugin(ctx: BuildContext): Plugin {
  const regexp =
    ctx.options.declaration === "node16"
      ? /\.d\.cts$/ // d.cts only
      : /\.d\.c?ts$/; // d.ts and d.cts
  return FixDtsDefaultCjsExportsPlugin({
    matcher: (info) => {
      return (
        info.type === "chunk" &&
        info.exports?.length > 0 &&
        info.exports.includes("default") &&
        regexp.test(info.fileName) &&
        info.isEntry
      );
    },
    warn: (msg) => ctx.warnings.add(msg),
  });
}

const CJSyntaxRe = /__filename|__dirname|require\(|require\.resolve\(/;

const CJSShim = `

// -- relidler CommonJS Shims --
import __cjs_url__ from 'url';
import __cjs_path__ from 'path';
import __cjs_mod__ from 'module';
const __filename = __cjs_url__.fileURLToPath(import.meta.url);
const __dirname = __cjs_path__.dirname(__filename);
const require = __cjs_mod__.createRequire(import.meta.url);
`;

// Shim __dirname, __filename and require
function CJSToESM(code: string): null | { code: string; map: any } {
  if (code.includes(CJSShim) || !CJSyntaxRe.test(code)) {
    return null;
  }

  const lastESMImport = findStaticImports(code).pop();
  const indexToAppend = lastESMImport ? lastESMImport.end : 0;
  const s = new MagicString(code);
  s.appendRight(indexToAppend, CJSShim);

  return {
    code: s.toString(),
    map: s.generateMap(),
  };
}
