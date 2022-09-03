//
const fs = require('fs');

// 回调函数的形式
// fs.readFile('./resource/context.txt', (err, data) => {
//   // 如果出错,则抛出错误
//   if (err) {
//     throw err;
//   }
//   //输出文件内容
//   console.log(data.toString());
// });

// Promise 形式
let p = new Promise((resolve, reject) => {
  fs.readFile('./resource/context.txt', (err, data) => {
    // 如果出错,则抛出错误
    if (err) {
      reject(err);
    }
    //输出文件内容
    resolve(data);
  });
});
p.then(
  data => {
    console.log(data.toString());
  },
  err => {
    throw err;
  }
);
