var express = require('express');
var router = express.Router();

const db = require('../db'); // 引入刚刚创建的 db.js 文件
const { promisify } = require('util'); // 引入 util.promisify
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
// const nanoid = require('nanoid');
const { nanoid } = require('nanoid');
const mysql = require('mysql2/promise');
const fs = require('fs');
const { log } = require('console');

// 密钥，存储在环境变量中更加安全
const SECRET_KEY = 'your-secret-key';
router.post('/loginAdmin', (req, res) => {
    // 从请求体中获取数据
    const { username, password } = req.body;
    
    // 检查是否提供了所有必需的字段
    if (!username || !password) {
      return res.status(400).send('缺少必填字段');
    }
  
    // SQL 查询语句
    const sql = 'SELECT * FROM users WHERE username = ? AND password = ?';
    
    // 执行查询操作
    db.query(sql, [username, password], (err, results) => {
      if (err) {
        return res.status(500).send('数据库查询失败');
      }
      
      if (results.length === 0) {
        return res.status(401).send('用户名或密码错误');
      }
  
      // 用户验证成功，生成 token
      const user = results[0];
      const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });
  
      // 返回成功响应和 token
      res.json({ message: '登录成功', token });
    });
  });

  // 获取所有 products 数据
  router.get('/products', (req, res) => {
    // 查询时不选择 picUrl 字段
    db.query('SELECT * FROM products', (err, results) => {
      if (err) {
        return res.status(500).send('数据库查询失败');
      }
      res.json(results);  // 返回查询结果，不包含 picUrl
    });
  });
  

// 配置 multer 存储
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const nanoidValue = req.body.nanoid;
    const folderPath = path.join(__dirname, `../public/images/${nanoidValue}`);

    // 确保文件夹存在，如果不存在则创建
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    cb(null, folderPath);
  },
  filename: (req, file, cb) => {
    let filename;

    if (file.fieldname === 'headPic') {
      // 使用时间戳和随机字符串作为文件名，确保文件名唯一
      filename = `head_${Date.now()}_${nanoid()}.png`;
    } else if (file.fieldname === 'desPics') {
      // 使用时间戳和随机字符串作为文件名，确保文件名唯一
      filename = `des_${Date.now()}_${nanoid()}.png`;
    }

    cb(null, filename);
  }
});

const upload = multer({ storage });

// // 上传图片并保存产品信息的接口，支持主图和多张描述图片上传
// router.post('/addProduct', upload.fields([{ name: 'headPic', maxCount: 1 }, { name: 'desPics', maxCount: 10 }]), async (req, res) => {
//   // 如果 db.query 不支持 Promise，将其封装为 Promise
// const query = promisify(db.query).bind(db); 
//   const { name, limitTime, reward, description, special, nanoid } = req.body;
//   const folderPath = path.join(__dirname, `../public/images/${nanoid}`);

//   try {
//     // 插入产品数据到 products 表
//     const productResult = await query(
//       'INSERT INTO products (name, limitTime, reward, description, special, nanoid) VALUES (?, ?, ?, ?, ?, ?)',
//       [name, limitTime, reward, description, special, nanoid]
//     );
//     const productId = productResult.insertId; // 获取插入的产品ID

//     // 查找文件夹中的 headPic 和 desPics 文件
//     const files = fs.readdirSync(folderPath);

//     // 处理 headPic 文件
//     const headPicFile = files.find(file => file.startsWith('head_'));
//     if (headPicFile) {
//       const headPicPath = `../public/images/${nanoid}/${headPicFile}`;
//       // 更新 products 表的 picPath 字段
//       await query('UPDATE products SET picPath = ? WHERE id = ?', [headPicPath, productId]);
//     }

//     // 处理 desPics 文件
//     const desPicFiles = files.filter(file => file.startsWith('des_'));
//     if (desPicFiles.length > 0) {
//       const desPicPaths = desPicFiles.map(file => `../public/images/${nanoid}/${file}`);
//       // 插入到 product_des_images 表
//       for (const desPicPath of desPicPaths) {
//         await query('INSERT INTO product_des_images (productId, desPicPath) VALUES (?, ?)', [productId, desPicPath]);
//       }
//     }

//     res.status(200).json({ message: '产品和图片上传成功' });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: '服务器错误' });
//   }
// });
router.post('/addProduct', upload.fields([{ name: 'headPic', maxCount: 1 }, { name: 'desPics', maxCount: 10 }]), async (req, res) => {
  // 如果 db.query 不支持 Promise，将其封装为 Promise
  const query = promisify(db.query).bind(db); 
  const { name, limitTime, reward, description, special, nanoid, start_time, end_time } = req.body; // 获取新的字段
  const folderPath = path.join(__dirname, `../public/images/${nanoid}`);

  try {
    // 插入产品数据到 products 表
    const productResult = await query(
      'INSERT INTO products (name, limitTime, reward, description, special, nanoid, start_time, end_time) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [name, limitTime, reward, description, special, nanoid, start_time, end_time] // 将新字段添加到插入查询
    );
    const productId = productResult.insertId; // 获取插入的产品ID

    // 查找文件夹中的 headPic 和 desPics 文件
    const files = fs.readdirSync(folderPath);

    // 处理 headPic 文件
    const headPicFile = files.find(file => file.startsWith('head_'));
    if (headPicFile) {
      const headPicPath = `../public/images/${nanoid}/${headPicFile}`;
      // 更新 products 表的 picPath 字段
      await query('UPDATE products SET picPath = ? WHERE id = ?', [headPicPath, productId]);
    }

    // 处理 desPics 文件
    const desPicFiles = files.filter(file => file.startsWith('des_'));
    if (desPicFiles.length > 0) {
      const desPicPaths = desPicFiles.map(file => `../public/images/${nanoid}/${file}`);
      // 插入到 product_des_images 表
      for (const desPicPath of desPicPaths) {
        await query('INSERT INTO product_des_images (productId, desPicPath) VALUES (?, ?)', [productId, desPicPath]);
      }
    }

    res.status(200).json({ message: '产品和图片上传成功' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '服务器错误' });
  }
});



const editStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    // 判断是上传的 pic 还是 desPics
    console.log(file,'rileeeeeeeeeeeeeeeeeeeeeeeeeeee');
    const nanoid=req.body.nanoid
    // pic 存在 `../public/images/${name}` 下
    const folderPath = path.join(__dirname, `../public/images/${nanoid}`);
    
    // 确保文件夹存在，如果不存在则创建
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    } else {
    }

    cb(null, folderPath);
  },
  filename: (req, file, cb) => {
    const nanoid = req.body.nanoid;
    const folderPath = path.join(__dirname, `../public/images/${nanoid}`);
  
    
  
    let filename;
  
    if (file.fieldname === 'headPic') {
      // 使用时间戳和原始文件名的一部分作为文件名，确保文件名唯一
      filename = `head_${Date.now()}.png`;
      // 删除所有以 head_ 开头的文件
      fs.readdirSync(folderPath).forEach(file => {
        if (file.startsWith('head_')) {
          fs.unlinkSync(path.join(folderPath, file)); // 删除文件
        }
      });
      console.log(filename);
  
    } else if (file.fieldname === 'desPics') {
      // 使用时间戳和原始文件名的一部分作为文件名，确保文件名唯一
      filename = `des_${Date.now()}.png`;
      console.log(filename);
    }
  
    cb(null, filename);
  }
  
});

const editUpload = multer({ storage: editStorage});


router.post('/editProduct', editUpload.fields([{ name: 'headPic', maxCount: 1 }, { name: 'desPics', maxCount: 10 }]), async (req, res) => {
  const productId = req.body.productId;
  const { name, limitTime, reward, description, special, start_time, end_time } = req.body;

  try {
    // 根据 productId 查询 products 表，获取 nanoid
    const productQuery = 'SELECT nanoid FROM products WHERE id = ?';
    const productResults = await query(productQuery, [productId]);

    if (productResults.length === 0) {
      return res.status(404).json({ message: '未找到该产品' });
    }

    const nanoid = productResults[0].nanoid;
    const folderPath = path.join(__dirname, `../public/images/${nanoid}`);

    // 查找文件夹中的 headPic 和 desPics 文件
    const files = fs.readdirSync(folderPath);

    // 处理 headPic 文件
    const headPicFile = files.find(file => file.startsWith('head_'));
    if (headPicFile) {
      const headPicPath = `../public/images/${nanoid}/${headPicFile}`;
      // 更新 products 表的 picPath 字段
      await query('UPDATE products SET picPath = ? WHERE id = ?', [headPicPath, productId]);
    }

    // 删除旧的 desPics 记录
    await query('DELETE FROM product_des_images WHERE productId = ?', [productId]);

    // 处理 desPics 文件
    const desPicFiles = files.filter(file => file.startsWith('des_'));
    if (desPicFiles.length > 0) {
      const desPicPaths = desPicFiles.map(file => `../public/images/${nanoid}/${file}`);
      // 插入新的 desPics 记录
      for (const desPicPath of desPicPaths) {
        await query('INSERT INTO product_des_images (productId, desPicPath) VALUES (?, ?)', [productId, desPicPath]);
      }
    }

    // 更新产品信息，包括新字段
    await query('UPDATE products SET name = ?, limitTime = ?, reward = ?, description = ?, special = ?, start_time = ?, end_time = ? WHERE id = ?',
                [name, limitTime, reward, description, special, start_time, end_time, productId]);

    res.status(200).json({ message: '产品信息更新成功' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '服务器错误' });
  }
});



// 获取所有产品及对应图片的接口
const query = promisify(db.query).bind(db); // 将数据库查询转换为 Promise 风格
const readFile = promisify(fs.readFile); // 将 fs.readFile 转换为 Promise 风格
// router.get('/getAllProducts', async (req, res) => {
//   try {
//     const query = promisify(db.query).bind(db);
//     const readFile = promisify(fs.readFile);
    
//     // 查询所有产品
//     const products = await query('SELECT * FROM products');

//     if (!products.length) {
//       return res.status(404).json({ message: '未找到产品' });
//     }

//     // 存储所有产品及其图片的数组
//     const productsWithImages = [];

//     // 遍历每个产品
//     for (const product of products) {
//       const picPath = product.picPath;
//       const desPicMap = {}; // 使用对象存储 desPicId 对应的 URL
//       const headPicFilePath = path.join(__dirname, `${picPath}`);
//       let headPicUrl = null;

//       // 查询产品描述图片
//       const desPicResult = await query('SELECT desPicPath, id FROM product_des_images WHERE productId = ?', [product.id]);

//       // 读取 headPic 图片并转换为 Base64
//       try {
//         const headPicBase64 = await readFile(headPicFilePath, { encoding: 'base64' });
//         headPicUrl = `data:image/png;base64,${headPicBase64}`;
//       } catch (err) {
//         console.error(`无法读取文件 ${headPicFilePath}:`, err);
//       }

//       // 读取 desPics 图片并转换为 Base64
//       for (const desPic of desPicResult) {
//         const desPicFilePath = path.join(__dirname, `${desPic.desPicPath}`);
//         try {
//           const desPicBase64 = await readFile(desPicFilePath, { encoding: 'base64' });
//           desPicMap[desPic.id] = `data:image/png;base64,${desPicBase64}`; // 将 ID 作为键名
//         } catch (err) {
//           console.error(`无法读取文件 ${desPicFilePath}:`, err);
//         }
//       }

//       // 将产品信息和图片 URL 添加到数组中，包括 nanoid
//       productsWithImages.push({
//         id: product.id,
//         name: product.name,
//         limitTime: product.limitTime,
//         reward: product.reward,
//         description: product.description,
//         special: product.special,
//         nanoid: product.nanoid, // 将 nanoid 添加到返回的数据中
//         picPath: headPicUrl, // 返回 headPic 的 Base64 URL
//         desPicPaths: desPicMap // 使用对象存储 desPicId 对应的 URL
//       });
//     }

//     // 返回所有产品及其对应图片
//     res.status(200).json(productsWithImages);

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: '服务器错误' });
//   }
// });
router.get('/getAllProducts', async (req, res) => {
  try {
    const query = promisify(db.query).bind(db);
    const readFile = promisify(fs.readFile);
    
    // 查询所有产品，包括新字段
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

      // 将产品信息和图片 URL 添加到数组中，包括 nanoid 和时间字段
      productsWithImages.push({
        id: product.id,
        name: product.name,
        limitTime: product.limitTime,
        reward: product.reward,
        description: product.description,
        special: product.special,
        nanoid: product.nanoid, // 将 nanoid 添加到返回的数据中
        picPath: headPicUrl, // 返回 headPic 的 Base64 URL
        desPicPaths: desPicMap, // 使用对象存储 desPicId 对应的 URL
        start_time: product.start_time, // 新增的开始时间
        end_time: product.end_time // 新增的结束时间
      });
    }

    // 返回所有产品及其对应图片
    res.status(200).json(productsWithImages);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '服务器错误' });
  }
});



// router.get('/getOneProduct', async (req, res) => {
//   const { productId } = req.query;

//   try {
// const query = promisify(db.query).bind(db); 
// const readFile = promisify(fs.readFile); // 将 fs.readFile 转换为 Promise 风格
//     // 查询产品基本信息
    
//     const productResult = await query('SELECT * FROM products WHERE id = ?', [productId]);
//     const product = productResult[0]; // 假设只返回一条产品数据

//     if (!product) {
//       return res.status(404).json({ message: '未找到产品' });
//     }

//     const picPath = product.picPath;
//     const nanoid = product.nanoid; // 获取产品的 nanoid

//     // 查询产品描述图片
//     const desPicResult = await query('SELECT desPicPath FROM product_des_images WHERE productId = ?', [productId]);

//     // 读取 headPic 图片并转换为 Base64
//     const headPicFilePath = path.join(__dirname, `${picPath}`);
//     const headPicBase64 = await readFile(headPicFilePath, { encoding: 'base64' });
//     const headPicUrl = `data:image/png;base64,${headPicBase64}`; // 拼接成 Base64 图片 URL

//     // 读取 desPics 图片并转换为 Base64
//     const desPicUrls = [];
//     for (const desPic of desPicResult) {
//       const desPicFilePath = path.join(__dirname, `${desPic.desPicPath}`);
//       const desPicBase64 = await readFile(desPicFilePath, { encoding: 'base64' });
//       desPicUrls.push(`data:image/png;base64,${desPicBase64}`);
//     }

//     // 返回产品数据和图片的 Base64 URL
//     res.status(200).json({
//       product: {
//         id: product.id,
//         name: product.name,
//         limitTime: product.limitTime,
//         reward: product.reward,
//         description: product.description,
//         special: product.special,
//         picPath: headPicUrl, // 返回 headPic 的 Base64 URL
//         desPicPaths: desPicUrls // 返回 desPics 的 Base64 URL
//       }
//     });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: '服务器错误' });
//   }
// });
router.get('/getOneProduct', async (req, res) => {
  const { productId } = req.query;

  try {
    const query = promisify(db.query).bind(db); 
    const readFile = promisify(fs.readFile); // 将 fs.readFile 转换为 Promise 风格

    // 查询产品基本信息，包括新字段
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

    // 返回产品数据和图片的 Base64 URL，包括新字段
    res.status(200).json({
      product: {
        id: product.id,
        name: product.name,
        limitTime: product.limitTime,
        reward: product.reward,
        description: product.description,
        special: product.special,
        start_time: product.start_time, // 新增的开始时间
        end_time: product.end_time, // 新增的结束时间
        picPath: headPicUrl, // 返回 headPic 的 Base64 URL
        desPicPaths: desPicUrls // 返回 desPics 的 Base64 URL
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '服务器错误' });
  }
});



// 删除产品和第一张图片的接口
router.get('/deleteOneProduct', (req, res) => {
  const productId = req.query.id;

  // 查询数据库获取指定产品的 picUrl
  const query = 'SELECT picUrl FROM products WHERE id = ?';
  db.query(query, [productId], (err, results) => {
    if (err) {
      console.error('数据库查询失败:', err);
      return res.status(500).send('数据库查询失败');
    }

    if (results.length === 0) {
      return res.status(404).send('未找到该产品');
    }

    const picDir = results[0].picUrl; // 获取图片目录路径

    // 检查图片目录是否存在
    if (fs.existsSync(picDir)) {
      // 读取目录下的所有文件
      const files = fs.readdirSync(picDir);

      if (files.length > 0) {
        
        const firstImage = files[0]; // 选择第一张图片
        
        const imagePath = path.join(picDir, firstImage);
        // 打印文件名和路径以确认问题
        console.log('Files:', files);  // 打印所有文件名
        console.log('First image filename:', firstImage); // 打印第一个文件名

        
        // 删除第一张图片
        fs.unlink(imagePath, (err) => {
          if (err) {
            console.error('图片删除失败:', err);
            return res.status(500).send('图片删除失败');
          }

          console.log(`已删除图片: ${imagePath}`);

          // 从数据库中删除该产品
          const deleteQuery = 'DELETE FROM products WHERE id = ?';
          db.query(deleteQuery, [productId], (err, result) => {
            if (err) {
              console.error('数据库删除失败:', err);
              return res.status(500).send('数据库删除失败');
            }

            res.send({ message: '产品和图片删除成功' });
          });
        });
      } else {
        // 没有图片时直接删除产品数据
        const deleteQuery = 'DELETE FROM products WHERE id = ?';
        db.query(deleteQuery, [productId], (err, result) => {
          if (err) {
            console.error('数据库删除失败:', err);
            return res.status(500).send('数据库删除失败');
          }

          res.send({ message: '产品删除成功（无图片）' });
        });
      }
    } else {
      console.warn('图片目录不存在:', picDir);

      // 图片目录不存在时直接删除产品数据
      const deleteQuery = 'DELETE FROM products WHERE id = ?';
      db.query(deleteQuery, [productId], (err, result) => {
        if (err) {
          console.error('数据库删除失败:', err);
          return res.status(500).send('数据库删除失败');
        }

        res.send({ message: '产品删除成功（无图片目录）' });
      });
    }
  });
});


// 删除产品及其对应图片的接口
router.get('/deleteProduct', async (req, res) => {
  const query = promisify(db.query).bind(db); // 将数据库查询转换为 Promise 风格
const unlink = promisify(fs.unlink); // 将 fs.unlink 转换为 Promise 风格
const rmdir = promisify(fs.rmdir); // 将 fs.rmdir 转换为 Promise 风格
  const { id } = req.query;

  try {
    // 查询产品信息
    const productResult = await query('SELECT * FROM products WHERE id = ?', [id]);
    const product = productResult[0];

    if (!product) {
      return res.status(404).json({ message: '未找到产品' });
    }

    const picPath = product.picPath;
    const nanoid = product.nanoid; // 获取产品的 nanoid

    // 查询产品描述图片
    const desPicResult = await query('SELECT desPicPath FROM product_des_images WHERE productId = ?', [id]);

    // 删除主图文件
    const headPicFilePath = path.join(__dirname, `..${picPath}`);
    try {
      await unlink(headPicFilePath);
      console.log(`删除文件: ${headPicFilePath}`);
    } catch (err) {
      console.error(`无法删除文件 ${headPicFilePath}:`, err);
    }

    // 删除描述图文件
    for (const desPic of desPicResult) {
      const desPicFilePath = path.join(__dirname, `..${desPic.desPicPath}`);
      try {
        await unlink(desPicFilePath);
        console.log(`删除文件: ${desPicFilePath}`);
      } catch (err) {
        console.error(`无法删除文件 ${desPicFilePath}:`, err);
      }
    }

    // 删除与产品关联的目录
    const folderPath = path.join(__dirname, `../public/images/${nanoid}`);
    try {
      await rmdir(folderPath, { recursive: true });
      console.log(`删除目录: ${folderPath}`);
    } catch (err) {
      console.error(`无法删除目录 ${folderPath}:`, err);
    }

    // 删除产品记录
    await query('DELETE FROM products WHERE id = ?', [id]);
    // 删除产品对应的 views 记录
    await query('DELETE FROM product_views WHERE product_id = ?', [id]);

    res.status(200).json({ message: '产品及其相关数据已删除' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '服务器错误' });
  }
});

router.get('/getProductPaths', async (req, res) => {
  const query = promisify(db.query).bind(db); // 将数据库查询转换为 Promise 风格
const unlink = promisify(fs.unlink); // 将 fs.unlink 转换为 Promise 风格
const rmdir = promisify(fs.rmdir); // 将 fs.rmdir 转换为 Promise 风格
  const { id } = req.query;

  try {
    // 查询产品信息
    const productResult = await query('SELECT id FROM products WHERE id = ?', [id]);
    const product = productResult[0];

    if (!product) {
      return res.status(404).json({ message: '未找到产品' });
    }

    // 查询产品描述图片路径
    const desPicResult = await query('SELECT id FROM product_des_images WHERE productId = ?', [id]);

    // 构建返回的路径数组
    const paths = {
      head: product.id,
      des: desPicResult.map(desPic => desPic.id)
    };

    // 返回路径信息
    res.status(200).json(paths);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 查询每个用户浏览了哪些商品，并返回每个商品的总浏览次数
router.get('/getUserViewRecords', (req, res) => {
  // 查询每个用户浏览了哪些商品
  const userProductQuery = `
      SELECT u.id AS user_id, u.username AS user_name, p.id AS product_id, p.name AS product_name, pv.view_time
      FROM product_views pv
      JOIN users u ON pv.user_id = u.id
      JOIN products p ON pv.product_id = p.id
      ORDER BY u.id, pv.view_time;
  `;
  
  // 查询每个商品的总浏览次数
  const productCountQuery = `
      SELECT p.id AS product_id, p.name AS product_name, COUNT(pv.id) AS total_views
      FROM product_views pv
      JOIN products p ON pv.product_id = p.id
      GROUP BY p.id;
  `;

  // 执行查询
  db.query(userProductQuery, (err, userProductResult) => {
      if (err) {
          return res.status(500).json({ message: '查询用户浏览记录失败', error: err });
      }

      db.query(productCountQuery, (err, productCountResult) => {
          if (err) {
              return res.status(500).json({ message: '查询商品浏览次数失败', error: err });
          }

          // 返回两个查询结果
          res.status(200).json({
              userViewRecords: userProductResult,
              productViewCounts: productCountResult
          });
      });
  });
});

// 获取用户数据接口
router.get('/getUsers', (req, res) => {
  const sql = 'SELECT * FROM users'; // 查询所有用户

  db.query(sql, (err, results) => {
      if (err) {
          return res.status(500).json({ message: '查询用户数据失败', error: err });
      }
      res.status(200).json(results); // 返回查询结果
  });
});

// 删除用户接口
router.get('/deleteUser', (req, res) => {
  const userId = req.query.id; // 从请求参数中获取用户ID

  const sql = 'DELETE FROM users WHERE id = ?'; // SQL删除语句

  db.query(sql, [userId], (err, results) => {
      if (err) {
          return res.status(500).json({ message: '删除用户失败', error: err });
      }
      if (results.affectedRows === 0) {
          return res.status(404).json({ message: '用户未找到' });
      }
      res.status(200).json({ message: '用户删除成功' });
  });
});

// 编辑用户接口
router.post('/editUser', (req, res) => {
  const { username, tel, role, idNum,id,password } = req.body; // 从请求体中获取更新的数据

  const sql = 'UPDATE users SET username = ?, tel = ?, role = ?, idNum = ? , password = ?WHERE id = ?'; // SQL更新语句

  db.query(sql, [username, tel, role, idNum, password,id], (err, results) => {
      if (err) {
          return res.status(500).json({ message: '更新用户失败', error: err });
      }
      if (results.affectedRows === 0) {
          return res.status(404).json({ message: '用户未找到' });
      }
      res.status(200).json({ message: '用户更新成功' });
  });
});

// 设置 Multer 存储配置
const storage2 = multer.diskStorage({
  destination: (req, file, cb) => {
    const uuid = req.body.uuid ; // 从请求体获取 uuid，如果没有则生成
    const dir = path.join(__dirname, `../public/images/${uuid}`);
    console.log(dir, 'dirdirdirdirdirdirdirdirdir');

    // 创建目录
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}`; // 生成唯一后缀
    let filename;

    if (file.fieldname === 'headPic') {
      filename = `head_${uniqueSuffix}.png`; // 用唯一后缀命名
    } else if (file.fieldname === 'desPics') {
      filename = `des_${uniqueSuffix}.png`; // 用唯一后缀命名
    }
    // else if (file.fieldname.startsWith('desPics')) {
    //   const index = file.fieldname.split('_')[1]; // 取出索引
    //   filename = `des_${index}-${uniqueSuffix}.png`; // 用唯一后缀命名
    // } else {
    //   return cb(new Error('Invalid field name')); // 非法字段名处理
    // }

    cb(null, filename);
  },
});

const upload2 = multer({ storage: storage2 });


// 创建路由接口
router.post('/ceshiceshi', upload2.fields([{ name: 'headPic', maxCount: 1 }, { name: 'desPics' }]), (req, res) => {
  // const { uuid, otherTextInfo,name } = req.body; // 获取文本信息
  // const headPicPath = path.join('images', uuid, 'head.png'); // 相对路径
  // const desPics = [];

  // // 构造描述图片路径
  // for (let i = 1; i <= 3; i++) {
  //     if (req.files[`desPics_${i}`]) {
  //         desPics.push(path.join('images', uuid, `des_${i}.png`));
  //     }
  // }

  // // 保存文本信息和图片路径到数据库
  // const sql = 'INSERT INTO products (uuid, otherTextInfo, headPicPath,name) VALUES (?, ?, ?,?)';
  // const desPicPathsStr = JSON.stringify(desPics); // 将描述图片路径转换为字符串

  // db.query(sql, [uuid, otherTextInfo, headPicPath,name], (err, results) => {
  //     if (err) {
  //         console.error(err);
  //         return res.status(500).send('Database error');
  //     }
  //     res.status(200).send('Upload successful');
  // });
});

router.get('/getAllOrders', (req, res) => {
  // 查询所有订单以及关联的用户和产品信息
  const sql = `
    SELECT 
      orders.id AS orderId,
      users.username AS userName,
      users.tel AS userTel,
      products.name AS productName,
      products.reward AS productReward,
      orders.quantity,
      orders.total_price
    FROM 
      orders
    JOIN users ON orders.user_id = users.id
    JOIN products ON orders.product_id = products.id`;

  db.query(sql, (err, results) => {
    if (err) {
      console.error('数据库错误: ', err);
      return res.status(500).json({ message: '获取订单数据时发生错误' });
    }

    res.status(200).json({
      orders: results // 返回所有订单数据
    });
  });
});

// POST 接口，更新订单的 total_prize
router.post('/updateOrderPrice', async (req, res) => {
  const { id, price } = req.body; // 从请求体获取 id 和 price

  // 验证输入
  if (!id || price === undefined) {
      return res.status(400).json({ message: '缺少参数 id 或 price' });
  }

  try {
      // 更新 orders 表中的 total_prize 字段
      const [result] = await db.promise().query('UPDATE orders SET total_price = ? WHERE id = ?', [price, id]);

      if (result.affectedRows > 0) {
          res.status(200).json({ message: '订单总价更新成功' });
      } else {
          res.status(404).json({ message: '未找到该订单' });
      }
  } catch (error) {
      console.error('更新订单价格失败:', error);
      res.status(500).json({ message: '服务器错误', error: error.message });
  }
});

// POST 接口，根据 orderId 更新用户的 account 并删除订单
router.post('/update-account', (req, res) => {
  const { orderId, price } = req.body;

  if (typeof orderId === 'undefined' || typeof price === 'undefined') {
    return res.status(400).json({ message: 'orderId 和 price 是必填项' });
  }

  // 先查询 orders 表以获取 user_id
  const getUserIdQuery = 'SELECT user_id FROM orders WHERE id = ?';
  
  db.query(getUserIdQuery, [orderId], (error, results) => {
    if (error) {
      return res.status(500).json({ message: '数据库错误', error });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: '未找到该订单' });
    }

    const userId = results[0].user_id; // 获取 user_id

    // 使用 user_id 更新 users 表的 account
    const updateAccountQuery = 'UPDATE users SET account = account + ? WHERE id = ?';

    db.query(updateAccountQuery, [price, userId], (error, results) => {
      if (error) {
        return res.status(500).json({ message: '数据库错误', error });
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({ message: '未找到该用户' });
      }

      // 更新成功后删除订单
      const deleteOrderQuery = 'DELETE FROM orders WHERE id = ?';
      db.query(deleteOrderQuery, [orderId], (error) => {
        if (error) {
          return res.status(500).json({ message: '数据库错误', error });
        }

        res.status(200).json({ message: '账户更新成功，订单已删除' });
      });
    });
  });
});

// GET 接口，获取 cashApplies 数据
router.get('/get-cash-applies', (req, res) => {
  // 查询 cashApplies 表
  const query = 'SELECT ca.id, ca.user_id, ca.count, ca.status, ca.created_at, u.account FROM cashApplies ca JOIN users u ON ca.user_id = u.id';

  db.query(query, (error, results) => {
    if (error) {
      return res.status(500).json({ message: '数据库错误', error });
    }

    // 返回查询结果
    res.status(200).json({
      message: '查询成功',
      data: results // 返回 cashApplies 数据
    });
  });
});

// GET 接口，删除指定 desPicId 的图片
router.get('/delete-des-pic', (req, res) => {
  const { desPicId } = req.query;

  if (!desPicId) {
    return res.status(400).json({ message: 'desPicId 是必需的' });
  }

  // 查询 product_des_images 表获取 desPicPath
  const query = 'SELECT desPicPath FROM product_des_images WHERE id = ?';
  
  db.query(query, [desPicId], (error, results) => {
    if (error) {
      return res.status(500).json({ message: '数据库错误', error });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: '未找到该图片记录' });
    }

    const desPicPath = results[0].desPicPath;
    const fullPath = path.join(__dirname, `${desPicPath}`);

    // 删除文件
    fs.unlink(fullPath, (err) => {
      if (err) {
        return res.status(500).json({ message: '文件删除失败', error: err });
      }

      // 删除数据库中的记录
      const deleteQuery = 'DELETE FROM product_des_images WHERE id = ?';
      db.query(deleteQuery, [desPicId], (deleteError) => {
        if (deleteError) {
          return res.status(500).json({ message: '删除记录失败', error: deleteError });
        }

        res.status(200).json({ message: '图片和记录删除成功' });
      });
    });
  });
});
module.exports = router;
