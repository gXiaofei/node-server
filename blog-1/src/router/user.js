const { login } = require('../controller/user');
const { SuccessModel, ErrorModel } = require('../model/resModel');
const { set } = require('../db/redis')
const handleUserRouter = (req, res) => {
    const method = req.method;

    if (method === 'POST' && req.path === '/api/user/login') {
        const { username, password } = req.body;
        const result = login(username, password);
        return result.then(data => {
            if (data.username){

                // 存储 session 值 由于之前采用了引用类型 这里的值会直接赋值给全局变量 SESSION_DATA
                req.session.username = data.username;
                req.session.realname = data.realname;

                // 设置 session 值到 redis
                set(req.sessionId, req.session)

                return new SuccessModel();
            }
            return new ErrorModel('登录失败');
        })
    }

    // 登录 user 测试

    if(method === 'GET' && req.path === '/api/username/login-test'){
        if(req.session.username){
            return Promise.resolve(new SuccessModel());
        }

        return Promise.resolve(new ErrorModel('尚未登录'));
    }
};

module.exports = handleUserRouter;
