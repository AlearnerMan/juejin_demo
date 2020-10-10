class Promise {
  constructor(callback) {
    this.status = "pending";
    this.value = "";
    this.cbReturn = "";
    // 这个地方给resolve和reject方法绑定实例this对象 不然的话 在new promise中调用的时候 this对象会丢失
    this.reject = this.reject.bind(this);
    this.resolve = this.resolve.bind(this);
    this.cb_success = [];
    this.cb_fail = [];
    try {
      callback.call(this, this.resolve, this.reject);
    } catch (e) {
      this.reject(e);
    }
  }

  then(success, fail) {
    const promise2 = new Promise((resolve, reject) => {
      console.log("then:", this);
      if (this.status === "fulfilled") {
        const x = success(this.value);

        // 判断现在这个then里面返回的是不是 promise 对象 如果是的话 下面执行then的方法的时候要把 这个promise对象的 resolve的data值传到下一次的then中执行

        fucResolvePro(promise2, x, resolve, reject);
      }
      if (this.status === "reject") {
        const x = fail(this.value);
        fucResolvePro(promise2, x, resolve, reject);
      }
      if (this.status === "pending") {
        // 因为是异步的 所以要在改变状态之后才能调用改方法；
        this.cb_success.push(() => {
          const x = success(this.value);
          console.log("X", x);
          fucResolvePro(promise2, x, resolve, reject);
        });
        this.cb_fail.push(() => {
          const x = fail(this.value);
          fucResolvePro(promise2, x, resolve, reject);
        });
      }
    });
    // 实现链式调用
    return promise2;
  }

  resolve(val) {
    // console.log(this);
    // 判断当前的状态，只有当状态是pending的时候才会执行 成功方法
    if (this.status === "pending") {
      this.status = "fulfilled";
      // 定义一个value值  要把这个value值传递给 then中的成功回调中 执行
      this.value = val;
      this.cbReturn = val;
      // 这个时候去执行then里面定义的 成功回调方法
      // 要获取函数中返回了什么
      //   let cbReturn = this.value;
      this.cb_success.forEach(cb => {
        cb();
        // 首先判断是否是promise对象 ，如果是的话 改变执行的作用域
        // if (this.cbReturn instanceof Promise) {
        //   this.cbReturn.then(cb, err => {});
        //   //   cb.call(this.cbReturn)
        // } else {
        //   this.cbReturn = cb(this.cbReturn);
        // }

        // 判断返回的数据类型是否是promise
      });
    }
    // this.status = "resolve";
    // return this;
  }

  reject(val) {
    // console.log(this);
    if (this.status === "pending") {
      this.status = "reject";
      this.value = val;
      // 执行then中的reject方法
      // 要获取函数中返回了什么
      //   let cbReturn = this.value;
      this.cb_fail.forEach(cb => {
        // cbReturn = cb(cbReturn);s
        cb();
      });
    }
    // this.status = "reject";
  }
}

// 完成 resolvePromise函数
function resolvePromise(promise2, x, resolve, reject) {
  // 循环引用报错
  if (x === promise2) {
    return reject(new TypeError("Chaining cycle detected for promise"));
  }
  // 防止多次调用
  let called;
  // x不是null 并且 x是对象或者函数
  if (x != null && (typeof x === "object" || typeof x === "function")) {
    try {
      // A+ 规定 , 声明 then = x 的 then 方法
      const then = x.then;
      // 如果 then 是函数 , 就默认是promise 了
      if (typeof then === "function") {
        // 就让 then 执行 第一个参数是 this 后面是成功的回调 和失败的回调
        then.call(
          x,
          y => {
            // 成功和失败只能调用一个
            if (called) return;
            called = true;
            // resolve 就结果依旧是 promise 那就继续解析
            resolvePromise(promise2, y, resolve, reject);
          },
          err => {
            // 成功和失败只能调用一个
            if (called) return;
            called = true;
            reject(err);
          }
        );
      } else {
        resolve(x); // 直接成功即可
      }
    } catch (e) {
      // 也属于失败
      if (called) return;
      called = true;
      reject(e);
    }
  } else {
    resolve(x);
  }
}

// 判断第一个then返回的值是啥，然后在做下一步的动作

function fucResolvePro(pro, cbReturn, resolve, reject) {
  // 首先判断一下是否是重复调用
  //   if (pro === cbReturn) {
  //     return reject(new TypeError("Chaining cycle detected for promise"));
  //   }
  // 如果这个是返回是function 的话 默认为 promise
  if (cbReturn instanceof Promise && typeof cbReturn.then === "function") {
    // 调用他的then方法，但是一开始的时候就已经调用过了 现在在调用怎么解决？？
    // 这个时候调用then的this要改成cbReturn
    const then = cbReturn.then;
    cbReturn.then(
      y => {
        fucResolvePro(pro, y, resolve, reject);
      },
      err => {
        reject(err);
      }
    );
    // then.call(
    //   cbReturn,
    //   y => {
    //     fucResolvePro(pro, y, resolve, reject);
    //   },
    //   err => {
    //     reject(err);
    //   }
    // );
  } else {
    resolve(cbReturn);
  }
}

new Promise((resolve, reject) => {
  console.log("同步执行可以了");
  setTimeout(() => {
    resolve("aaa");
  }, 1000);
})
  .then(
    data => {
      console.log("success", data);
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve("bbbb");
        }, 1000);
      });
    },
    err => {
      //   console.log("fail", err);
    }
  )
  .then(
    data => {
      console.log("success2", data);
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve("qqqq");
        }, 1000);
      });
    },
    err => {
      //   console.log("fail2", err);
    }
  )
  .then(
    data => {
      console.log("success3", data);
    },
    err => {
      console.log("fail3");
    }
  );
