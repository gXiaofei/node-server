const {exec} = require('../db/mysql');

// 获取列表
const getList = (author, keyword) => {
    // where 1=1 方便后面拼接
    let sql = `select * from blogs where 1=1 `;
    if(author){
        sql += `and author='${author}' `;
    }
    if(keyword){
        sql += `and title like '%${keyword}%' `;
    }
    sql += `order by createtime desc;`;

    // 返回promise
    return exec(sql);
}
// 获取详情
const getDetail = (id) => {
    const sql = `select * from blogs where id='${id}'`;
    return exec(sql).then(rows => {
        return rows[0]
    })
}
// 新建博客
const newBlog = (blogData = {}) => {

    const {title, content, author} = blogData;
    const createTime = Date.now();
    const sql = `
        insert into blogs(title, content, createtime, author) values ('${title}', '${content}', ${createTime}, '${author}');
    `
    return exec(sql).then(insertData => {
        return {
            id: insertData.insertId
        }
    })
}
// 更新博客
const updateBlog = (id, blogData = {}) => {
    const {title, content} = blogData;
    const sql = `
        update blogs set title='${title}', content='${content}' where id=${id}
    `
    return exec(sql).then(updateData => {
        if(updateData.affectedRows > 0){
            return true;
        }
        return false;
    })
}
// 删除博客
const delBlog = (id, author) => {

    const sql = `
        delete from blogs where id=${id} and author='${author}'
    `
    return exec(sql).then(delData => {
        if(delData.affectedRows > 0){
            return true;
        }
        return false;
    });
}

module.exports = {
    getList,
    getDetail,
    newBlog,
    updateBlog,
    delBlog
}