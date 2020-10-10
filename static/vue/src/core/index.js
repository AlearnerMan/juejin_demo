import Vue from "./instance/index";
import { initGlobalAPI } from "./global-api/index";
import { isServerRendering } from "core/util/env";
import { FunctionalRenderContext } from "core/vdom/create-functional-component";

// 给Vue对象绑定了一些必要的属性和方法
initGlobalAPI(Vue);

// $isServer  判断是否运行在服务器
Object.defineProperty(Vue.prototype, "$isServer", {
  get: isServerRendering
});

// 这个属性是啥意思？d是否是服务端渲染的

Object.defineProperty(Vue.prototype, "$ssrContext", {
  get() {
    /* istanbul ignore next */
    return this.$vnode && this.$vnode.ssrContext;
  }
});

// expose FunctionalRenderContext for ssr runtime helper installation
Object.defineProperty(Vue, "FunctionalRenderContext", {
  value: FunctionalRenderContext
});

Vue.version = "__VERSION__";

export default Vue;
