module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es6": true
    },
    "extends": "eslint:recommended",
    "parser": "babel-eslint",
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "plugins": [
        "react"
    ],
    "rules": {
        "indent": [
            "error",
            "tab"
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "double"
        ],
        "semi": [
            "error",
            "always"
        ],
        "import/no-extraneous-dependencies": 1,
        "no-underscore-dangle": 1,
        "no-return-assign": 1,
        "arrow-body-style": 0,
        "no-plusplus": 0,
        "no-unsafe-finally": 0,
        "no-use-before-define": 1,//使用和定义的顺序 警告就好
        "class-methods-use-this": 0,
        "import/prefer-default-export": 0,
        "no-restricted-properties": 1,
        "linebreak-style": 0,
        "semi": 0,// [2, "always"],//语句强制分号结尾
        "prefer-rest-params": 0,//arguments 参数不许使用
        "prefer-const": 1,//const 警告
        "comma-dangle": 1,//对象字面量项尾不能有逗号
        "no-console": 0,
        "no-await-in-loop": 0,//
        "no-extend-native": 1,
        "import/no-extraneous-dependencies": 1,
        "consistent-return": 1,
        "no-undef": 1,
        "no-cond-assign": 1,
        "no-empty": 1,
        "no-mixed-spaces-and-tabs": 1,
        'no-tabs': 0,
        'no-mixed-spaces-and-tabs': 0,
        'indent': ["off", "tab"],
        'no-trailing-spaces': 0,
        "no-unused-vars": 1,
    }
};