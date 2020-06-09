const fs = require('fs')
const path = require('path')

const filename = path.resolve(__dirname, 'data.txt')

// 读取文件
// fs.readFile(filename, (err, data) => {
//     if(err){
//         console.error(err)
//         return
//     }
//     // data 为二进制，转换成 string
//     console.log(data.toString())
// })

// 写入文件

const opt = {
    flag: 'a'
}
const content = 'write\n'
fs.writeFile(filename, content, opt, (err) => {
    if(err) {
        console.error(err)
    }
})