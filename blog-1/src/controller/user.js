const {exec, escape} = require('../db/mysql');
const {genPassword} = require('../utils/cryp')
const xss = require('xss');
const login = (username, password) => {
    // 预防 sql 注入攻击 xss 攻击
    username = xss(escape(username));

    // 生成加密密码
    password = genPassword(password)

    password = xss(escape(password));
    // 这里使用 escape 需要去掉单引号 username='${username}' => username=${username}
    const sql = `
        select username, realname from users where username=${username} and password=${password}
    `
    console.log(sql);
    return exec(sql).then(rows => {
        return rows[0] || {};
    })
};

module.exports = {
    login
}