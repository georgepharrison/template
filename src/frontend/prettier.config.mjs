// prettier.config.mjs

/** @type {import("prettier").Config} */
export default {
  plugins: [
    '@ianvs/prettier-plugin-sort-imports',
    'prettier-plugin-tailwindcss',
  ],

  // Tailwind - recognize cn() from shadcn utils
  tailwindFunctions: ['cn', 'clsx', 'cva'],

  // Import sorting
  importOrder: [
    '<BUILTIN_MODULES>',
    '',
    '<THIRD_PARTY_MODULES>',
    '',
    '^@/(.*)$',
    '',
    '^[./]',
  ],
  importOrderTypeScriptVersion: '5.0.0',

  // Base formatting
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'es5',
};
