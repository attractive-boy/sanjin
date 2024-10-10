<template>
    <el-container style="height: 100vh; justify-content: center; align-items: center;">
      <el-card class="login-card" shadow="always" style="width: 400px;">
        <h2 class="login-title">登录</h2>
        <el-form :model="loginForm" :rules="rules" ref="formRef" label-width="100px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="loginForm.username" placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input
              v-model="loginForm.password"
              type="password"
              placeholder="请输入密码"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSubmit">登录</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </el-container>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { login } from '../../api';
  import router from '@/router';
  // 登录表单数据
  const loginForm = ref({
    username: '',
    password: ''
  });
  
  // 表单验证规则
  const rules = {
    username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
    password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
  };
  
  // 提交表单
  const handleSubmit = async () => {
    await login(loginForm.value).then((res)=>{
        if(res.status==200){
            router.push({path:'/'})
        }
    })

    // const formRef = $refs.formRef;
    // formRef.validate((valid) => {
    //   if (valid) {
    //     // 在这里处理登录逻辑，例如调用 API

    //     console.log('表单数据:', loginForm.value);
    //   } else {
    //     console.log('表单验证失败');
    //     return false;
    //   }
    // });
  };
  </script>
  
  <style scoped>
  .login-card {
    padding: 20px;
    text-align: center;
  }
  .login-title {
    margin-bottom: 20px;
    font-size: 24px;
  }
  </style>
  