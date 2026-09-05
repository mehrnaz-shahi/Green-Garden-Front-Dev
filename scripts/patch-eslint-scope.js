const fs = require("fs");
const path = require("path");

const methods = `
    __isNodejsScope() {
        return Boolean(this.__options && (this.__options.nodejsScope || this.__options.sourceType === "commonjs"));
    }

    addGlobals(names = []) {
        const globalScope = this.globalScope;
        if (!globalScope || !Array.isArray(names)) {
            return;
        }
        names.forEach((name) => {
            const variable = globalScope.set && globalScope.set.get(name);
            if (variable) {
                variable.eslintUsed = true;
            }
        });
    }
`;

const tsMethods = `
    __isNodejsScope() {
        return false;
    }
    addGlobals(names = []) {
        const globalScope = this.globalScope;
        if (!globalScope || !Array.isArray(names)) {
            return;
        }
        names.forEach((name) => {
            const variable = globalScope.set && globalScope.set.get(name);
            if (variable) {
                variable.eslintUsed = true;
            }
        });
    }
`;

function patchFile(file, marker, insertion) {
  if (!fs.existsSync(file)) {
    return;
  }
  const source = fs.readFileSync(file, "utf8");
  if (source.includes("__isNodejsScope()")) {
    if (!source.includes("addGlobals(") && source.includes(marker)) {
      const next = source.replace(marker, `${insertion}\n${marker}`);
      fs.writeFileSync(file, next);
      console.log("added addGlobals", file);
    }
    return;
  }
  if (!source.includes(marker)) {
    return;
  }
  fs.writeFileSync(file, source.replace(marker, `${insertion}\n${marker}`));
  console.log("patched", file);
}

const root = path.join(__dirname, "..", "node_modules");

patchFile(
  path.join(root, "eslint-scope/lib/scope-manager.js"),
  "    isGlobalReturn() {",
  methods
);

patchFile(
  path.join(root, "eslint-scope/dist/eslint-scope.cjs"),
  "    isGlobalReturn() {",
  methods
);

patchFile(
  path.join(root, "@typescript-eslint/scope-manager/dist/ScopeManager.js"),
  "    isGlobalReturn() {",
  tsMethods
);

patchFile(
  path.join(
    root,
    "@nicolo-ribaudo/eslint-scope-5-internals/node_modules/eslint-scope/lib/scope-manager.js"
  ),
  "    isModule() {",
  `
    addGlobals(names = []) {
        const globalScope = this.globalScope;
        if (!globalScope || !Array.isArray(names)) {
            return;
        }
        names.forEach((name) => {
            const variable = globalScope.set && globalScope.set.get(name);
            if (variable) {
                variable.eslintUsed = true;
            }
        });
    }
`
);
