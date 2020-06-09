const querystring = require('querystring');
const handleBlogRouter = require('./src/router/blog');
const handleUserRouter = require('./src/router/user');
const { set, get } = require('./src/db/redis');
const { access } = require('./src/utils/log')
//session
// const SESSION_DATA = {};

// 获取 cookie 的过期时间
const getCookieExpires = () => {
    const d = new Date();
    d.setTime(d.getTime() + 24 * 60 * 60 * 1000);
    return d.toUTCString();
};

// 处理post data
const getPostData = (req) => {
    const promise = new Promise((resolve, reject) => {
        if (req.method !== 'POST') {
            resolve({});
            return;
        }
        if (req.headers['content-type'] !== 'application/json') {
            resolve({});
            return;
        }

        let postData = '';
        req.on('data', (chunk) => {
            postData += chunk.toString();
        });
        req.on('end', () => {
            if (!postData) {
                resolve({});
                return;
            }
            resolve(JSON.parse(postData));
        });
    });

    return promise;
};

const serverHandle = (req, res) => {

    // 记录日志
    access(`${req.method} -- ${req.url} -- ${req.headers['user-agent']} -- ${Date.now()}`)
    // 设置返回格式
    res.setHeader('Content-Type', 'applocation/json');

    const url = req.url;
    req.path = url.split('?')[0];

    // 解析query
    req.query = querystring.parse(url.split('?')[1]);

    // 解析cookie
    const cookieStr = req.headers.cookie || ''; // 格式是 k1=v1;k2=v2;
    req.cookie = {};
    cookieStr.split(';').forEach((item) => {
        if (!item) {
            return;
        }
        const arr = item.trim().split('=');
        const k = arr[0];
        const v = arr[1];
        req.cookie[k] = v;
    });
    console.log('cookie is :', req.cookie);

    /*   // 解析 session
    let needSetCookie = false;
    let userId = req.cookie.userid;
    if (userId) {
        if (!SESSION_DATA[userId]) {
            SESSION_DATA[userId] = {};
        }
    } else {
        needSetCookie = true;
        userId = `${Date.now()}_${Math.random()}`;
        SESSION_DATA[userId] = {};
    }
    // 这里采用了引用类型的特性
    req.session = SESSION_DATA[userId]; */

    // 采用 redis 存储

    let needSetCookie = false;
    let userId = req.cookie.userid;
    if (!userId) {
        needSetCookie = true;
        userId = `${Date.now()}_${Math.random()}`;
        // 初始化 redis
        set(userId, {});
    }

    req.sessionId = userId;
    get(req.sessionId)
        .then((sessionData) => {
            if (sessionData == null) {
                // 初始化 redis
                set(userId, {});
                // 设置 session
                req.session = {};
            } else {
                // 设置 session
                req.session = sessionData;
            }
            console.log('req.session', req.session);

            // 处理post data
            return getPostData(req);
        })
        .then((postData) => {
            // 把它赋值给req.body 方便后面获取
            req.body = postData;

            // 处理 blog 路由
            /*  const blogData = handleBlogRouter(req, res);
        if (blogData) {
            res.end(JSON.stringify(blogData));
            return;
        } */

            const blogResult = handleBlogRouter(req, res);
            if (blogResult) {
                blogResult.then((blogData) => {
                    if (needSetCookie) {
                        // 操作 cookie
                        res.setHeader(
                            'Set-Cookie',
                            `userid=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`
                        );
                    }

                    res.end(JSON.stringify(blogData));
                });
                return;
            }

            // 处理 user 路由
            // const userData = handleUserRouter(req, res);
            // if (userData) {
            //     res.end(JSON.stringify(userData));
            //     return;
            // }
            const userResult = handleUserRouter(req, res);
            if (userResult) {
                userResult.then((userData) => {
                    if (needSetCookie) {
                        // 操作 cookie
                        res.setHeader(
                            'Set-Cookie',
                            `userid=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`
                        );
                    }
                    res.end(JSON.stringify(userData));
                });
                return;
            }

            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.write('404 not found\n');
            res.end();
        });
};

module.exports = serverHandle;

// process.env.NODE_ENV
