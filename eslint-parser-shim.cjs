const babelParser = require("@babel/eslint-parser");

function patchScopeManager(scopeManager) {
  if (!scopeManager) return scopeManager;

  if (typeof scopeManager.__isNodejsScope !== "function") {
    scopeManager.__isNodejsScope = function isNodejsScope() {
      return false;
    };
  }

  if (typeof scopeManager.addGlobals !== "function") {
    scopeManager.addGlobals = function addGlobals(names = []) {
      const globalScope = this.globalScope || this.scopes?.[0];
      if (!globalScope || !Array.isArray(names)) return;

      names.forEach((name) => {
        const variable = globalScope.set?.get?.(name);
        if (!variable) return;
        variable.eslintUsed = true;
        variable.references?.forEach((reference) => {
          reference.resolved = variable;
        });
      });
    };
  }

  return scopeManager;
}

module.exports = {
  parseForESLint(code, options) {
    const result = babelParser.parseForESLint(code, options);
    result.scopeManager = patchScopeManager(result.scopeManager);
    return result;
  },
  parse(code, options) {
    return babelParser.parse(code, options);
  },
};
