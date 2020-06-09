const crypto = require('crypto')

const SRYPTO_KEY = 'qw_123Q!'

// md5 加密
function md5 (content) {
    let md5 = crypto.createHash('md5')
    // 转成 16 进制
    return md5.update(content).digest('hex')
}

// 加密函数
function genPassword(password) {
    const str = `password=${password}&key=${SRYPTO_KEY}`
    return md5(str)
}

module.exports = {
    genPassword
}
