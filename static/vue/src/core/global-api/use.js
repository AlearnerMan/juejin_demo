/* @flow */

import { toArray } from "../util/index";

// 这个地方 定义了 VUE的use方法 调用install方法
export function initUse(Vue: GlobalAPI) {
  // Vue 是一个函数对象。。 然后这个方法给他加了一个 _installedPlugins属性 值为加到里面的插件数组
  Vue.use = function(plugin: Function | Object) {
    const installedPlugins =
      this._installedPlugins || (this._installedPlugins = []);
    if (installedPlugins.indexOf(plugin) > -1) {
      return this;
    }

    // additional parameters
    const args = toArray(arguments, 1);
    // this有啥意义？？unshift() 方法可向数组的开头添加一个或更多元素
    // MyPlugin.install = function (Vue, options) {}  this-->Vue
    args.unshift(this);
    if (typeof plugin.install === "function") {
      plugin.install.apply(plugin, args);
    } else if (typeof plugin === "function") {
      plugin.apply(null, args);
    }
    installedPlugins.push(plugin);
    return this;
  };
}
