<template>
    <el-table :data="orderList" style="width: 100%">
        <!-- 订单ID -->
        <el-table-column prop="orderId" label="订单ID" width="120">
        </el-table-column>

        <!-- 用户名 -->
        <el-table-column prop="userName" label="用户名" width="120">
        </el-table-column>

        <!-- 用户电话 -->
        <el-table-column prop="userTel" label="电话" width="150">
        </el-table-column>

        <!-- 产品名 -->
        <el-table-column prop="productName" label="产品名" width="180">
        </el-table-column>

        <!-- 产品奖励 -->
        <el-table-column prop="productReward" label="奖励" width="100">
        </el-table-column>

        <!-- 数量 -->
        <el-table-column prop="quantity" label="数量" width="80">
        </el-table-column>

        <!-- 总价 -->
        <el-table-column prop="total_price" label="总价" width="100">
            
        </el-table-column>
        <el-table-column  label="操作" >
            <template #default="scope">
                <el-popconfirm title="确定打到账户吗?" confirm-button-text="确定" cancel-button-text="取消" @confirm="handlePayClick(scope.row)">
                    <template #reference>
                        <el-button type="primary" size="mini" @click="">结算</el-button>
                    </template>
                </el-popconfirm>
                <el-button type="primary" size="mini" @click="editPriceClick(scope.row)">编辑金额</el-button>

            </template>
        </el-table-column>
  </el-table>
  <el-drawer
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


  </el-drawer>
</template>

<script setup>
import { ref,onBeforeMount } from 'vue';
import router from '@/router';
import { getAllOrders,editPrice,addToAccount } from '../../api';
    const orderList=ref([])
    const showDrawer=ref(false)
    const direction=ref('rtl')
    const price=ref(null)
    const id=ref(null)
    const editClick=ref(false)
    async function handlePayClick(row){
        const obj={
            orderId:row.orderId,
            price:row.total_price
        }
       const res= await addToAccount(obj)
       console.log(res,'res');
       getOrdersData()
       
        
    }
    function editPriceClick(row){
        showDrawer.value=true
        price.value=row.total_price
        id.value=row.orderId

        console.log(row,'row');
        editClick.value=!editClick.value
    }
    function confirmSend(){
    }
    
    async function submitEdit(){
        const obj={
            id:id.value,
            price:price.value
        }
        const res=await editPrice(obj)
        console.log(res,'res');
        getOrdersData()
        
        showDrawer.value=false
    }
async function getOrdersData(){
    const res= await getAllOrders()
    console.log(res,'res');
    orderList.value=res.data.orders
    console.log(orderList.value,'orderList.value');

    
}
onBeforeMount(()=>{
    getOrdersData()
})
</script>

<style scoped lang="scss">

</style>
