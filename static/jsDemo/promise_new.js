class MyPromise {
  constructor(fn) {
    this.status = "pending";
    // 用于存储传到resolve/reject z中的参数
    this.value = "";
    // 定义resolve 和 reject 方法
    // 这个地方是因为适配调用的时候直接调用resolve或者reject的情况
    /*
      new Promise((resolve,reject)=>{
          resolve("aaa")//这样调用等同于全局调用（严格模式下this为undefined 非严格模式下为window，class中默认使用的事严格模式）
      })
    */

    const resolve = this.resolve.bind(this);
    const reject = this.reject.bind(this);

    // 用于存储 异步调用时 的成功和失败回调函数
    this.onResolveFuc = [];
    this.onRejectFuc = [];

    try {
      fn(resolve, reject);
    } catch (e) {
      reject(e);
    }
  }

  resolve(value) {
    if (this.status === "pending") {
      this.status = "fulfilled";
      this.value = value;
      this.onResolveFuc.length &&
        this.onResolveFuc.forEach(fn => {
          fn();
        });
    }
  }

  reject(value) {
    if (this.status === "pending") {
      this.status = "rejected";
      this.value = value;
      // 执行对应的回调函数
      this.onRejectFuc.length &&
        this.onRejectFuc.forEach(fn => {
          fn();
        });
    }
  }

  then(success, fail) {
    var promise = new MyPromise((resolve, reject) => {
      if (this.status === "fulfilled") {
        const x = success(this.value);
        // 这个函数用来判断返回值是否是一个promise实例
        resloveProRetrun(x, promise, resolve, reject);
      }
      if (this.status === "rejected") {
        const x = fail(this.value);
        resloveProRetrun(x, promise, resolve, reject);
      }
      if (this.status === "pending") {
        this.onResolveFuc.push(() => {
          const x = success(this.value);
          resloveProRetrun(x, promise, resolve, reject);
        });
        this.onRejectFuc.push(() => {
          const x = fail(this.value);
          resloveProRetrun(x, promise, resolve, reject);
        });
      }
    });
    return promise;
  }
  // then(success, fail) {
  //   if (this.status === "fulfilled") {
  //     const x = success(this.value);
  //   }
  //   if (this.status === "rejected") {
  //     // fail(this.value);
  //     const x = fail(this.value);
  //   }
  //   if (this.status === "pending") {
  //     // 这个属于异步调用了
  //     this.onResolveFuc.push(() => {
  //       //   success(this.value);
  //       const x = success(this.value);
  //     });
  //     this.onRejectFuc.push(() => {
  //       const x = fail(this.value);
  //     });
  //   }
  //   return this;
  // }
}

function resloveProRetrun(curPro, pro, resolve, reject) {
  // 用于解决重复调用的问题
  if (curPro === pro) {
    return reject(new TypeError("Chaining cycle detected for promise"));
  }
  // 判断上一个then的返回值 ，包括promise null/undefinded 对象..等等
  if (curPro && curPro instanceof MyPromise) {
    // 说明是promise对象
    // 分为同步还是异步（如果是同步的话 这个时候应该调用了resolve方法，然后在执行then方法（success函数执行））
    // 如果异步的话 这个时候就已经调用了then方法了，然后把方法放到了对应的 onResolveFuc/onrejectfuc数组中了，
    // ---注意这个时候就已经是第一个then中返回的哪个promise对象了 不是最开始的那个pormise对象了
    // 现在这个对象已经创建好了，但是还没有执行呢，执行的话就是调用then方法
    curPro.then(
      data => {
        resolve(data);
      },
      err => {
        reject(err);
      }
    );
  } else {
    // 这个时候返回 类似 return "aaa" 直接把返回值传给下一个then的success函数
    // if (curPro) {//这个判断是因为要控制一下 如果没有返回值的话就不要传递
    resolve(curPro); // 这个地方 如果上一次没有返回值的话 那下一次的then默认就是调用成功的回调了。
    // }
  }
}

new MyPromise((resolve, reject) => {
  resolve("111");
})
  .then(data => {
    console.log("resolve1: ", data);
    return new MyPromise((resolve, reject) => {
      resolve("222");
    });
  })
  .then(data => {
    console.log("resolve2: ", data);
  });

// var sss = new MyPromise((resolve, reject) => {
//   setTimeout(() => {
//     resolve("aaa");
//   }, 1000);
// })
//   .then(
//     data => {
//       console.log(data);
//       return new MyPromise((resolve, reject) => {
//         setTimeout(() => {
//           resolve("12222");
//         }, 1000);
//       });
//     },
//     err => {
//       console.log(err);
//     }
//   )
//   .then(
//     data => {
//       console.log("data", data);
//       return new MyPromise((resolve, reject) => {
//         setTimeout(() => {
//           resolve("66666");
//         }, 1000);
//       });
//     },
//     err => {
//       console.log("dataerr", err);
//     }
//   )
//   .then(
//     data => {
//       console.log("aaa", data);
//     },
//     err => {
//       console.log("err", err);
//     }
//   );
// // console.log("then返回值：", sss);
// // https://juejin.im/post/5e5f52fce51d4526ea7efdec#heading-20

function dealObjParams(arr) {
  if (Object.prototype.toString.call(arr) !== "[object Array]") return [];
  let preArr = arr.splice(0, 1)[0];
  return arr.reduce((pre, cur) => {
    if (pre[cur]) {
      return pre[cur];
    }
    return [];
  }, preArr);
}

var abc = {
  a: {
    b: {
      c: []
    }
  }
};
// abc.a && abc.a.b && abc.a.b.c && .
// dealObjParams([abc,'a','b','c'])
