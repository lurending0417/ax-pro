module.exports = {
    root: true,
    parser: 'babel-eslint',
    env: {
        browser: true,
        node: true
    },
    extends: 'standard',
    // required to lint *.vue files
    plugins: [
        'html'
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
    },
    globals: {}
}
