module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  extends: [
    // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
    // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
    'plugin:vue/essential'
  ],
  // required to lint *.vue files
  plugins: [
    'vue'
  ],
  // add your custom rules here
  rules: {
    // 关闭验证2空格和4空格缩进
    'indent': [0],
    // 关闭语句末尾分号验证
    'semi': [0],
    // 关闭函数的小括号前必须有空格
    'space-before-function-paren': [0],
    // 关闭if后必须{
    'curly': [0],
    'no-cond-assign': [0]
  }
}



