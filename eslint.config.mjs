import eslint from "@eslint/js";
import prettierConfig from "eslint-config-prettier";
import eslintPluginReactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist", "example", "node_modules", "eslint.config.mjs"] },
  eslint.configs.recommended,
  tseslint.configs.recommended,
  prettierConfig,
  // base
  {
    rules: {
      eqeqeq: [
        "error",
        "always",
        {
          null: "ignore"
        }
      ],
      "no-console": [
        "warn",
        {
          allow: ["warn", "error"]
        }
      ]
    }
  },
  // typescript
  {
    rules: {
      "@typescript-eslint/ban-ts-comment": "warn",
      "@typescript-eslint/no-explicit-any": [
        "warn",
        {
          fixToUnknown: true
        }
      ],
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_"
        }
      ],
      "@typescript-eslint/consistent-type-definitions": ["error", "type"]
    }
  },
  // react-hooks
  {
    plugins: { "react-hooks": eslintPluginReactHooks },
    rules: eslintPluginReactHooks.configs.recommended.rules
  },
  // react-refresh
  {
    plugins: { "react-refresh": reactRefresh },
    rules: {
      "react-refresh/only-export-components": [
        "warn",
        {
          allowConstantExport: true
        }
      ]
    }
  }
);
