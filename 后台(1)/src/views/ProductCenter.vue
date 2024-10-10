<template>
<el-table :data="products" style="width: 100%">
    <el-table-column
      prop="id"
      label="ID"
      width="80"
    />
    <el-table-column
      prop="name"
      label="名称"
    />
    <!-- <el-table-column
      prop="limitTime"
      label="Limit Time"
    /> -->
    <el-table-column
      prop="start_time"
      label="起始时间"
    />
    <el-table-column
      prop="end_time"
      label="结束时间"
    />
    <el-table-column
      prop="reward"
      label="奖励"
    />
    <el-table-column
      prop="picPath"
      label="商品图"
    >
    <template #default="scope">
      <el-image
      style="width: 100px; height: 100px"
      :src="scope.row.picPath"
      :preview-src-list="srcList"
      :initial-index="scope.$index"
      fit="cover"
      :preview-teleported="true"

    />
      </template>
  </el-table-column>
  <el-table-column
      prop="description"
      label="描述"
    />
    <el-table-column
      prop="pirUrl"
      label="描述图"
    >
    <template #default="scope">
      <div v-for="item in scope.row.desPicPaths">
        <el-image
      style="width: 100px; height: 100px"
      :src="item"
      :preview-src-list="srcList2"
      :initial-index="scope.$index"
      fit="cover"
      :preview-teleported="true"

    />
      </div>
      </template>
  </el-table-column>
    <el-table-column
      prop="special"
      label="特殊提示"
    />
    <el-table-column label="操作">
      <template #default="scope">
        <el-button size="small" @click="editClick(scope.$index, scope.row)"
          >编辑</el-button
        >
        <el-button
          size="small"
          type="danger"
          @click="handleDelete(scope.$index, scope.row)"
          >删除</el-button
        >
      </template>
    </el-table-column>
  </el-table>


    <el-button type="primary" @click="addClick">添加产品</el-button>
<!-- 抽屉 -->
    <el-drawer
      v-model="showDrawer"
      :title=drawerTitle
      :direction="direction"
      :size="550"
    >
      <el-form :model="productForm" label-width="120px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="productForm.name" />
        </el-form-item>
        <el-form-item label="时间范围" prop="limitTime">
          <el-date-picker
            v-model="productForm.limitTime"
            type="datetime"
            placeholder="选择截止时间"
            style="display: none;"
          />
          <el-date-picker
      v-model="value1"
      type="datetimerange"
      range-separator="到"
      start-placeholder="开始时间"
      end-placeholder="结束时间"
    />
        </el-form-item>
        <el-form-item label="奖励" prop="reward">
          <el-input v-model="productForm.reward" />
        </el-form-item>
        <el-form-item label="商品图片" prop="picUrl">
          <el-upload
          ref="upload"
    v-model:file-list="fileList"
    class="upload-demo"
    :on-change="headPicChange"
    :auto-upload="false"
    list-type="picture"
    :limit="1"
    :on-exceed="handleExceed"
  >
    <el-button type="primary">点击上传</el-button>
    <template #tip>
      <div class="el-upload__tip">
        jpg/png files with a size less than 500kb
      </div>
    </template>
  </el-upload>
        </el-form-item>
        <el-form-item label="描述" prop="description">
            <el-input
            v-model="productForm.description"
            :rows="5"
            type="textarea"
            placeholder="请输入"
          />
        </el-form-item>
        <el-form-item label="描述图片" prop="desPics">
          <el-upload
    v-model:file-list="fileList2"
    list-type="picture-card"
    class="upload-demo"
    :on-change="desPicChange"
    :auto-upload="false"
    :before-remove="handleRemove"
  >
    <el-button type="primary">上传</el-button>
    <template #tip>
      <div class="el-upload__tip">
        jpg/png files with a size less than 500kb
      </div>
    </template>
  </el-upload>
        </el-form-item>
        <el-form-item label="特殊提示" prop="special">
            <el-input
            v-model="productForm.special"
            :rows="2"
            type="textarea"
            placeholder="请输入"
          />
        </el-form-item>
        <el-form-item>
        
          <el-button v-if="drawerTitle=='新增'" type="primary" @click="submitForm">提交</el-button>
          <el-button v-else type="primary" @click="submitEdit">提交编辑</el-button>
          <el-button >取消</el-button>
        </el-form-item>
      </el-form>
    </el-drawer>
    <el-dialog v-model="confirmDialog" title="警告" width="30%" center>
    <span
      >确定要删除吗</span
    >
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmDelete"
          >确定</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>
<script setup>
import {ref,onBeforeMount}from 'vue'
import { getProducts,addProduct,deleteProduct,editProduct,getImages,getProductPaths,deletOneDesPic } from '../../api';
import { genFileId } from 'element-plus'
const products=ref([])
const showDrawer=ref(false)
const direction=ref('rtl')
const fileList=ref([])
const fileList2=ref([])
const pathArr=ref([])
const srcList=ref([])
const srcList2=ref([])

const upload = ref()
const drawerTitle=ref('新增')
const confirmDialog=ref(false)
const uploadRef =ref()
 const currentRow=ref()
const productForm=ref({
        name: '',
        limitTime: '2024-10-01 09:30:00',
        reward: '',
        pic: {},
        description:'',
        special:'',
        head:null,
        start_time:null,
        end_time:null
      })
const value1 = ref([
  new Date(2000, 10, 10, 10, 10),
  new Date(2000, 10, 11, 10, 10),
])
      
function addClick(){
  srcList.value=[]
  srcList2.value=[]
  fileList.value=[]
  fileList2.value=[]

  productForm.value={
        name: '',
        limitTime: '2024-10-01 09:30:00',
        reward: '',
        pic: {},
        description:'',
        special:'',
        desPics:[],
        oriDesIds:[],
        start_time:null,
        end_time:null
      }
    drawerTitle.value='新增'
    showDrawer.value=true
} 
async function editClick(index,row){
  console.log(row,'rowrowrowrowrowrowrowrowrowrow');
  console.log(products.value,'productsproductsproductsproductsproducts');
  products.value.map((item)=>{
    if(item.id==row.id){
      productForm.value.nanoid=item.nanoid
    }
  })
  const res=await getProductPaths(row.id)
  productForm.value.head=res.data.head
  productForm.value.start_time=row.start_time
  productForm.value.end_time=row.end_time
  const formatDateTime = (date) => {
    return date.toISOString().slice(0, 19).replace('T', ' '); // 格式化为 YYYY-MM-DD HH:mm:ss
  };

  productForm.value.start_time = formatDateTime(value1.value[0]); // 转换开始时间
  productForm.value.end_time = formatDateTime(value1.value[1]);   // 转换结束时间
  console.log(res,'ressssssssss');
  console.log(productForm.value,'productFormproductFormproductFormproductForm');

  pathArr.value=res.data
  drawerTitle.value='编辑'
  showDrawer.value=true
  productForm.value.desPics=[]
  
  productForm.value.name=row.name
  productForm.value.reward=row.reward
  productForm.value.id=row.id
  productForm.value.description=row.description
  productForm.value.special=row.special
  productForm.value.pic=undefined
  productForm.value.nanoid=row.nanoid




  fileList.value=[]
  fileList.value.push({
    url: row.picPath,
    name: 'image.png',
  })

  fileList2.value=[]

   // 遍历 desPicPaths 并将其添加到 fileList
   for (const [id, url] of Object.entries(row.desPicPaths)) {
  fileList2.value.push({
    url: url,
    name: `image_${id}.png`, // 根据 ID 生成文件名
    id: Number(id) // 将 desPic 的 ID 转换为数字型
  });
}
  // srcList2.value.map((item)=>{
  //   fileList2.value.push({
  //     url: item,
  //     name: 'image.png'
  //   })
  // })
 
  console.log(productForm,'productForm');
  
} 
async function submitForm() {
  console.log(productForm.value, 'productForm');

  const formatDateTime = (date) => {
    return date.toISOString().slice(0, 19).replace('T', ' '); // 格式化为 YYYY-MM-DD HH:mm:ss
  };

  productForm.value.start_time = formatDateTime(value1.value[0]); // 转换开始时间
  productForm.value.end_time = formatDateTime(value1.value[1]);   // 转换结束时间

  await addProduct(productForm.value);
  showDrawer.value = false;
  getProductsData();
}


async function handleDelete (index, row) {
  confirmDialog.value=true
  currentRow.value=row

}

async function confirmDelete(){
  const id=currentRow.value.id
  await deleteProduct(id);
        // 重新获取产品数据
        getProductsData();
  currentRow.value={}
  confirmDialog.value=false
}

async function handleRemove(file,files){
  console.log(file,'file');
  console.log(files,'files');
  await deletOneDesPic(file.id)
  getProductsData();

  
}
function headPicChange(file){
  fileList.value=[]
  console.log(fileList.value,'fileListfileListfileListfileList','第一个触发了');
  console.log(fileList2.value,'fileList2fileList2fileList2fileList2','第一个触发了');
  productForm.value.pic=file
  
}
function desPicChange(file, files) {
  console.log(fileList.value,'fileListfileListfileListfileList','第二个触发了');
  console.log(fileList2.value,'fileList2fileList2fileList2fileList2','第二个触发了');
  console.log(file, 'file');
  console.log(files, 'files');
  productForm.value.desPics=files
  
  
}
const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始，需加1并补零
  const day = String(date.getDate()).padStart(2, '0'); // 补零
  const hours = String(date.getHours()).padStart(2, '0'); // 补零
  const minutes = String(date.getMinutes()).padStart(2, '0'); // 补零
  const seconds = String(date.getSeconds()).padStart(2, '0'); // 补零

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`; // 返回 YYYY-MM-DD HH:mm:ss
};

async function getProductsData() {
  try {
    const res = await getProducts();
    products.value = res.data.map(product => {
      return {
        ...product,
        start_time: formatDateTime(product.start_time), // 格式化开始时间
        end_time: formatDateTime(product.end_time)      // 格式化结束时间
      };
    });
    console.log(products.value, 'productResponse');
  } catch (error) {
    console.error('获取产品数据失败:', error);
  }
}



async function submitEdit(){
  console.log(fileList.value,'fileListfileListfileList');
  console.log(fileList2.value,'fileList2fileList2fileList2');
  
  let desIds = []
  fileList2.value.map((item)=>{
    desIds.push(item.id)
  })
  productForm.value.oriDesIds=desIds
  console.log(productForm.value,'productformproductformproductformproductformproductform');
  
  productForm.value.desPics = productForm.value.desPics.filter(item => item.raw);

    await editProduct(productForm.value).then((res)=>{
      console.log(res,'resssssssssss');
      
    })
    
    getProductsData()
    showDrawer.value=false


}
function handleExceed(files){
  upload.value.clearFiles()
  const file = files[0]
  file.uid = genFileId()
  upload.value.handleStart(file)
}
function handleExceed2(files){
  upload.value.clearFiles()
  const file = files[0]
  file.uid = genFileId()
  upload.value.handleStart(file)
}

onBeforeMount(()=>{
  getProductsData()
})
</script>