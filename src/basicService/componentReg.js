/*
    全局组件注册
*/

import Vue from "vue";
import Button from "../components/button/index.vue";

// import upperFirst from "lodash/upperFirst";
// import camelCase from "lodash/camelCase";

Vue.component("App-Button", Button);

const requireComponent = require.context(
  // 其组件目录的相对路径
  "../components",
  // 是否查询其子目录
  false,
  // 匹配基础组件文件名的正则表达式
  /[A-Z]\w+\.(vue|js)$/
);
// requireComponent.keys();
console.log(requireComponent);
