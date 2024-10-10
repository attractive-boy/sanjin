var express = require('express');
var router = express.Router();
const axios = require('axios');
const db = require('../db'); // 引入刚刚创建的 db.js 文件
const qs = require('qs'); 
const jwt = require('jsonwebtoken');
const { promisify } = require('util'); // 引入 util.promisify

// 密钥，存储在环境变量中更加安全
const SECRET_KEY = 'your-secret-key';


const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { log } = require('console');
function login(req, res) {
    const { tel, pwd } = req.body;

    // 假设你有一个用户表，并验证用户的手机号和密码
    const user = findUserByPhoneAndPassword(tel, pwd); // 伪代码
    if (!user) {
        return res.status(401).json({ message: '手机号或密码错误' });
    }

    // 如果验证通过，生成 JWT Token
    const token = jwt.sign(
        {
            id: user.id,
            phone: user.phone,
            role: user.role // 可根据需求存储用户信息
        },
        SECRET_KEY,
        { expiresIn: '1h' } // 设置过期时间，可以调整
    );

    // 返回 token 给客户端
    res.json({ token });
}


// 示例路由：从数据库中获取数据
router.get('/cs', (req, res) => {
  db.query('SELECT * FROM user', (err, results) => {
    if (err) {
      return res.status(500).send('数据库查询失败');
    }
    res.json(results);  // 返回查询结果
  });
});

router.post('/addUser', (req, res) => {
  // 从请求体中获取数据
  const { name, role, idNum, tel } = req.body;
  
  // 检查是否提供了所有必需的字段
  if (!name || !role || !idNum || !tel) {
    return res.status(400).send('缺少必填字段');
  }

  // SQL 插入语句
  const sql = 'INSERT INTO users (name, role, idNum, tel) VALUES (?, ?, ?, ?)';

  // 执行插入操作
  db.query(sql, [name, role, idNum, tel], (err, result) => {
    if (err) {
      return res.status(500).send('数据库插入失败');
    }
    res.json({ message: '用户添加成功', userId: result.insertId }); // 返回插入成功的用户ID
  });
});

router.post('/loginByPwd', (req, res) => {
  const { tel, pwd } = req.body;

  // 检查是否提供了手机号和密码
  if (!tel || !pwd) {
    return res.status(400).send('缺少手机号或密码');
  }
const password=pwd
  // SQL 查询语句，检查手机号和密码是否匹配
  const sql = 'SELECT * FROM users WHERE tel = ? AND password = ?';

  // 执行查询
  db.query(sql, [tel, pwd], (err, results) => {
    if (err) {
      return res.status(500).send('数据库查询失败');
    }

    // 检查是否找到匹配的用户
    if (results.length > 0) {
      const user = results[0];

      // 签发 JWT Token
      const token = jwt.sign(
        {
          id: user.id,  // 假设用户表有 id 字段
          tel: user.tel, // 将用户信息放入 token 中
          role: user.role, // 如果有角色信息，可以一起签发
          name: user.username // 如果有角色信息，可以一起签发
          
        },
        SECRET_KEY, // 用于签发 token 的密钥
        { expiresIn: '1h' } // 设置 token 过期时间为 1 小时
      );

      // 返回 token 和用户信息
      res.json({
        message: '登录成功',
        token: token, // 返回生成的 token
        user: {
          id: user.id,
          tel: user.tel,
          role: user.role,
          idNum:user.idNum,
          userName:user.username
        }
      });
    } else {
      res.status(401).send('手机号或密码错误');
    }
  });
});


router.get('/products', (req, res) => {
  // 查询时不选择 picUrl 字段
  db.query('SELECT * FROM products', (err, results) => {
    if (err) {
      return res.status(500).send('数据库查询失败');
    }
    res.json(results);  // 返回查询结果，不包含 picUrl
  });
});

router.get('/getAllProductImages', (req, res) => {
  // 查询数据库获取所有产品的图片路径、名称和 id
  const query = 'SELECT id, name, picUrl FROM products';
  db.query(query, (err, results) => {
    if (err) {
      console.error('数据库查询失败:', err);
      return res.status(500).send('数据库查询失败');
    }

    if (results.length === 0) {
      return res.status(404).send('没有找到产品');
    }

    const images = [];

    results.forEach(result => {
      const productId = result.id;       // 获取产品 id
      const productName = result.name;   // 获取产品名称
      const picDir = path.join(__dirname, `../public/images/${productName}`);  // 主图片路径

      const imageObj = {
        id: productId,
        base64Image: [],  // 主图片的 base64 数组
        desPics: []       // 描述图片的 base64 数组
      };

      // 检查主图片目录是否存在
      if (fs.existsSync(picDir)) {
        // 读取主图片目录下的所有文件
        const files = fs.readdirSync(picDir);
        files.forEach(file => {
          const imagePath = path.join(picDir, file);
          try {
            if (fs.statSync(imagePath).isFile()) {
              const imageBuffer = fs.readFileSync(imagePath);
              const base64Image = imageBuffer.toString('base64');
              imageObj.base64Image.push('data:image/png;base64,'+base64Image); // 将主图片的 base64 添加到数组
            } else {
              console.warn(`跳过非文件: ${imagePath}`);
            }
          } catch (error) {
            console.error(`读取图片文件时发生错误: ${imagePath}`, error);
          }
        });
      } else {
        console.warn(`主图片目录未找到: ${picDir}`);
      }

      // 检查是否存在 desPics 文件夹
      const desPicsDir = path.join(picDir, 'desPics');
      if (fs.existsSync(desPicsDir)) {
        // 读取 desPics 目录下的所有文件
        const desPicsFiles = fs.readdirSync(desPicsDir);
        desPicsFiles.forEach(file => {
          const desImagePath = path.join(desPicsDir, file);
          try {
            if (fs.statSync(desImagePath).isFile()) {
              const desImageBuffer = fs.readFileSync(desImagePath);
              const desBase64Image = desImageBuffer.toString('base64');
              imageObj.desPics.push('data:image/png;base64,'+desBase64Image); // 将描述图片的 base64 添加到数组
            } else {
              console.warn(`跳过非文件: ${desImagePath}`);
            }
          } catch (error) {
            console.error(`读取描述图片文件时发生错误: ${desImagePath}`, error);
          }
        });
      } else {
        console.warn(`描述图片目录未找到: ${desPicsDir}`);
      }

      images.push(imageObj);
    });

    if (images.length === 0) {
      return res.status(404).send('没有找到任何图片');
    }

    // 返回所有图片的 Base64 编码
    res.json({ images });
  });
});


router.get('/getOneImage', (req, res) => {
  const { id } = req.query;

  // 查询数据库，获取产品的名称
  const query = 'SELECT name FROM products WHERE id = ?';
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('数据库查询失败:', err);
      return res.status(500).send('数据库查询失败');
    }

    if (results.length === 0) {
      return res.status(404).send('产品未找到');
    }

    const productName = results[0].name;
    const picDir = path.join(__dirname, `../public/images/${productName}`);
    const desPicsDir = path.join(picDir, 'desPics');

    // 获取主图目录下的第一个 .png 文件
    fs.readdir(picDir, (err, files) => {
      if (err) {
        console.error('读取主图目录失败:', err);
        return res.status(500).send('读取主图目录失败');
      }

      const pngFiles = files.filter(file => path.extname(file).toLowerCase() === '.png');
      let base64Image = null;

      if (pngFiles.length > 0) {
        const firstPngImagePath = path.join(picDir, pngFiles[0]);
        if (fs.existsSync(firstPngImagePath)) {
          const imageBuffer = fs.readFileSync(firstPngImagePath);
          base64Image = 'data:image/png;base64,' + imageBuffer.toString('base64');
        }
      }

      // 获取 desPics 目录下的所有 .png 文件
      fs.readdir(desPicsDir, (err, desPicsFiles) => {
        if (err) {
          console.error('读取desPics目录失败:', err);
          return res.status(500).send('读取desPics目录失败');
        }

        const desPicsPngFiles = desPicsFiles.filter(file => path.extname(file).toLowerCase() === '.png');
        const desPicsBase64Images = [];

        desPicsPngFiles.forEach((file) => {
          const desPicImagePath = path.join(desPicsDir, file);
          if (fs.existsSync(desPicImagePath)) {
            const imageBuffer = fs.readFileSync(desPicImagePath);
            desPicsBase64Images.push('data:image/png;base64,' + imageBuffer.toString('base64'));
          }
        });

        // 返回主图和描述图片的 Base64 编码数据
        res.json({
          base64Image, // 主图
          desPicsBase64Images // 描述图片数组
        });
      });
    });
  });
});

// router.get('/getOneProduct', (req, res) => {
//   const productId = req.query.id;  // 获取请求中的产品ID
  
//   if (!productId) {
//     return res.status(400).send('缺少产品ID');
//   }

//   // 使用参数化查询，防止 SQL 注入
//   db.query('SELECT * FROM products WHERE id = ?', [productId], (err, results) => {
//     if (err) {
//       return res.status(500).send('数据库查询失败');
//     }
    
//     if (results.length === 0) {
//       return res.status(404).send('未找到该产品');
//     }

//     // 过滤掉 picUrl 字段（如果有需要的话）
//     const { picUrl, ...productData } = results[0];

//     // 返回查询结果，不包含 picUrl
//     res.json(productData);
//   });
// });
router.get('/getOneProduct', async (req, res) => {
  const { productId } = req.query;

  try {
const query = promisify(db.query).bind(db); 
const readFile = promisify(fs.readFile); // 将 fs.readFile 转换为 Promise 风格
    // 查询产品基本信息
    
    const productResult = await query('SELECT * FROM products WHERE id = ?', [productId]);
    const product = productResult[0]; // 假设只返回一条产品数据

    if (!product) {
      return res.status(404).json({ message: '未找到产品' });
    }

    const picPath = product.picPath;
    const nanoid = product.nanoid; // 获取产品的 nanoid

    // 查询产品描述图片
    const desPicResult = await query('SELECT desPicPath FROM product_des_images WHERE productId = ?', [productId]);

    // 读取 headPic 图片并转换为 Base64
    const headPicFilePath = path.join(__dirname, `${picPath}`);
    const headPicBase64 = await readFile(headPicFilePath, { encoding: 'base64' });
    const headPicUrl = `data:image/png;base64,${headPicBase64}`; // 拼接成 Base64 图片 URL

    // 读取 desPics 图片并转换为 Base64
    const desPicUrls = [];
    for (const desPic of desPicResult) {
      const desPicFilePath = path.join(__dirname, `${desPic.desPicPath}`);
      const desPicBase64 = await readFile(desPicFilePath, { encoding: 'base64' });
      desPicUrls.push(`data:image/png;base64,${desPicBase64}`);
    }

    // 返回产品数据和图片的 Base64 URL
    res.status(200).json({
      product: {
        id: product.id,
        name: product.name,
        limitTime: product.limitTime,
        reward: product.reward,
        description: product.description,
        special: product.special,
        picPath: headPicUrl, // 返回 headPic 的 Base64 URL
        desPicPaths: desPicUrls // 返回 desPics 的 Base64 URL
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '服务器错误' });
  }
});

router.post('/addViewRecord', (req, res) => {
  const { userId, productId } = req.body;

  // 验证请求数据是否存在
  if (!userId || !productId) {
      return res.status(400).json({ message: 'userId 和 productId 是必填项' });
  }

  // 生成当前时间
  const viewTime = new Date();

  // 插入浏览记录到数据库
  const sql = 'INSERT INTO product_views (user_id, product_id, view_time) VALUES (?, ?, ?)';
  db.query(sql, [userId, productId, viewTime], (err, result) => {
      if (err) {
          return res.status(500).json({ message: '插入浏览记录失败', error: err });
      }
      res.status(200).json({ message: '浏览记录添加成功', data: result });
  });
});


router.get('/getAllProducts', async (req, res) => {
  try {
    const query = promisify(db.query).bind(db);
    const readFile = promisify(fs.readFile);
    
    // 查询所有产品
    const products = await query('SELECT * FROM products');

    if (!products.length) {
      return res.status(404).json({ message: '未找到产品' });
    }

    // 存储所有产品及其图片的数组
    const productsWithImages = [];

    // 遍历每个产品
    for (const product of products) {
      const picPath = product.picPath;
      const desPicMap = {}; // 使用对象存储 desPicId 对应的 URL
      const headPicFilePath = path.join(__dirname, `${picPath}`);
      let headPicUrl = null;

      // 查询产品描述图片
      const desPicResult = await query('SELECT desPicPath, id FROM product_des_images WHERE productId = ?', [product.id]);

      // 读取 headPic 图片并转换为 Base64
      try {
        const headPicBase64 = await readFile(headPicFilePath, { encoding: 'base64' });
        headPicUrl = `data:image/png;base64,${headPicBase64}`;
      } catch (err) {
        console.error(`无法读取文件 ${headPicFilePath}:`, err);
      }

      // 读取 desPics 图片并转换为 Base64
      for (const desPic of desPicResult) {
        const desPicFilePath = path.join(__dirname, `${desPic.desPicPath}`);
        try {
          const desPicBase64 = await readFile(desPicFilePath, { encoding: 'base64' });
          desPicMap[desPic.id] = `data:image/png;base64,${desPicBase64}`; // 将 ID 作为键名
        } catch (err) {
          console.error(`无法读取文件 ${desPicFilePath}:`, err);
        }
      }

      // 将产品信息和图片 URL 添加到数组中，包括 nanoid
      productsWithImages.push({
        id: product.id,
        name: product.name,
        limitTime: product.limitTime,
        reward: product.reward,
        description: product.description,
        special: product.special,
        nanoid: product.nanoid, // 将 nanoid 添加到返回的数据中
        picPath: headPicUrl, // 返回 headPic 的 Base64 URL
        desPicPaths: desPicMap // 使用对象存储 desPicId 对应的 URL
      });
    }

    // 返回所有产品及其对应图片
    res.status(200).json(productsWithImages);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '服务器错误' });
  }
});

router.post('/addOrder', (req, res) => {
  const { userId, productId } = req.body;

  // 校验必要的请求参数
  if (!userId || !productId) {
    return res.status(400).json({ message: '缺少必要参数 (userId 或 productId)' });
  }

  // 查询产品的价格
  const productQuery = 'SELECT reward FROM products WHERE id = ?';
  db.query(productQuery, [productId], (err, productResults) => {
    if (err) {
      console.error('数据库错误: ', err);
      return res.status(500).json({ message: '查询产品信息时发生错误' });
    }

    if (productResults.length === 0) {
      return res.status(404).json({ message: '未找到对应的产品' });
    }

    // 计算总价格，默认为 1 件产品
    const productPrice = productResults[0].reward;
    const totalPrice = productPrice * 1; // 数量为1

    // 插入订单的 SQL 语句
    const orderQuery = `INSERT INTO orders (user_id, product_id, quantity, total_price)
                        VALUES (?, ?, ?, ?)`;
    
    // 执行插入操作，数量默认为 1
    db.query(orderQuery, [userId, productId, 1, totalPrice], (err, orderResult) => {
      if (err) {
        console.error('数据库错误: ', err);
        return res.status(500).json({ message: '订单插入失败' });
      }

      res.status(201).json({
        message: '订单插入成功',
        orderId: orderResult.insertId, // 返回插入的订单ID
        totalPrice: totalPrice         // 返回总价格
      });
    });
  });
});


// 发送验证码的路由

// 发送验证码的路由
// 发送验证码的路由
router.post('/sendCode', async (req, res) => {
  const { phone_number } = req.body; // 从请求体获取手机号

  // 查找用户ID
  const userQuery = 'SELECT id FROM users WHERE tel = ? AND role = ?';
  db.query(userQuery, [phone_number, 'user'], async (err, results) => {
      if (err) {
          return res.status(500).json({ message: '数据库查询失败', error: err });
      }

      if (results.length === 0) {
          return res.status(404).json({ message: '用户不存在或角色不匹配' });
      }

      const userId = results[0].id; // 获取用户ID
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
      const template_id = 'CST_11253'; // 短信模板ID
      const content = `code:${verificationCode}`; // 使用生成的验证码
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5分钟后过期

      try {
          // 调用第三方短信发送API
          const response = await axios.post(
              'https://wwsms.market.alicloudapi.com/send_sms',
              qs.stringify({
                  content,
                  template_id,
                  phone_number,
              }),
              {
                  headers: {
                      'Authorization': 'APPCODE ad81c7ce31b44f5781f6b3d84b8449a8',
                      'Content-Type': 'application/x-www-form-urlencoded',
                  }
              }
          );

          console.log(response.data, 'response data'); // 打印响应数据

          if (response.data && response.data.status=='OK') {
              // 将验证码存入数据库
              const insertQuery = 'INSERT INTO code (user_id, verification_code, expires_at) VALUES (?, ?, ?)';
              db.query(insertQuery, [userId, verificationCode, expiresAt], (error) => {
                  if (error) {
                      console.error('插入验证码失败:', error);
                      return res.status(500).json({ message: '发送成功，但存储验证码失败' });
                  }
                  res.status(200).json({ message: '验证码发送成功' });
              });
          } else {
              res.status(500).json({ message: '短信发送失败', error: response.data });
          }
      } catch (error) {
          console.error('请求错误:', error);
          res.status(500).json({ message: '发送失败', error: error.message });
      }
  });
});
const JWT_SECRET = 'your_jwt_secret';
// 验证验证码的路由
router.post('/verifyCode', (req, res) => {
  const { phone_number, input_code } = req.body; // 从请求的查询参数中获取手机号和输入的验证码

  // 查找用户ID
  const userQuery = 'SELECT id, tel, role, username FROM users WHERE tel = ? AND role = ?';
  db.query(userQuery, [phone_number, 'user'], (err, results) => {
      if (err) {
          return res.status(500).json({ message: '数据库查询失败', error: err });
      }

      if (results.length === 0) {
          return res.status(404).json({ message: '用户不存在或角色不匹配' });
      }

      const user = results[0]; // 获取用户信息

      // 查找验证码
      const codeQuery = 'SELECT * FROM code WHERE user_id = ? ORDER BY created_at DESC LIMIT 1';
      db.query(codeQuery, [user.id], (error, codeResults) => {
          if (error) {
              return res.status(500).json({ message: '验证码查询失败', error });
          }

          if (codeResults.length === 0) {
              return res.status(400).json({ message: '没有找到验证码' });
          }

          const codeEntry = codeResults[0];

          // 检查验证码是否匹配和是否过期
          if (input_code === codeEntry.verification_code) {
              if (new Date() < new Date(codeEntry.expires_at)) {
                  // 生成 token，包含用户信息
                  const token = jwt.sign({
                      id: user.id,
                      tel: user.tel,
                      role: user.role,
                      name: user.username,
                  }, JWT_SECRET, { expiresIn: '1h' }); // 1小时过期

                  res.status(200).json({ message: '验证码验证成功', token });
              } else {
                  res.status(400).json({ message: '验证码已过期' });
              }
          } else {
              res.status(400).json({ message: '验证码不匹配' });
          }
      });
  });
});

// 注册功能 - 发送验证码
// router.post('/registerBySendCode', async (req, res) => {
//   const { phone_number } = req.body; // 从请求体获取手机号

//   // 查找用户ID
//   const userQuery = 'SELECT id FROM users WHERE tel = ? AND role = ?';
  
//   try {
//       const [results] = await db.promise().query(userQuery, [phone_number, 'user']);

//       if (results.length === 0) {
//           return res.status(404).json({ message: '用户不存在或角色不匹配' });
//       }

//       const userId = results[0].id; // 获取用户ID
//       const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
//       const template_id = 'CST_11253'; // 短信模板ID
//       const content = `code:${verificationCode}`; // 使用生成的验证码
//       const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5分钟后过期

//       // 调用第三方短信发送API
//       const response = await axios.post(
//           'https://wwsms.market.alicloudapi.com/send_sms',
//           qs.stringify({
//               content,
//               template_id,
//               phone_number,
//           }),
//           {
//               headers: {
//                   'Authorization': 'APPCODE ad81c7ce31b44f5781f6b3d84b8449a8',
//                   'Content-Type': 'application/x-www-form-urlencoded',
//               }
//           }
//       );

//       console.log(response.data, 'response data'); // 打印响应数据

//       if (response.data && response.data.status == 'OK') {
//           // 将验证码存入数据库
//           const insertQuery = 'INSERT INTO code (user_id, verification_code, expires_at) VALUES (?, ?, ?)';
//           await db.promise().query(insertQuery, [userId, verificationCode, expiresAt]);
//           res.status(200).json({ message: '验证码发送成功' });
//       } else {
//           res.status(500).json({ message: '短信发送失败', error: response.data });
//       }
//   } catch (error) {
//       console.error('请求错误:', error);
//       res.status(500).json({ message: '发送失败', error: error.message });
//   }
// });

// // 验证验证码并注册用户
// router.post('/register', async (req, res) => {
//   const { phone_number, verification_code, username, password } = req.body; // 从请求体获取参数

//   // 验证输入
//   if (!phone_number || !verification_code || !username || !password) {
//       return res.status(400).json({ message: '缺少必要参数' });
//   }

//   try {
//       // 验证验证码
//       const verifyQuery = 'SELECT * FROM code WHERE user_id = (SELECT id FROM users WHERE tel = ? AND role = ?) AND verification_code = ? AND expires_at > NOW()';
//       const [verificationResults] = await db.promise().query(verifyQuery, [phone_number, 'user', verification_code]);

//       if (verificationResults.length === 0) {
//           return res.status(400).json({ message: '验证码无效或已过期' });
//       }

//       // 在此处可以删除已使用的验证码
//       const deleteCodeQuery = 'DELETE FROM code WHERE id = ?'; // 假设有 id 字段
//       await db.promise().query(deleteCodeQuery, [verificationResults[0].id]);

//       // 插入新用户
//       const insertUserQuery = 'INSERT INTO users (tel, username, password, role) VALUES (?, ?, ?, ?)';
//       const [result] = await db.promise().query(insertUserQuery, [phone_number, username, password, 'user']);

//       // 生成JWT
//       const token = jwt.sign({ id: result.insertId, tel: phone_number, role: 'user', name: username }, 'your_jwt_secret', { expiresIn: '1h' });

//       res.status(201).json({ message: '用户注册成功', token });
//   } catch (error) {
//       console.error('注册失败:', error);
//       res.status(500).json({ message: '注册失败', error: error.message });
//   }
// });
// GET 接口，根据 userId 查询账户信息
router.get('/get-account', (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ message: 'userId 是必填项' });
  }

  // 查询 users 表以获取 account
  const query = 'SELECT account FROM users WHERE id = ?';
  
  db.query(query, [userId], (error, results) => {
    if (error) {
      return res.status(500).json({ message: '数据库错误', error });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: '未找到该用户' });
    }

    res.status(200).json({
      message: '查询成功',
      account: results[0].account // 返回 account
    });
  });
});

// POST 接口，新增 cashApply 记录
router.post('/add-cash-apply', (req, res) => {
  const { userId, count } = req.body;

  // 参数验证
  if (!userId || !count) {
    return res.status(400).json({ message: 'userId 和 count 是必填项' });
  }

  // 查询用户的账户余额
  const queryUser = 'SELECT account FROM users WHERE id = ?';

  db.query(queryUser, [userId], (error, results) => {
    if (error) {
      return res.status(500).json({ message: '数据库错误', error });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: '用户未找到' });
    }

    const account = results[0].account;

    // 检查申请金额是否超过账户余额
    if (count > account) {
      return res.status(400).json({ message: '申请金额不能超过账户余额' });
    }

    // 插入数据到 cashApplies 表
    const insertQuery = 'INSERT INTO cashApplies (user_id, count) VALUES (?, ?)';
    
    db.query(insertQuery, [userId, count], (insertError, insertResults) => {
      if (insertError) {
        return res.status(500).json({ message: '数据库错误', error: insertError });
      }

      // 返回成功响应
      res.status(201).json({
        message: '申请成功',
        cashApplyId: insertResults.insertId // 返回新增记录的 ID
      });
    });
  });
});

module.exports = router;
