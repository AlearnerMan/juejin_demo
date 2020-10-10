/* @flow */

import { ASSET_TYPES } from "shared/constants";
import { defineComputed, proxy } from "../instance/state";
import { extend, mergeOptions, validateComponentName } from "../util/index";

export function initExtend(Vue: GlobalAPI) {
  /**
   * Each instance constructor, including Vue, has a unique
   * cid. This enables us to create wrapped "child
   * constructors" for prototypal inheritance and cache them.
   */
  Vue.cid = 0;
  let cid = 1;

  /**
   * Class inheritance
   var Profile = Vue.extend({
      template: '<p>{{firstName}} {{lastName}} aka {{alias}}</p>',
      data: function () {
        return {
          firstName: 'Walter',
          lastName: 'White',
          alias: 'Heisenberg'
        }
      }
    })
   */
  Vue.extend = function(extendOptions: Object): Function {
    // extendOptions 传进来的是一个vue实例的所有参数
    extendOptions = extendOptions || {};
    // Super --> Vue ;
    const Super = this;
    // 在上面定义的
    const SuperId = Super.cid;
    // _Ctro 这个正常没有返回过 这个地方应该是防止 同样的对象重复调用extend方法 extend方法会在最后把这个vue 对象放到cachedCtors[SuperId] 里面
    // 但是每一次的 SuperId都不一样的 如果同一个对象重复调用extend的话 还是会生成不同的vue对象吧？？？
    // 这个地方 是判断_Ctor 吧？？？
    // 其实最后会把生成的sub放到 extendOptions._Ctor里面的
    // 这个SuperId 是在函数外面定义的 不会每次extend的时候都增加的
    const cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {});
    if (cachedCtors[SuperId]) {
      return cachedCtors[SuperId];
    }

    const name = extendOptions.name || Super.options.name;
    if (process.env.NODE_ENV !== "production" && name) {
      // 这个地方只是校验了一下名字是不是符合规范,没干别的
      validateComponentName(name);
    }
    // 后面就是跟最开始定义Vue构造函数的时候一样了
    const Sub = function VueComponent(options) {
      this._init(options);
    };
    // Sub 的原型指向 Super的原型
    Sub.prototype = Object.create(Super.prototype);
    // 修改原型链的指向  这种情况下 Vue实例遍历时 constructor 属性是可以枚举的 ？？？
    Sub.prototype.constructor = Sub;
    Sub.cid = cid++;
    Sub.options = mergeOptions(Super.options, extendOptions);
    Sub.super = Super;

    // For props and computed properties, we define the proxy getters on
    // the Vue instances at extension time, on the extended prototype. This
    // avoids Object.defineProperty calls for each instance created.
    if (Sub.options.props) {
      initProps(Sub);
    }
    if (Sub.options.computed) {
      initComputed(Sub);
    }

    // allow further extension/mixin/plugin usage
    Sub.extend = Super.extend;
    Sub.mixin = Super.mixin;
    Sub.use = Super.use;

    // create asset registers, so extended classes
    // can have their private assets too.
    ASSET_TYPES.forEach(function(type) {
      Sub[type] = Super[type];
    });
    // enable recursive self-lookup
    if (name) {
      Sub.options.components[name] = Sub;
    }

    // keep a reference to the super options at extension time.
    // later at instantiation we can check if Super's options have
    // been updated.
    Sub.superOptions = Super.options;
    Sub.extendOptions = extendOptions;
    Sub.sealedOptions = extend({}, Sub.options);

    // cache constructor
    cachedCtors[SuperId] = Sub;
    return Sub;
  };
}

function initProps(Comp) {
  const props = Comp.options.props;
  for (const key in props) {
    proxy(Comp.prototype, `_props`, key);
  }
}

function initComputed(Comp) {
  const computed = Comp.options.computed;
  for (const key in computed) {
    defineComputed(Comp.prototype, key, computed[key]);
  }
}
