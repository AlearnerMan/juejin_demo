/*
    创建对象的几种方式
    1.工厂模式（class）
    2.构造函数模式（function 构造函数）
    3.原型模式（prototype） 属性和方法都是共享的 这样的话当有一个属性为对象时  一个实例修改后 其他实例也会受影响


*/

// 原型链介绍
// 对象：无序属性的集合，其属性可以包含基本知识、对象或者函数
// 属性类型：数据属性和访问器属性
// isPrototypeOf()方法 确定两个对象之间的关系 是不是 实例--原型对象的关系
// Object.getPrototypeOf() 同上

var book = {};

Object.defineProperties(book, {
  // 这两个都是内部属性
  _year: {
    // 数据属性
    value: 2004
  },
  edtions: {
    // 数据属性
    value: 1
  },
  year: {
    // 访问器属性
    get() {
      return this._year;
    },
    set(newVal) {
      console.log(newVal);

      return (this._year = newVal);
    }
  }
});

// prototype

function Person() {}

Person.prototype = {
  name: "Tom",
  sayName: function() {
    console.log(this.name);
  }
};

var p1 = new Person();
p1.sayName();

Person.prototype = {
  newName: "Lucy",
  sayName: function() {
    console.log(this.newName);
  }
};

// 还是指向以前的原型对象
p1.sayName(); // Tom
