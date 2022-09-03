/* 
封装一个函数 minReadFile 读取文件内容
参数：path 文件路径
返回：promise 对象
*/
function minReadFile(path) {
  return new Promise((resolve, reject) => {
    require('fs').readFile(path, (err, data) => {
      // 判断
      if (err) reject(err);
      // 成功
      resolve(data);
    });
  });
}

minReadFile('./resource/context.txt').then(
  value => {
    // 输出文件内容
    console.log(value.toString());
  },
  reason => {
    console.log(reason);
  }
);
