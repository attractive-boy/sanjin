<template>
    <el-table :data="cashApplies" style="width: 100%">
    <el-table-column prop="id" label="申请 ID" width="150" />
    <el-table-column prop="user_id" label="用户 ID" width="150" />
    <el-table-column prop="count" label="申请金额" width="150" />
    <el-table-column prop="status" label="状态" width="150" />
    <el-table-column prop="created_at" label="创建时间" width="150" />
    <el-table-column prop="account" label="用户账户" width="150" />
    <el-table-column  label="操作" >
            <template #default="scope">
                <el-popconfirm title="确定打到账户吗?" confirm-button-text="确定" cancel-button-text="取消" @confirm="handlePayClick(scope.row)">
                    <template #reference>
                        <el-button type="primary" size="mini" @click="">打款</el-button>
                    </template>
                </el-popconfirm>
                <!-- <el-button type="primary" size="mini" @click="editPriceClick(scope.row)">编辑金额</el-button> -->

            </template>
        </el-table-column>
  </el-table>
  <!-- <el-drawer
    v-model="showDrawer"
    title="编辑金额"
    :direction="direction"
  >
    <div style="display: flex;align-items: center;gap: 10px;">
        <div style="display: flex;align-items: center;">
            <div>金额：</div>
            <el-input v-model="price" style="width: 140px" placeholder="请输入" />
            </div>
        <el-button type="primary" size="mini" @click="submitEdit" >提交修改</el-button>

        
    </div>


  </el-drawer> -->
</template>

<script setup>
import { ref,onBeforeMount } from 'vue';
import router from '@/router';
import { getAllOrders,editPrice,addToAccount, getCashApplies } from '../../api';
    const cashApplies=ref([])
    // const orderList=ref([])
    // const showDrawer=ref(false)
    // const direction=ref('rtl')
    // const price=ref(null)
    // const id=ref(null)
    // const editClick=ref(false)
    // async function handlePayClick(row){
    //     const obj={
    //         orderId:row.orderId,
    //         price:row.total_price
    //     }
    //    const res= await addToAccount(obj)
    //    console.log(res,'res');
    //    getOrdersData()
       
        
    // }
    // function editPriceClick(row){
    //     showDrawer.value=true
    //     price.value=row.total_price
    //     id.value=row.orderId

    //     console.log(row,'row');
    //     editClick.value=!editClick.value
    // }
    // function confirmSend(){
    // }
    
    // async function submitEdit(){
    //     const obj={
    //         id:id.value,
    //         price:price.value
    //     }
    //     const res=await editPrice(obj)
    //     console.log(res,'res');
    //     getOrdersData()
        
    //     showDrawer.value=false
    // }
    async function getData() {
  const res = await getCashApplies();
  console.log(res, 'res');

  // 转换时间格式并处理状态
  cashApplies.value = res.data.data.map(item => {
    return {
      ...item,
      created_at: new Date(item.created_at).toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }).replace(/\//g, '-').replace(',', ' '), // 替换格式
      status: item.status === 'pending' ? '待打款' : item.status // 状态处理
    };
  });
}


onBeforeMount(()=>{
    getData()
})
</script>

<style scoped lang="scss">

</style>
