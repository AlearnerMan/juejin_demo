/* @flow */

import { no, noop, identity } from "shared/util";

import { LIFECYCLE_HOOKS } from "shared/constants";

export type Config = {
  // user
  optionMergeStrategies: { [key: string]: Function },
  silent: boolean,
  productionTip: boolean,
  performance: boolean,
  devtools: boolean,
  errorHandler: ?(err: Error, vm: Component, info: string) => void,
  warnHandler: ?(msg: string, vm: Component, trace: string) => void,
  ignoredElements: Array<string | RegExp>,
  keyCodes: { [key: string]: number | Array<number> },

  // platform
  isReservedTag: (x?: string) => boolean,
  isReservedAttr: (x?: string) => boolean,
  parsePlatformTagName: (x: string) => string,
  isUnknownElement: (x?: string) => boolean,
  getTagNamespace: (x?: string) => string | void,
  mustUseProp: (tag: string, type: ?string, name: string) => boolean,

  // private
  async: boolean,

  // legacy
  _lifecycleHooks: Array<string>
};

export default ({
  /**
   * Option merge strategies (used in core/util/options)
     选项合并，用于合并core / util / options
   */
  // $flow-disable-line
  optionMergeStrategies: Object.create(null),

  /**
   * Whether to suppress warnings.
    是否取消警告
   */
  silent: false,

  /**
   * Show production mode tip message on boot?
   项目启动时 是否显示提示信息
   */
  productionTip: process.env.NODE_ENV !== "production",

  /**
   * Whether to enable devtools
   是否启用devtools
   */
  devtools: process.env.NODE_ENV !== "production",

  /**
   * Whether to record perf
   是否记录性能   
   */
  performance: false,

  /**
   * Error handler for watcher errors
   观察程序错误的错误处理程序
   */
  errorHandler: null,

  /**
   * Warn handler for watcher warns
   观察程序警告的警告处理程序
   */
  warnHandler: null,

  /**
   * Ignore certain custom elements
   忽略某些自定义元素  忽略某些标签
   Vue.config.ignoredElements = [
      'my-custom-web-component',
      'another-web-component',
      // 用一个 `RegExp` 忽略所有“ion-”开头的元素
      // 仅在 2.5+ 支持
      /^ion-/
    ]
   */
  ignoredElements: [],

  /**
   * Custom user key aliases for v-on
   给v-on自定义键位别名 
   Vue.config.keyCodes = {
      v: 86,
      f1: 112,
      // camelCase 不可用
      mediaPlayPause: 179,
      // 取而代之的是 kebab-case 且用双引号括起来
      "media-play-pause": 179,
      up: [38, 87]
    }
    <input type="text" @keyup.media-play-pause="method">
   */
  // $flow-disable-line
  keyCodes: Object.create(null),

  /**
   * Check if a tag is reserved so that it cannot be registered as a
   * component. This is platform-dependent and may be overwritten.
     检查是否保留了标记，以便它不能注册为组件。这取决于平台，可能会被覆盖 ？？？？？
     这个意思是说 判断当前标签是否可以注册成组件吧？
   */
  isReservedTag: no,

  /**
   * Check if an attribute is reserved so that it cannot be used as a component
   * prop. This is platform-dependent and may be overwritten.
   检查属性是否被保留 是否可以用于组件道具  根据不同的平台 可能被覆盖
   */
  isReservedAttr: no,

  /**
   * Check if a tag is an unknown element.
   * Platform-dependent.
   检查是否为未知元素 取决于平台
   */
  isUnknownElement: no,

  /**
   * Get the namespace of an element
   获取元素的命名空间
   */
  getTagNamespace: noop,

  /**
   * Parse the real tag name for the specific platform.
   var identity = function (_) { return _; };
   解析特定平台的真实标签名称
   */
  parsePlatformTagName: identity,

  /**
   * Check if an attribute must be bound using property, e.g. value
   * Platform-dependent.
   检查是否必须使用属性绑定属性 ？？？？
   */
  mustUseProp: no,

  /**
   * Perform updates asynchronously. Intended to be used by Vue Test Utils
   * This will significantly reduce performance if set to false.
   异步执行更新，由vue test util 使用，如果设置为false的话 会显著的降低性能
   */
  async: true,

  /**
   * Exposed for legacy reasons
   生命周期名称
    export const LIFECYCLE_HOOKS = [
      "beforeCreate",
      "created",
      "beforeMount",
      "mounted",
      "beforeUpdate",
      "updated",
      "beforeDestroy",
      "destroyed",
      "activated",
      "deactivated",
      "errorCaptured",
      "serverPrefetch"
    ];
   */
  _lifecycleHooks: LIFECYCLE_HOOKS
}: Config);
