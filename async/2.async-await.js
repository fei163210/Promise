const fs = require('fs');
const util = require('util');
const mineReadFile = util.promisify(fs.readFile);
// async 和 await
async function main() {
  try {
    // 读取第一个文件的内容
    let data1 = await mineReadFile('../resource/context.txt');
    let data2 = await mineReadFile('../resource/context.txt');
    let data3 = await mineReadFile('../resource/context.txt');
    console.log(data1 + data2 + data3);
  } catch (error) {
    console.log(error);
  }
}

main();
