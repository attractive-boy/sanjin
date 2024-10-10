<template>
 <el-table :data="users" style="width: 100%" v-loading="loading">
      <el-table-column prop="id" label="用户ID" width="100"></el-table-column>
      <el-table-column prop="username" label="用户名" width="150"></el-table-column>
      <el-table-column prop="tel" label="电话" width="150"></el-table-column>
      <el-table-column prop="role" label="角色" width="100"></el-table-column>
      <el-table-column prop="idNum" label="身份证号" width="200"></el-table-column>
      <el-table-column prop="password" label="密码" width="150"></el-table-column>
      <el-table-column  label="操作" width="200">
        <template #default="scope">
            <el-button type="primary" plain @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="primary" plain @click="handleDelete(scope.row)">删除</el-button>
        </template>
        
      </el-table-column>
      
    </el-table>
    <el-drawer
      v-model="showDrawer"
      title="编辑用户"
      :direction="direction"
      @close="resetForm"
    >
      <el-form :model="userForm" ref="userFormRef" label-width="100px">
        <el-form-item label="用户ID">
          <el-input v-model="userForm.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userForm.username" required></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="tel">
          <el-input v-model="userForm.tel" required></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="role">
            <el-select
      v-model="userForm.role"
      placeholder="Select"
      size="large"
      style="width: 240px"
    >
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
        </el-form-item>
        <el-form-item label="身份证号" prop="idNum">
          <el-input v-model="userForm.idNum" required></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="userForm.password" required></el-input>
        </el-form-item>
      </el-form>

      <div style="text-align: right; margin-top: 20px;">
        <el-button @click="showDrawer = false">取消</el-button>
        <el-button type="primary" @click="submitForm">确认</el-button>
      </div>
    </el-drawer>
</template>
<script setup>
import {ref,onBeforeMount}from 'vue'
import { getUsers,deleteUser,editUser} from '../../api';
const userForm=ref({})
const users = ref([])
const showDrawer=ref(false)
const direction=ref('rtl')
const options = [
  {
    value: 'admin',
    label: '管理员',
  },
  {
    value: 'user',
    label: '用户',
  },
  {
    value: 'proxy',
    label: '代理',
  }
]
function handleDelete(row){
    deleteUser(row.id).then(res=>{
    getUsersData()
        
        console.log(res)
    })
}
function handleEdit(row){
    showDrawer.value=true
    userForm.value={...row}
    console.log(row,'rowwwwwww');
    
    
}
function submitForm(){
    editUser(userForm.value).then(res=>{
        console.log(res)
        showDrawer.value=false
        getUsersData()
    })
}
function getUsersData(){
    getUsers().then(res=>{
        console.log(res)
        users.value=res.data
    console.log(users.value,'users');

    })
}
onBeforeMount(()=>{
    getUsersData()
    
})
</script>
<style scoped lang="scss">
</style>