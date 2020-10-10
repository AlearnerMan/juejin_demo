import { initMixin } from "./init";
import { stateMixin } from "./state";
import { renderMixin } from "./render";
import { eventsMixin } from "./events";
import { lifecycleMixin } from "./lifecycle";
import { warn } from "../util/index";

// 使用函数式的构造函数
function Vue(options) {
  // 如果当前的环境不是在 生产环境 并且 不是通过new Vue 方式 调用的话  给一个warn 提示信息
  if (process.env.NODE_ENV !== "production" && !(this instanceof Vue)) {
    warn("Vue is a constructor and should be called with the `new` keyword");
  }
  // 调用初始化方法  _init 是在init中定义在原型中的方法
  this._init(options);
}

// 初始化_init 方法 ，然后 绑定数据  给对应的Vue实例绑定
initMixin(Vue);
// 给Vue原型上面绑定了 $data $props $del $set $watch
stateMixin(Vue);
// 绑定 $on $once $emit $once 方法
eventsMixin(Vue);
// 给原型链上 绑定 _update $forceUpdate $destroy
lifecycleMixin(Vue);
// 给原型链上 $nextTick _render
renderMixin(Vue);

export default Vue;
