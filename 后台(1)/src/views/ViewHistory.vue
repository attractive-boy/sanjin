<template>
    
   <div style="display: flex;flex-direction: column;">
    <el-divider>用户浏览记录</el-divider>

    <el-table :data="userViews" style="width: 100%" v-loading="loading">
      <el-table-column prop="user_id" label="用户ID" width="100"></el-table-column>
      <el-table-column prop="user_name" label="用户名" width="150"></el-table-column>
      <el-table-column prop="product_id" label="商品ID" width="100"></el-table-column>
      <el-table-column prop="product_name" label="商品名称" width="200"></el-table-column>
      <el-table-column prop="view_time" label="浏览时间" width="200"></el-table-column>
    </el-table>

    <el-divider>商品总浏览次数</el-divider>

    <el-table :data="productViewCounts" style="width: 100%" v-loading="loading">
      <el-table-column prop="product_id" label="商品ID" width="100"></el-table-column>
      <el-table-column prop="product_name" label="商品名称" width="200"></el-table-column>
      <el-table-column prop="total_views" label="总浏览次数" width="150"></el-table-column>
    </el-table>
   </div>
</template>
<script setup>
import {ref,onBeforeMount}from 'vue'
import { getUserViewRecords } from '../../api';
const productViewCounts=ref([])
const userViews=ref([])

async function getViewData(){
  const res= await getUserViewRecords()
  console.log(res,'resssssssss');
  productViewCounts.value=res.data.productViewCounts
  userViews.value=res.data.userViewRecords

    
}
onBeforeMount(()=>{
    getViewData()
})
</script>
<style scoped lang="scss">
</style>