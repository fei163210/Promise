/* 
util.promisify方法
*/

// 引入util模块
const util = require('util');
// 引入fs模块
const fs = require('fs');
// 返回一个新的函数,将函数Promise化,不需要再每次去封装回调函数
let mineReadFile = util.promisify(fs.readFile);

mineReadFile('./resource/context.txt').then(
  value => {
    console.log(value.toString());
  },
  reason => {}
);
