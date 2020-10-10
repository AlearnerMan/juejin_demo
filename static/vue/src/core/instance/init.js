/* @flow */

import config from "../config";
import { initProxy } from "./proxy";
import { initState } from "./state";
import { initRender } from "./render";
import { initEvents } from "./events";
import { mark, measure } from "../util/perf";
import { initLifecycle, callHook } from "./lifecycle";
import { initProvide, initInjections } from "./inject";
import { extend, mergeOptions, formatComponentName } from "../util/index";

let uid = 0;

// 创建Vue 对象之后 第一个调用该方法 初始化了 _init方法（Vue构造函数中调用）
export function initMixin(Vue: Class<Component>) {
  // ts泛型 啥意思 class 类型的？？？？
  Vue.prototype._init = function(options?: Object) {
    // 参数可有可无 有的话 是对象类型
    // eslint-disable-next-line no-undef
    const vm: Component = this; // 定义this 对象表示
    // a uid
    vm._uid = uid++;

    // 这一段是个什么鬼 干啥的？？？？ window.performance 检测性能  创建vue对象的开始检测
    let startTag, endTag;
    /* istanbul ignore if */
    if (process.env.NODE_ENV !== "production" && config.performance && mark) {
      startTag = `vue-perf-start:${vm._uid}`;
      endTag = `vue-perf-end:${vm._uid}`;
      mark(startTag);
    }

    // a flag to avoid this being observed
    vm._isVue = true;
    // merge options
    // 合并 options参数的
    if (options && options._isComponent) {
      // _isComponent 代表啥意思呢？？ 是否是组件吗？  应该是的
      // optimize internal component instantiation
      // since dynamic options merging is pretty slow, and none of the
      // internal component options needs special treatment.
      initInternalComponent(vm, options);
    } else {
      // mergeOptions 方法 ：合并多个options 到一个options里面
      vm.$options = mergeOptions(
        // mergeOptions方法： 在util/options.js中定义
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
      );
    }
    /* istanbul ignore else */
    // 这个地方设置个代理 啥意思？？
    // 设置个代理的意思应该就是保证 设置的属性值 应该是非保留字、_开头 等等

    if (process.env.NODE_ENV !== "production") {
      initProxy(vm);
    } else {
      vm._renderProxy = vm;
    }
    // expose real self
    vm._self = vm;
    // 初始化了一些变量 $parent $children $root $refs...
    initLifecycle(vm);
    // 初始化这个东西--listeners  初始化自带的事件？？
    initEvents(vm);
    // 应该是处理双向绑定的地方--不是的 这个是初始化render函数的？干啥用的
    initRender(vm);
    // 在这个之前 初始化了事件、生命周期  ？？？ 事件和生命周期指的是啥？？
    // 开始执行beforeCreate生命周期
    callHook(vm, "beforeCreate");
    // 处理inject 找到父组件中provide注入的属性
    initInjections(vm); // resolve injections before data/props
    // 处理响应式数据的吧？？？
    // 这个方法里面已经双向绑定了data props computed 还有定义了methods方法了

    initState(vm);
    // 初始化了 provide 方法
    // vm._provided  赋值
    initProvide(vm); // resolve provide after data/props
    callHook(vm, "created");

    /* istanbul ignore if */
    if (process.env.NODE_ENV !== "production" && config.performance && mark) {
      vm._name = formatComponentName(vm, false);
      mark(endTag);
      measure(`vue ${vm._name} init`, startTag, endTag);
    }
    // 如果存在 el属性的话 那就执行 $mount方法
    // 那么问题来了 这个方法又是哪里定义的呢。。。。
    if (vm.$options.el) {
      vm.$mount(vm.$options.el);
    }
  };
}

export function initInternalComponent(
  vm: Component,
  options: InternalComponentOptions
) {
  // 这个地方的 vm.constructor  返回的是创建改对象的构造函数的引用  ---> function Vue(){}...  然后在initGobal方法里面 给Vue对象绑定了许多的默认属性
  const opts = (vm.$options = Object.create(vm.constructor.options));
  // doing this because it's faster than dynamic enumeration.
  const parentVnode = options._parentVnode;
  opts.parent = options.parent;
  opts._parentVnode = parentVnode;

  const vnodeComponentOptions = parentVnode.componentOptions;
  opts.propsData = vnodeComponentOptions.propsData;
  opts._parentListeners = vnodeComponentOptions.listeners;
  opts._renderChildren = vnodeComponentOptions.children;
  opts._componentTag = vnodeComponentOptions.tag;

  if (options.render) {
    opts.render = options.render;
    opts.staticRenderFns = options.staticRenderFns;
  }
}

export function resolveConstructorOptions(Ctor: Class<Component>) {
  let options = Ctor.options;
  // 判断当前组件有没有父组件   这个地方也是在extend.js 中定义的 这个应该是调用了extend 方法之后 才会有这个属性的
  if (Ctor.super) {
    // 递归设置当前vue对象的 父组件的参数值
    const superOptions = resolveConstructorOptions(Ctor.super);
    const cachedSuperOptions = Ctor.superOptions;
    if (superOptions !== cachedSuperOptions) {
      // super option changed,
      // need to resolve new options.
      // 这个地方实际就是在赋值吧。？？？？？
      Ctor.superOptions = superOptions;
      // check if there are any late-modified/attached options (#4976)
      // 就是遍历属性 然后赋值
      const modifiedOptions = resolveModifiedOptions(Ctor);
      // update base extend options
      if (modifiedOptions) {
        // extend方法 在 share/util.js 里面  就是合并两个对象
        extend(Ctor.extendOptions, modifiedOptions);
      }
      options = Ctor.options = mergeOptions(superOptions, Ctor.extendOptions);
      if (options.name) {
        options.components[options.name] = Ctor;
      }
    }
  }
  return options;
}

function resolveModifiedOptions(Ctor: Class<Component>): ?Object {
  let modified;
  const latest = Ctor.options;
  const sealed = Ctor.sealedOptions;
  for (const key in latest) {
    if (latest[key] !== sealed[key]) {
      if (!modified) modified = {};
      modified[key] = latest[key];
    }
  }
  return modified;
}
