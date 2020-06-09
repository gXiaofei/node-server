// 类似管道
// process.stdin.pipe(process.stdout);

/* const http = require('http')
const server = http.createServer((req, res) => {
    req.pipe(res); // 可以直接输出传入过来的值
})

server.listen(8877); */

/* // 复制文件
const path = require('path');
const fs = require('fs');

const filename = path.resolve(__dirname, 'data.txt');
const filename1 = path.resolve(__dirname, 'data-bak.txt');

// 判断文件是否存在
fs.access(filename, fs.constants.F_OK, (err) => {
    if (err) {
        console.log(err);
        return;
    }
    const readStream = fs.createReadStream(filename);
    const writeStream = fs.createWriteStream(filename1);
    // 1.默认会直接覆盖内容
    // 2. filename1 不存在会自动创建
    readStream.pipe(writeStream);

    readStream.on('end', () => {
        console.log('copy done');
    });
}); */

const path = require('path');
const fs = require('fs');
const http = require('http');
const filename = path.resolve(__dirname, 'data.txt');
const server = http.createServer((req, res) => {
    if (req.method === 'GET') {
        // 读取文件返回
        const readStream = fs.createReadStream(filename);
        readStream.pipe(res);
    }
});

server.listen(8877);
