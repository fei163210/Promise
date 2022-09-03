// 封装成一个类
class Promise {
  // 1.定义构造函数
  constructor(executor) {
    //添加属性
    this.PromiseState = 'pending';
    this.PromiseResult = 'null';
    //添加保存回调函数的属性,设置成数组防止多重调用覆盖
    //   this.callback = {};
    this.callbacks = [];
    // 封装循环执行回调函数
    const each = (type, data) => {
      this.callbacks.forEach(item => {
        if (type === 'onRejected') {
          item.onRejected(data);
        } else {
          item.onResolved(data);
        }
      });
    };
    const resolve = data => {
      // 判断状态，使得状态只能修改一次
      if (this.PromiseState !== 'pending') return;
      // 修改对象的状态
      this.PromiseState = 'fullfilled';
      // 修改对象的结果值
      this.PromiseResult = data;
      setTimeout(() => {
        // 判断是否有回调函数需要执行
        each('onResloved', data);
      });
    };

    const reject = data => {
      // 判断状态，使得状态只能修改一次
      if (this.PromiseState !== 'pending') return;
      // 修改对象的状态
      this.PromiseState = 'rejected';
      // 修改对象的结果值
      this.PromiseResult = data;
      setTimeout(() => {
        // 判断是否有回调函数需要执行
        each('onRejected', data);
      });
    };
    // 考虑抛出异常的情况
    try {
      // 同步调用执行器函数
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }
  // 2. 添加then方法
  then(onResolve, onReject) {
    //判断回调函数参数
    if (typeof onResolve !== 'function') {
      onResolve = value => {
        return value;
      };
    }
    // 实现异常传透
    if (typeof onReject !== 'function') {
      onReject = reason => {
        throw reason;
      };
    }
    return new Promise((resolve, reject) => {
      // 封装回调函数的执行结果
      const callback = type => {
        try {
          let result = type(this.PromiseResult);
          if (result instanceof Promise) {
            // 表示返回是Promise实例对象
            result.then(
              v => {
                resolve(v);
              },
              b => {
                // 调用reject会把状态更新为rejected
                reject(b);
              }
            );
          } else {
            // 表示是非Promise实例对象,reslove会改变状态为成功，且输出对应的值
            resolve(result);
          }
        } catch (error) {
          reject(error);
        }
      };
      // 判断当前状态
      if (this.PromiseState === 'fullfilled') {
        setTimeout(() => {
          // 调用回调函数
          callback(onResolve);
        });
      }
      if (this.PromiseState === 'rejected') {
        setTimeout(() => {
          // 调用回调函数
          callback(onReject);
        });
      }
      if (this.PromiseState === 'pending') {
        this.callbacks.push({
          onResolved: () => {
            // 调用回调函数
            callback(onResolve);
          },
          onRejected: () => {
            // 调用回调函数
            callback(onReject);
          },
        });
      }
    });
  }
  // 3.添加catch方法
  catch(onRejected) {
    return this.then(undefined, onRejected);
  }
  // 4.添加Promise的Resolve方法，注意:Resolve方法是Promise这个函数的，而不是实例对象的
  static resolve(value) {
    // 返回Promise对象
    return new Promise((resolve, reject) => {
      if (value instanceof Promise) {
        value.then(
          v => {
            resolve(v);
          },
          r => {
            reject(r);
          }
        );
      } else {
        resolve(value);
      }
    });
  }
  // 5.添加Promise的Reject方法,无论传入什么都是失败的返回值
  static reject(reason) {
    return new Promise((resolve, reject) => {
      if (reason instanceof Promise) {
        reason.then(
          v => {
            reject(v);
          },
          r => {
            reject(r);
          }
        );
      } else {
        reject(reason);
      }
    });
  }
  // 6.添加Promise的all方法
  static all(promises) {
    return new Promise((resolve, reject) => {
      let count = 0;
      let res = [];
      for (let i = 0; i < promises.length; i++) {
        promises[i].then(
          v => {
            // 得知对象的状态是成功
            // 每个promise对象都是成功
            count++;
            res[i] = v;
            if (count == promises.length) {
              resolve(res);
            }
          },
          r => {
            reject(r);
          }
        );
      }
    });
  }
  // 7.添加Promise的race方法
  static race(promises) {
    return new Promise((resolve, reject) => {
      for (let i = 0; i < promises.length; i++) {
        promises[i].then(
          v => {
            resolve(v);
          },
          r => {
            reject(r);
          }
        );
      }
    });
  }
}
