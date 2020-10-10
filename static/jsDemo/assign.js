export const myAssign = function(...args) {
  //   console.log(args);
  // args为数组 es6 rest参数
  //   let target = args[0];
  if (!args.length) return {};
  // 获取第一个元素为目标对象
  let target = args.splice(0, 1)[0];
  if (!target) return {};
  args.forEach(ele => {
    // 这个地方一开始用的for of 后来报错了 然后改成了for in  他们两个的区别？
    // for (let props in ele) {
    //   //   if (!target[props]) {
    //     target[props] = ele[props];
    //   //   }
    // }
    console.log("type", Object.prototype.toString.call(ele));
    // if (isObejct(ele) || isString(ele)) {
    //   isString(ele) && (ele = String(ele));
    for (let key of Reflect.ownKeys(ele)) {
      // 这个获取key的话可以获取symbol类型的键值
      target[key] = ele[key];
    }
    // }
  });
  return target;
};

function isObejct(obj) {
  return Object.prototype.toString.call(obj) === "object Object";
}
function isString(str) {
  return Object.prototype.toString.call(str) === "object String";
}

let obj1 = { a: 0, b: { c: 0 } };
let obj2 = myAssign({}, obj1);
console.log(JSON.stringify(obj2)); // { a: 0, b: { c: 0}}

obj1.a = 1;
console.log(JSON.stringify(obj1)); // { a: 1, b: { c: 0}}
console.log(JSON.stringify(obj2)); // { a: 0, b: { c: 0}}

obj2.a = 2;
console.log(JSON.stringify(obj1)); // { a: 1, b: { c: 0}}
console.log(JSON.stringify(obj2)); // { a: 2, b: { c: 0}}

obj2.b.c = 3;
console.log(JSON.stringify(obj1)); // { a: 1, b: { c: 3}}
console.log(JSON.stringify(obj2)); // { a: 2, b: { c: 3}}

// Deep Clone
obj1 = { a: 0, b: { c: 0 } };
// 深拷贝的实现
let obj3 = JSON.parse(JSON.stringify(obj1));
obj1.a = 4;
obj1.b.c = 4;
console.log(JSON.stringify(obj3)); // { a: 0, b: { c: 0}}

// const o1 = { a: 1, b: 1, c: 1 };
// const o2 = { b: 2, c: 2 };
// const o3 = { c: 3 };

// const obj = myAssign({}, o1, o2, o3);
// console.log(obj); // { a: 1, b: 2, c: 3 }

const o1 = { a: 1 };
const o2 = { [Symbol("foo")]: 2 };

const obj = myAssign({}, o1, o2);
console.log(obj); // { a : 1, [Symbol("foo")]: 2 } (cf. bug 1207182 on Firefox)
Object.getOwnPropertySymbols(obj); // [Symbol(foo)]

// const v1 = "abc";
// const v2 = true;
// const v3 = 10;
// const v4 = Symbol("foo");

// const obj4 = myAssign({}, v1, null, v2, undefined, v3, v4);
// // 原始类型会被包装，null 和 undefined 会被忽略。
// // 注意，只有字符串的包装对象才可能有自身可枚举属性。
// console.log(obj4); // { "0": "a", "1": "b", "2": "c" }
