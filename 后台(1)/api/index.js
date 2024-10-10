import axios from 'axios'
import { nanoid } from 'nanoid';
// http://33.33.35.102:10086
//使用axios下面的create([config])方法创建axios实例，其中config参数为axios最基本的配置信息。
const API = axios.create({
  baseURL: 'http://localhost:3000/admin', //请求后端数据的基本地址，自定义
  timeout: 2000 //请求超时设置，单位ms
})

// API.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('accessToken')
//     if (token) {
//       config.headers['x-auth-token'] = token
//     }
//     return config
//   },
//   (error) => {
//     return Promise.reject(error)
//   }
// )
// 响应拦截器
API.interceptors.response.use(
    (response) => {
      // 请求成功，处理成功反馈消息（如果需要）
      if (response.data.message) {
        ElMessage.success(response.data.message);
      }
      return response;
    },
    (error) => {
      // 请求失败，处理错误反馈消息
      if (error.response && error.response.data && error.response.data.message) {
        ElMessage.error(error.response.data.message);
      } else {
        ElMessage.error('请求失败，请稍后再试');
      }
      return Promise.reject(error);
    }
  );
export const login = async (obj) => {
    try {
      // 发送登录请求
      const res = await API.post('/loginAdmin', obj); // 使用你的登录接口地址
  
      console.log(res, 'res');
  
      // 假设响应中包含 token，将其保存到 localStorage 或其他存储方式
      if (res && res.data && res.data.token) {
        localStorage.setItem('token', res.data.token);
      }
      
      return res;
    } catch (error) {
      console.log('登录请求失败:', error);
      throw error;
    }
  };

// 添加商品函数
export const addProduct = async (obj) => {
  try {
    console.log(obj, 'form');
    // 创建一个FormData对象，将表单数据和文件封装到其中
    const formData = new FormData();
    formData.append('nanoid',  nanoid()); // 添加随机生成的 ID
    formData.append('name', obj.name);
    formData.append('limitTime', obj.limitTime);
    formData.append('reward', obj.reward);
    formData.append('description', obj.description);
    formData.append('special', obj.special);
    formData.append('headPic', obj.pic.raw); // 主图片
    formData.append('start_time', obj.start_time); 
    formData.append('end_time', obj.end_time); 



    // 添加多张图片到desPics字段
    obj.desPics.forEach((desPic) => {
      formData.append('desPics', desPic.raw); // 添加每张图片
    });

    // 发送添加商品请求
    const res = await API.post('/addProduct', formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // 告诉服务器数据格式为multipart
      },
    });

    console.log(res, 'res');

    // 处理响应数据（根据需要）
    if (res && res.data) {
      console.log('商品添加成功:', res.data.message);
    }

    return res;
  } catch (error) {
    console.log('添加商品请求失败:', error);
    throw error;
  }
};
export const editProduct = async (obj) => {
  try {
    console.log(obj, '传过来的obj');

    // 创建一个FormData对象，将表单数据和文件封装到其中
    const formData = new FormData();
    formData.append('name', obj.name);
    formData.append('limitTime', obj.limitTime);
    formData.append('reward', obj.reward);
    formData.append('productId', obj.id); // 上传的文件对象
    formData.append('description', obj.description);
    formData.append('special', obj.special);
    formData.append('oriDesIds', obj.oriDesIds);
    formData.append('nanoid', obj.nanoid);
    formData.append('start_time', obj.start_time);
    formData.append('end_time', obj.end_time);
    

    

    // 检查 pic 是否为文件对象并添加
    if (obj.pic && obj.pic.raw) {
      formData.append('headPic', obj.pic.raw);
    }
    
    // obj.desPics.forEach((desPic) => {
    //   formData.append('desPics', desPic.raw); // 添加每张图片
    // });

    // 检查 desPics 是否为文件对象并添加
    if (Array.isArray(obj.desPics)) {
      obj.desPics.forEach((desPic) => {
        if (desPic && desPic.raw) {
          formData.append('desPics', desPic.raw); // 添加每张图片
        }
      });
    }

    // 发送编辑商品请求
    const res = await API.post('/editProduct', formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // 告诉服务器数据格式为multipart
      },
    });

    console.log(res, 'res');

    // 处理响应数据（根据需要）
    if (res && res.data) {
      console.log('商品编辑成功:', res.data.message);
    }

    return res;
  } catch (error) {
    console.log('编辑商品请求失败:', error);
    throw error;
  }
};

export const myChat = async (id, askText) => {
    try {
      const res = await API.post('/large-model/api/v1/chat-message/process', {
        chatId: id,
        talk: askText,
        tools: ['retrieval'],
        plugins: [
          {
            type: 'retrieval'
          }
        ]
      })
      const eventSource = new EventSource('/sse') // 用于处理长轮询的事件源
      eventSource.onmessage = (event) => {
        console.log(event.data)
      }
      return res
    } catch (error) {
      console.log(error)
      throw error
    }
  }
  export const getProducts = async () => {
    try {
      const res = await API.get('/getAllProducts', {
       
      })
      return res
    } catch (error) {
      console.log(error)
      throw error
    }
  }
  export const getImages = async () => {
    try {
      const res = await API.get('/getAllProductImages');
      if (res && res.data ) {
        // 转换 Base64 图片数据为 Data URL
        const imagesWithUrls = res.data.images.map(image => ({
          id: image.id,
          fileName: image.fileName,
          base64Image: image.base64Image[0], // 主图片
          desPics: image.desPics // 描述图片
        }));
        console.log(imagesWithUrls,'imagesWithUrlsimagesWithUrlsimagesWithUrlsimagesWithUrls');
        
        return imagesWithUrls;
      } else {
        throw new Error('未找到图片数据');
      }
    } catch (error) {
      console.log('获取图片失败:', error);
      throw error;
    }
  };
  

  export const deleteProduct = async (productId) => {
    try {
      // 发送删除请求，使用查询参数传递 productId
      const res = await API.get('/deleteProduct', {
        params: {
          id: productId
        }
      });
  
      console.log(res, 'res');
  
      // 处理成功反馈消息（根据需要）
      if (res && res.data && res.data.message) {
        console.log('删除成功:', res.data.message);
      }
  
      return res;
    } catch (error) {
      console.log('删除请求失败:', error);
      throw error;
    }
  };

  export const getUserViewRecords = async () => {
    try {
      // 发送删除请求，使用查询参数传递 productId
      const res = await API.get('/getUserViewRecords');
  
      console.log(res, 'res');
  
      // 处理成功反馈消息（根据需要）
      if (res && res.data && res.data.message) {
        console.log('删除成功:', res.data.message);
      }
  
      return res;
    } catch (error) {
      console.log('删除请求失败:', error);
      throw error;
    }
  };

  export const getUsers = async () => {
    try {
      // 发送删除请求，使用查询参数传递 productId
      const res = await API.get('/getUsers');
  
      console.log(res, 'res');
  
      // 处理成功反馈消息（根据需要）
      if (res && res.data && res.data.message) {
        console.log('删除成功:', res.data.message);
      }
  
      return res;
    } catch (error) {
      console.log('删除请求失败:', error);
      throw error;
    }
  };


  export const deleteUser = async (id) => {
    try {
      // 发送删除请求，使用查询参数传递 productId
      const res = await API.get('/deleteUser', {
        params: {
          id: id
        }
      });
  
      console.log(res, 'res');
  
      // 处理成功反馈消息（根据需要）
      if (res && res.data && res.data.message) {
        console.log('删除成功:', res.data.message);
      }
  
      return res;
    } catch (error) {
      console.log('删除请求失败:', error);
      throw error;
    }
  };

  export const getProductPaths = async (id) => {
    try {
      // 发送删除请求，使用查询参数传递 productId
      const res = await API.get('/getProductPaths', {
        params: {
          id: id
        }
      });
  
      console.log(res, 'res');
      return res;
    } catch (error) {
      console.log('删除请求失败:', error);
      throw error;
    }
  };
  export const editUser = async (obj) => {
    try {
      // 发送登录请求
      const res = await API.post('/editUser', obj); // 使用你的登录接口地址
  
      console.log(res, 'res');
  
      return res;
    } catch (error) {
      console.log('登录请求失败:', error);
      throw error;
    }
  };

  export const getAllOrders = async () => {
    try {
      const res = await API.get('/getAllOrders', {
       
      })
      return res
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  
  export const editPrice = async (obj) => {
    try {
      // 发送登录请求
      const res = await API.post('/updateOrderPrice', obj); // 使用你的登录接口地址
  
      console.log(res, 'res');
  
      return res;
    } catch (error) {
      console.log('失败:', error);
      throw error;
    }
  };

  export const addToAccount = async (obj) => {
    try {
      // 发送登录请求
      const res = await API.post('/update-account', obj); // 使用你的登录接口地址
  
      console.log(res, 'res');
  
      return res;
    } catch (error) {
      console.log('失败:', error);
      throw error;
    }
  };

  export const getCashApplies = async () => {
    try {
      const res = await API.get('/get-cash-applies', {
       
      })
      return res
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  export const deletOneDesPic = async (id) => {
    try {
      const res = await API.get(`/delete-des-pic?desPicId=${id}`, {
       
      })
      return res
    } catch (error) {
      console.log(error)
      throw error
    }
  }