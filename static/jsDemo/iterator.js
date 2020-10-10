/*
    迭代器和promise对象相关方法

*/

// ES5自定义iterator 函数

function createIterator(items) {
  var i = 0;
  return {
    next: () => {
      const done = i >= items.length;
      const value = !done ? items[i++] : undefined;
      return {
        done,
        value
      };
    }
  };
}

// 检测对象是否为可迭代对象

function ifCanIterator(object) {
  return typeof object[Symbol.iterator] === "function";
}

// 生成器 --- 就是返回迭代器的函数

function* createIFuc() {
  yield 1;
  yield 2;
  yield 3;
}

var promise = new Promise((resolve, reject) => {});

function fetch() {
  setTimeout(() => {
    console.log("异步操作返回数据了。。。");
  }, 1000);
}
