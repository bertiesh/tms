<template>
  <div class="index">
    <el-container>
      <!-- 搜索框 -->
      <el-header>
        <div class="olog-inpt">
          <span>用户名：</span>
          <el-input
            placeholder="请输入内容"
            v-model="search.name"
            size="small"
            clearable
          >
          </el-input>
          <span>用户id：</span>
          <el-input
            placeholder="请输入内容"
            v-model="search.id"
            size="small"
            clearable
          >
          </el-input>
        </div>
        <div class="olog-but">
          <el-tooltip
            v-if="showFullScren"
            effect="dark"
            :content="
              isFullScren ? $t('navbar.screenfullF') : $t('navbar.screenfull')
            "
            placement="bottom"
          >
            <i
              :class="
                isFullScren
                  ? 'iconfont icon-tuichuquanping'
                  : 'iconfont icon-quanping'
              "
              @click="fullScren"
            ></i>
          </el-tooltip>
          <el-button type="primary" icon="iconfont icon-sousuo" @click="searchbtn"
            >搜索</el-button
          >
          <el-button type="primary" icon="iconfont icon-shuaxin" @click="reset"
            >刷新</el-button
          >
        </div>
      </el-header>
      <el-main>
        <template>
          <div class="addbtn">

            
<div>
  <el-button
   @click="uploadexcel"
            type="primary"
            >excel导入用户</el-button
          >

           <a href="/api/files/display?filePath=hdfs://10.32.20.50:9001/training/files/userAuthDao.xlsx" ><el-button
            type="primary"
            >下载excel样表</el-button></a>
</div>
 <!-- 添加按钮 -->
          <el-upload
          ref="upload"
  class="upload-demo"
  action="/api/admin/users/import"
  multiple
  :on-success="handleAvatarSuccess"
  >
   
</el-upload>
          </div>
         
          <!-- 表格 -->
          <el-table
            :data="tableData"
            :header-cell-style="{ 'text-align': 'center' }"
            :cell-style="{ 'text-align': 'center', padding: '8px' }"
            :row-class-name="tableRowClassName"
          >
            <el-table-column type="index" label="序号" width="70">
            </el-table-column>
            <el-table-column prop="nickname" label="用户名">
            </el-table-column>
             <el-table-column label="积分管理">
              <template slot-scope="scope">
<el-button
                  type="text"
                  @click.native.prevent="checkintegral(scope.row.userInfoId)"
                  >查看积分</el-button
                >
              </template>
             </el-table-column>
             <el-table-column label="地址管理">
              <template slot-scope="scope">
<el-button
                  type="text"
                  @click.native.prevent="checkaddress(scope.row.userInfoId)"
                  >查看地址</el-button
                >
              </template>
             </el-table-column>
             <el-table-column label="购物车管理">
              <template slot-scope="scope">
<el-button
                  type="text"
                  @click.native.prevent="checkcart(scope.row.userInfoId)"
                  >查看购物车</el-button
                >
              </template>
             </el-table-column>
             <el-table-column label="订单管理">
              <template slot-scope="scope">
<el-button
                  type="text"
                  @click.native.prevent="checkorder(scope.row.userInfoId)"
                  >查看订单</el-button
                >
              </template>
             </el-table-column>
            <el-table-column label="操作" width="220">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  @click.native.prevent="userCheck(scope.row)"
                  >查看</el-button
                >
                <el-button
                  type="text"
                  @click.native.prevent="updateuser(scope.row)"
                  >编辑</el-button
                >
                <el-button
                  type="text"
                  @click.native.prevent="deleteRow(scope.row)"
                  >{{ scope.row.isDisable == 0 ? "禁用" : "解禁" }}</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="current"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          >
          </el-pagination>
        </template>

        <!-- 弹出框（编辑 添加） -->
        <el-dialog title='添加' :visible.sync="userform">
          <el-form
            :model="rowdata"
            :rules="formrules"
            size="small"
            ref="userform"
          >
            <el-form-item label="用户昵称" prop="roleName">
              <el-input v-model="rowdata.nickname"></el-input>
            </el-form-item>
            <el-form-item label="用户角色" prop="roleLabel">
              <el-select style="width: 100%;" v-model="rowdata.role" multiple placeholder="请选择">
    <el-option
      v-for="item in roletree"
      :key="item.id"
      :label="item.roleName"
      :value="item.id">
    </el-option>
  </el-select>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="userform = false">取 消</el-button>
            <el-button type="primary" @click="send(rowdata)">确 定</el-button>
          </div>
        </el-dialog>
        <!-- 查看 -->
        <el-dialog title="查看" :visible.sync="usercheck">
          <el-descriptions :border="true" :column="1">
            <el-descriptions-item label="用户ID">
              {{ rowdata.userInfoId }}
            </el-descriptions-item>
            <el-descriptions-item label="用户名">
              {{ rowdata.nickname }}
            </el-descriptions-item>
            <el-descriptions-item label="用户角色">
              {{ rowdata.role }}
            </el-descriptions-item>
            <el-descriptions-item label="ip">
              {{ rowdata.ipAddress }}
            </el-descriptions-item>
            <el-descriptions-item label="ip属地">
              {{ rowdata.ipSource }}
            </el-descriptions-item>
            <el-descriptions-item label="创建时间">
              {{ rowdata.createTime }}
            </el-descriptions-item>
            <el-descriptions-item label="上次登录">
              {{ rowdata.lastLoginTime }}
            </el-descriptions-item>
          </el-descriptions>
        </el-dialog>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import {
  getList,
  banUser,
  getUserByname,
  updateUserMsg
} from "@/api/setup/users";
import {
  getRoleTree,
} from "@/api/authority/role";
import { alertMessage } from "@/util/alert";
import { fullscreenToggel } from "@/util/util";
import { mapGetters, mapState } from "vuex";
export default {
  name: "",
  components: {},
  data() {
    return {
      usercheck: false,
      userform: false,
      search:{},
      rowdata: {},
      tableData: [],
      roletree: [], //角色树
      total: 0,
      pagesize: 10,//条数
      current: 1,//页码
      formrules: {
        username: [
          { required: true, message: "请输入账号名", trigger: "blur" },
        ],
        role: [{ required: true, message: "请选择角色", trigger: "blur" }],
        department1: [
          { required: true, message: "请输入部门", trigger: "blur" },
        ],
        introduction: [
          { required: true, message: "请输入职称", trigger: "blur" },
        ],
        displayName: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.onLoad();
  },
  computed: {
    ...mapGetters(["isFullScren", "userInfo", "showFullScren"]),
    ...mapState({
      showFullScren: (state) => state.common.showCollapse,
    }),
  },
  methods: {
        // 动态添加行类名
 tableRowClassName({ row }) {
    if (row.isDisable == 1) {
      return "disable";
    }
  },
    // 一页几条
    handleSizeChange(val) {
      this.pagesize = val;
      this.onLoad();
    },
    // 第几页
    handleCurrentChange(val) {
      this.current = val;
      this.onLoad();
    },
    // 编辑
    updateuser(data){
data.role = []
data.roleList.forEach(element => {
  data.role.push(element.id)
});
this.rowdata = data;
this.$nextTick(() => {
        this.$refs["userform"].clearValidate();
      });
this.userform = true

    },
    // 确定修改
    send(data){
const list = {
  nickname:data.nickname,
  roleIdList:data.role,
  userInfoId:data.userInfoId
}
updateUserMsg(list).then((res) => {
                alertMessage(this, "success", "操作成功!");
                this.onLoad();
              }).catch((err)=>{
alertMessage(this, "error", err);
            });
             this.userform = false
    },
    // 上传用户表
    handleAvatarSuccess(res,file,fileList) {
       if (!res.flag) {
        file.status ="error"
        alertMessage(this, "error",file.name+"上传服务器失败请重新上传");
       }else{
        alertMessage(this, "success",file.name+"上传服务器成功");
        this.onLoad()
       }
      },
      // 上传用户表之前
      uploadexcel() {
        this.$confirm('请确定excel是否为样表样式！', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$refs['upload'].$refs['upload-inner'].handleClick();
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消上传'
          });          
        });
      },
    // 查看用户信息
    userCheck(item) {
     if (item.createTime) item.createTime= item.createTime.split("T")[0]
     if (item.lastLoginTime) item.lastLoginTime= item.lastLoginTime.split("T")[0]
     
     item.role = ''
     item.roleList.forEach(el => {
      item.role =el.roleName+","+item.role
     });
      this.rowdata = item;
      this.usercheck = true;
    },
    // 查看用户积分
    checkintegral(id){
this.$router.push({path:"/pshop/integral",query:{id}})
    },
    // 查看用户地址
    checkaddress(id){
this.$router.push({path:"/pshop/address",query:{id}})
    },
    // 查看用户购物车
    checkcart(id){
this.$router.push({path:"/pshop/cart",query:{id}})
    },
    // 查看用户订单
    checkorder(id){
this.$router.push({path:"/pshop/order",query:{id}})
    },
    // 禁用用户信息
    deleteRow(row) {
      if (row.isDisable==0) {
        row.isDisable=1
      }else{
        row.isDisable=0
      }
      const prompt = row.isDisable==0 ? "确定要禁用吗？" : "确定要解封吗？";
      this.$confirm(prompt, this.$t("tip"), {
        confirmButtonText: this.$t("submitText"),
        cancelButtonText: this.$t("cancelText"),
        type: "warning",
      })
        .then(() => {
            banUser(row.userInfoId,row.isDisable).then((res) => {
                alertMessage(this, "success", "操作成功!");
                this.onLoad();
              }).catch((err)=>{
alertMessage(this, "error", err);
            });
        })
        .catch(() => {});
    },
    // 查询用户
    searchbtn() {
      if (this.search) {
        const data ={
size:this.pagesize,
current:this.current,
keywords:this.search.name,
userInfoId:this.search.id
        }
        getUserByname(data).then((res) => {
          const data = res.data.data;
          this.tableData = data.recordList;
          this.total = data.count;
        });
      }
      else {
        alertMessage(this, "error", "请重新输入");
      }
    },
    // 刷新
    reset() {
      this.search= {};
      this.onLoad();
    },
    // 进入加载
    onLoad() {
      const pagesize = this.pagesize;
      const current = this.current;
      getList(pagesize, current).then((res) => {
        const data = res.data.data;
        this.tableData = data.recordList;
      this.total = data.count;
      });
      getRoleTree().then((res) => {
        const data = res.data.data;
        this.roletree = data.recordList;
    
      });
    },
    // 全屏
    fullScren() {
      fullscreenToggel();
    },
  },
};
</script>
<style lang='scss' scoped>
@import "@/assets/style/index/hometable.scss";
.addbtn{
  .el-button{
    margin: 0 5px;
    
  }
  :deep(.upload-demo) {
    align-items: center;
    display: flex;
  }
}
</style>