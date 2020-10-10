/* @flow */

import config from "../config";
import Watcher from "../observer/watcher";
import Dep, { pushTarget, popTarget } from "../observer/dep";
import { isUpdatingChildComponent } from "./lifecycle";

import {
  set,
  del,
  observe,
  defineReactive,
  toggleObserving
} from "../observer/index";

import {
  warn,
  bind,
  noop,
  hasOwn,
  hyphenate,
  isReserved,
  handleError,
  nativeWatch,
  validateProp,
  isPlainObject,
  isServerRendering,
  isReservedAttribute
} from "../util/index";

const sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop
};

// 这个是啥意思 this指的是vm吧
export function proxy(target: Object, sourceKey: string, key: string) {
  sharedPropertyDefinition.get = function proxyGetter() {
    return this[sourceKey][key];
  };
  sharedPropertyDefinition.set = function proxySetter(val) {
    this[sourceKey][key] = val;
  };
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

export function initState(vm: Component) {
  vm._watchers = [];
  const opts = vm.$options;
  if (opts.props) initProps(vm, opts.props);
  if (opts.methods) initMethods(vm, opts.methods);
  if (opts.data) {
    initData(vm);
  } else {
    observe((vm._data = {}), true /* asRootData */);
  }
  // 计算属性 。。。
  if (opts.computed) initComputed(vm, opts.computed);
  // export const nativeWatch = {}.watch;   不知道这个nativeWatch 是个啥意思 反正就是异常情况了
  if (opts.watch && opts.watch !== nativeWatch) {
    initWatch(vm, opts.watch);
  }
}

function initProps(vm: Component, propsOptions: Object) {
  // 这个地方啥时候把props属性的赋值给propdata的呢？？？？
  const propsData = vm.$options.propsData || {};
  // 这是个赋值语句 props vm._props 都是{}
  const props = (vm._props = {});

  // cache prop keys so that future props updates can iterate using Array
  // instead of dynamic object key enumeration.
  // 这个地方使用数组 是为了后面属性更新的时候可以使用过数组进行迭代更新，而不是对一个动态的对象进行遍历吧
  const keys = (vm.$options._propKeys = []);
  // 这个地方啥意思  判断是否是根节点吗？ 应该是的
  const isRoot = !vm.$parent;
  // root instance props should be converted
  // 这个地方 啥意思 在obsever/index 中 改变了一个变量的值
  if (!isRoot) {
    toggleObserving(false);
  }
  // propsOptions --> vm.$options.props
  for (const key in propsOptions) {
    // 缓存一下key值
    keys.push(key);
    // 这个方法里面就是处理对应的props属性 值 然后observe（props) 不知道是啥意思的  ？？？？？
    const value = validateProp(key, propsOptions, propsData, vm);
    /* istanbul ignore else */
    // 判断这个props是不是一个保留的属性 是的话 给出提示信息
    if (process.env.NODE_ENV !== "production") {
      // 这个方法 是吧 propsData --> props-data
      const hyphenatedKey = hyphenate(key);
      if (
        // 是不是关键字 key,ref,slot,slot-scope,is
        isReservedAttribute(hyphenatedKey) ||
        // 什么鬼 ？？？ config里面的
        config.isReservedAttr(hyphenatedKey)
      ) {
        warn(
          `"${hyphenatedKey}" is a reserved attribute and cannot be used as component prop.`,
          vm
        );
      }
      // 这个地方才是 双向绑定的方法 。。。。
      defineReactive(props, key, value, () => {
        if (!isRoot && !isUpdatingChildComponent) {
          warn(
            `Avoid mutating a prop directly since the value will be ` +
              `overwritten whenever the parent component re-renders. ` +
              `Instead, use a data or computed property based on the prop's ` +
              `value. Prop being mutated: "${key}"`,
            vm
          );
        }
      });
    } else {
      defineReactive(props, key, value);
    }
    // static props are already proxied on the component's prototype
    // during Vue.extend(). We only need to proxy props defined at
    // instantiation here.
    // 给 vm[key]绑定值  把key 绑定到vm实例上面 这样使用的时候 可以用 this[key]来使用吧？？？？？
    if (!(key in vm)) {
      proxy(vm, `_props`, key);
    }
  }
  toggleObserving(true);
}

function initData(vm: Component) {
  let data = vm.$options.data;
  data = vm._data = typeof data === "function" ? getData(data, vm) : data || {};
  // 判断data 是不是一个对象  Object.prototype.toString.call(data) == '[object Object]'
  if (!isPlainObject(data)) {
    data = {};
    process.env.NODE_ENV !== "production" &&
      warn(
        "data functions should return an object:\n" +
          "https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function",
        vm
      );
  }
  // proxy data on instance
  const keys = Object.keys(data);
  const props = vm.$options.props;
  const methods = vm.$options.methods;
  let i = keys.length;
  while (i--) {
    const key = keys[i];
    // 是否和methods里面变量重名
    if (process.env.NODE_ENV !== "production") {
      if (methods && hasOwn(methods, key)) {
        warn(
          `Method "${key}" has already been defined as a data property.`,
          vm
        );
      }
    }
    // 是否和props里面变量重名
    if (props && hasOwn(props, key)) {
      process.env.NODE_ENV !== "production" &&
        warn(
          `The data property "${key}" is already declared as a prop. ` +
            `Use prop default value instead.`,
          vm
        );
      // 判断这个key 是不是以_或$ 开头的  不是的话 给 vm赋值 vm.key = vm._data.
    } else if (!isReserved(key)) {
      //  get--> vm[_data][key]   set --> vm[_data][key] = value
      proxy(vm, `_data`, key);
    }
  }
  // observe data
  // 观察这个对象 是干啥的呢？？？
  observe(data, true /* asRootData */);
}

export function getData(data: Function, vm: Component): any {
  // #7573 disable dep collection when invoking data getters
  pushTarget();
  try {
    return data.call(vm, vm);
  } catch (e) {
    handleError(e, vm, `data()`);
    return {};
  } finally {
    // finally 这个会先执行 然后再是 return 中的语句
    popTarget();
  }
}

const computedWatcherOptions = { lazy: true };

function initComputed(vm: Component, computed: Object) {
  // $flow-disable-line
  const watchers = (vm._computedWatchers = Object.create(null));
  // computed properties are just getters during SSR
  const isSSR = isServerRendering();

  for (const key in computed) {
    const userDef = computed[key];
    // 判断 如果计算属性定义的是function 就直接当做这个属性的getter方法，如果是对象 那就获取这个对象里面的get属性值
    const getter = typeof userDef === "function" ? userDef : userDef.get;
    // 如果计算属性不是function 又不是一个有get方法的对象 ，那就给出提示信息 缺少get方法
    if (process.env.NODE_ENV !== "production" && getter == null) {
      warn(`Getter is missing for computed property "${key}".`, vm);
    }
    // 不是服务端渲染的话 就给这个属性定义一个 watcher
    if (!isSSR) {
      // create internal watcher for the computed property.
      // 那这个wather 是干啥的呢？？？？
      watchers[key] = new Watcher(
        vm,
        getter || noop,
        noop,
        computedWatcherOptions
      );
    }

    // component-defined computed properties are already defined on the
    // component prototype. We only need to define computed properties defined
    // at instantiation here.
    if (!(key in vm)) {
      defineComputed(vm, key, userDef);
    } else if (process.env.NODE_ENV !== "production") {
      // 这个时候已经把data 还有props 属性 通过那个 proxy方法绑定到了实例上面了
      if (key in vm.$data) {
        warn(`The computed property "${key}" is already defined in data.`, vm);
      } else if (vm.$options.props && key in vm.$options.props) {
        warn(
          `The computed property "${key}" is already defined as a prop.`,
          vm
        );
      }
    }
  }
}

export function defineComputed(
  target: any,
  key: string,
  userDef: Object | Function
) {
  // isServerRendering方法： 是否是服务端渲染
  const shouldCache = !isServerRendering();
  if (typeof userDef === "function") {
    sharedPropertyDefinition.get = shouldCache
      ? // 不是的话 从watcher中取这个value 值
        createComputedGetter(key)
      : createGetterInvoker(userDef);
    sharedPropertyDefinition.set = noop;
  } else {
    sharedPropertyDefinition.get = userDef.get
      ? shouldCache && userDef.cache !== false
        ? createComputedGetter(key)
        : createGetterInvoker(userDef.get)
      : noop;
    sharedPropertyDefinition.set = userDef.set || noop;
  }
  if (
    process.env.NODE_ENV !== "production" &&
    sharedPropertyDefinition.set === noop
  ) {
    sharedPropertyDefinition.set = function() {
      warn(
        `Computed property "${key}" was assigned to but it has no setter.`,
        this
      );
    };
  }
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function createComputedGetter(key) {
  return function computedGetter() {
    const watcher = this._computedWatchers && this._computedWatchers[key];
    if (watcher) {
      if (watcher.dirty) {
        watcher.evaluate();
      }
      if (Dep.target) {
        watcher.depend();
      }
      return watcher.value;
    }
  };
}

function createGetterInvoker(fn) {
  return function computedGetter() {
    return fn.call(this, this);
  };
}

// 初始化方法 这个好简单。。。。
function initMethods(vm: Component, methods: Object) {
  const props = vm.$options.props;
  for (const key in methods) {
    if (process.env.NODE_ENV !== "production") {
      if (typeof methods[key] !== "function") {
        warn(
          `Method "${key}" has type "${typeof methods[
            key
          ]}" in the component definition. ` +
            `Did you reference the function correctly?`,
          vm
        );
      }
      if (props && hasOwn(props, key)) {
        warn(`Method "${key}" has already been defined as a prop.`, vm);
      }
      if (key in vm && isReserved(key)) {
        warn(
          `Method "${key}" conflicts with an existing Vue instance method. ` +
            `Avoid defining component methods that start with _ or $.`
        );
      }
    }
    vm[key] =
      typeof methods[key] !== "function" ? noop : bind(methods[key], vm);
  }
}

// watch 监听数据变化
function initWatch(vm: Component, watch: Object) {
  for (const key in watch) {
    const handler = watch[key];
    /*
      watch: {
        a: ["handler"]
      },
      methods: {
        handler() {
          console.log(123);
        }
      },
    */
    if (Array.isArray(handler)) {
      for (let i = 0; i < handler.length; i++) {
        createWatcher(vm, key, handler[i]);
      }
    } else {
      createWatcher(vm, key, handler);
    }
  }
}

function createWatcher(
  vm: Component,
  expOrFn: string | Function,
  handler: any,
  options?: Object
) {
  if (isPlainObject(handler)) {
    options = handler;
    handler = handler.handler;
  }
  if (typeof handler === "string") {
    handler = vm[handler];
  }
  // $watch 是在哪里定义的呢？？？ 下面定义的。。
  // 在下面定义的但是还没执行呢 怎么会有 $watch呢？？？
  return vm.$watch(expOrFn, handler, options);
}

export function stateMixin(Vue: Class<Component>) {
  // flow somehow has problems with directly declared definition object
  // when using Object.defineProperty, so we have to procedurally build up
  // the object here.
  const dataDef = {};
  dataDef.get = function() {
    return this._data;
  };
  const propsDef = {};
  propsDef.get = function() {
    return this._props;
  };
  if (process.env.NODE_ENV !== "production") {
    dataDef.set = function() {
      warn(
        "Avoid replacing instance root $data. " +
          "Use nested data properties instead.",
        this
      );
    };
    propsDef.set = function() {
      warn(`$props is readonly.`, this);
    };
  }
  Object.defineProperty(Vue.prototype, "$data", dataDef);
  Object.defineProperty(Vue.prototype, "$props", propsDef);

  Vue.prototype.$set = set;
  Vue.prototype.$delete = del;

  Vue.prototype.$watch = function(
    expOrFn: string | Function,
    cb: any,
    options?: Object
  ): Function {
    const vm: Component = this;
    if (isPlainObject(cb)) {
      return createWatcher(vm, expOrFn, cb, options);
    }
    options = options || {};
    options.user = true;
    // Watcher 是个啥东西？？？
    const watcher = new Watcher(vm, expOrFn, cb, options);
    // immediate 这个属性代表立即执行 该对象绑定的handle函数
    if (options.immediate) {
      try {
        cb.call(vm, watcher.value);
      } catch (error) {
        handleError(
          error,
          vm,
          `callback for immediate watcher "${watcher.expression}"`
        );
      }
    }
    // $watch 方法 返回一个取消观察函数 用来停止触发回调
    return function unwatchFn() {
      watcher.teardown();
    };
  };
}
