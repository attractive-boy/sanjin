<template>
  <div style="display: flex;">
    <el-menu
    default-active="1"
    class="el-menu-vertical-demo"
    background-color="#545c64"
    text-color="#fff"
    active-text-color="#ffd04b"
    style="width: 200px;height: 100vh;"
  >
    <!-- 首页 -->
    <el-menu-item index="1" @click="router.push({path:'/'})">首页</el-menu-item>

    <!-- 浏览记录（可下拉）-->
    <el-sub-menu index="2">
      <template #title @click="goHistory">浏览记录</template>
      <el-menu-item index="2-1" @click="goHistory">最近浏览</el-menu-item>
      <el-menu-item index="2-2">历史浏览</el-menu-item>
    </el-sub-menu>

    <!-- 订单记录（可下拉）-->
    <el-sub-menu index="3">
      <template #title>订单记录</template>
      <el-menu-item index="3-1" @click="goOrder">待处理订单</el-menu-item>
      <el-menu-item index="3-2">已完成订单</el-menu-item>
    </el-sub-menu>

    <!-- 产品中心 -->
    <el-menu-item index="4" @click="goCenter">产品中心</el-menu-item>

    <!-- 子账号管理 -->
    <el-menu-item index="5">子账号管理</el-menu-item>

    <!-- API订单管理（可下拉）-->
    <el-sub-menu index="6">
      <template #title>API订单管理</template>
      <el-menu-item index="6-1">API接口订单</el-menu-item>
      <el-menu-item index="6-2">API订单历史</el-menu-item>
    </el-sub-menu>

    <!-- 设置密码 -->
    <el-menu-item index="7" @click="router.push({path:'/userManage'})">设置密码</el-menu-item>

    <!-- 打款记录 -->
    <el-sub-menu index="8">
      <template #title>打款记录</template>
      <el-menu-item index="8-1">已经打款</el-menu-item>
      <el-menu-item index="8-2" @click="router.push({path:'/cashiApplies'})">申请中的提现</el-menu-item>
    </el-sub-menu>
    <el-menu-item index="9" @click="router.push({path:'/login'})">去登录</el-menu-item>

  </el-menu>
 <router-view></router-view>
  </div>
</template>
<script setup>
import router from '@/router';
import {onBeforeMount}from 'vue'
function goCenter(){
  console.log(11);
  
  router.push({path:'/ProductCenter'})
}
function goHistory(){
  console.log(11);
  
  router.push({path:'/ViewHistory'})
}
function goOrder(){
  console.log(11);
  
  router.push({path:'/Order'})
}
onBeforeMount(()=>{

})
</script>
