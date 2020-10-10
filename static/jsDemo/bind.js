function bind(params) {
  // 拿到谁调用的bind
  let _this = this;
  // 判断一下 调用bind方法时 传入的参数是几个（bind支持传多个参数）
  //   const len = arguments.length;
  //   if (len > 1) {
  //     return () => {
  //       _this.apply(...[...arguments]);
  //     };
  //   }
  return () => {
    _this.call(...[...arguments]);
  };
}

function jg(params) {
  console.log(...[...arguments]);
}

// toObject([{a:123,b:222},{c:123,d:321},3])  --> {a: 123, b: 222, c: 123, d: 321}
function toObject(arr) {
  const res = {};
  for (let i = 0; i < arr.length; i++) {
    if (arr[i]) {
      for (var key in arr[i]) {
        res[key] = arr[i][key];
      }
    }
  }
  return res;
}
