const redis = require('redis');
const { REDIS_CONF } = require('../conf/db');

// 创建客户端
const redisClient = redis.createClient(REDIS_CONF.port, REDIS_CONF.host);
redisClient.on('error', (err) => {
    console.error(err);
});

function set(key, val, timeout = 60 * 60) {
    if (typeof val === 'object') {
        val = JSON.stringify(val);
    }
    redisClient.set(key, val, redis.print);
    // 到期时间
    redisClient.expire(key, timeout);
}

function get(key) {
    const promise = new Promise((resolve, reject) => {
        redisClient.get(key, (err, val) => {
            if (err) {
                reject(err);
                return;
            }
            if (val == null) {
                resolve(null);
                return;
            }

            try {
                // 可能是对象
                resolve(JSON.parse(val));
            } catch (ex) {
                resolve(val);
            }
            // exit;  单例 这里就不退出了
            // redisClient.quit();
        });
    });
    return promise;
}

module.exports = {
    set,
    get,
};
