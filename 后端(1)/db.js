// db.js
const mysql = require('mysql2');

// 创建一个单一的数据库连接
const connection = mysql.createConnection({
  host: 'localhost',     // MySQL 主机地址
  user: 'root',          // MySQL 用户名
  password: 'root',  // MySQL 密码
  database: 'sanjin'   // MySQL 数据库名
});

// 连接到数据库
connection.connect((err) => {
  if (err) {
    console.error('数据库连接失败: ' + err.stack);
    return;
  }
  console.log('已成功连接到数据库，连接 ID 为: ' + connection.threadId);
});

module.exports = connection;
