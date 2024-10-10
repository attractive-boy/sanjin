module.exports = {
    extends: [
      'plugin:vue/essential',
      'eslint:recommended',
      'plugin:prettier/recommended' // 添加 Prettier
    ],
    rules: {
      'prettier/prettier': ['error'], // 使 Prettier 规则作为 ESLint 的错误
      // 其他自定义规则
    },
  };
  