<template>
  <div class="index">
    <el-container>
      <!-- 搜索框 -->
      <el-header>
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
          <el-button type="primary" icon="iconfont icon-shuaxin" @click="reset"
            >刷新</el-button
          >
        </div>
      </el-header>
      <el-main>
        <template>
          <div class="main-btn">
            <el-button
              type="primary"
              icon="iconfont icon-icon_tianjia"
              @click.native.prevent="addUser()"
              >添加</el-button
            >
          </div>

          <!-- 表格 -->
          <el-table
            ref="articletable"
            :data="tableData"
            :header-cell-style="{ 'text-align': 'center' }"
            :cell-style="{ 'text-align': 'center', padding: '8px' }"
:row-class-name="tableRowClassName"
          >
            <el-table-column type="index" width="60"></el-table-column>
            <el-table-column prop="name" label="商品型号"></el-table-column>
            <el-table-column prop="receiverName" label="图片">
              <template slot-scope="props">
                <el-image
  style="cursor:pointer;max-height: 80px;"
  lazy
      :src="`/api/photos/display?photoPath=${props.row.picture}`"
      fit="cover"
      @click="magnify(props.row.picture)"
      ></el-image>
              </template>
            </el-table-column>
            <el-table-column prop="weight" label="重量"></el-table-column>
            <el-table-column prop="stock" label="库存"></el-table-column>
            <el-table-column prop="sort" label="排序"></el-table-column>
            <el-table-column prop="points" label="当前积分"></el-table-column>
            <el-table-column prop="price" label="市场价"></el-table-column>
            <el-table-column prop="cost" label="成本价"></el-table-column>
            <el-table-column prop="salesCount" label="销量"></el-table-column>
            <el-table-column label="操作" width="180">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  @click.native.prevent="userUpdate(scope.row)"
                  v-if="scope.row.isDelete == 0"
                  >编辑</el-button
                >
                <el-button
                  type="text"
                  @click.native.prevent="check(scope.row)"
                  >{{ scope.row.isDelete ? "恢复" : "删除" }}</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </template>
        <!-- 弹出框（编辑 添加） -->
        <el-dialog :title="isadd ? '添加' : '编辑'" :visible.sync="userform">
          <el-form
            :model="rowdata"
            :rules="formrules"
            label-width="80px"
            :inline="true"
            size="small"
            ref="userform"
          >
            <el-form-item label="商品型号" prop="name">
              <el-input
                v-model="rowdata.name"
                placeholder="请输入商品型号"
              ></el-input>
            </el-form-item>
             <el-form-item label="商品重量" prop="weight">
              <el-input
                v-model="rowdata.weight"
                placeholder="请输入商品备注"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品库存" prop="stock">
             <el-input
                v-model="rowdata.stock"
                placeholder="请输入商品备注"
              ></el-input>
            </el-form-item>
            <el-form-item label="积分价格" prop="points">
             <el-input
                v-model="rowdata.points"
                placeholder="请输入商品备注"
              ></el-input>
            </el-form-item>
             <el-form-item label="市场价格" prop="price">
             <el-input
                v-model="rowdata.price"
                placeholder="请输入商品备注"
              ></el-input>
            </el-form-item>
             <el-form-item label="成本价" prop="cost">
             <el-input
                v-model="rowdata.cost"
                placeholder="请输入商品备注"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品图片" prop="picture">
             <el-upload
                class="upload-demo"
                action="#"
                multiple
                 :file-list="fileList"
                :auto-upload="false"
                :on-change="handlePreview"
              >
                <el-button>选择图片</el-button>
              </el-upload>
            </el-form-item>
            <el-form-item label="商品排序" prop="sort">
            <el-input-number :min='0' :max='9' size="small" v-model="rowdata.sort"></el-input-number>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="userform = false">取 消</el-button>
            <el-button type="primary" @click="send(rowdata)">确 定</el-button>
          </div>
        </el-dialog>
      </el-main>
    </el-container>
     <!-- 查看图片 -->
<el-dialog
  :visible.sync="dialogVisible"
  >
<el-image
      :src="`/api/photos/display?photoPath=${imgrul}`"
      fit="cover"></el-image>
</el-dialog>
  </div>
</template>

<script>
import { getAllGoodsList,addGoodsImg,addGoodsSize } from "@/api/pshop/goods";
import { alertMessage } from "@/util/alert";
import { fullscreenToggel } from "@/util/util";
import { mapGetters, mapState } from "vuex";
export default {
  name: "",
  components: {},
  data() {
    var validatePass2 = (rule, value, callback) => {

        if (this.fileList.length!=0) {
if (this.rowdata.picture) {
  callback()
}else{
            callback(new Error('请上传文档封面'));
        }
        }else{
            callback(new Error('请选择文档封面'));
        }
      };
    return {
      userform: false,
      isadd: true,
      search: {}, //用户搜索字段
      rowdata: {}, //查看字段
      tableData: [], //表格数据
      fileList: [], //图片地址
      dialogVisible:false,//大图片弹窗
      imgrul:'',//图片地址（放大后）
      isDelete: 0, //是否删除
      formrules: {
        name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
        ],
        weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" },
        ],
        stock: [
          { required: true, message: "请输入商品库存", trigger: "blur" },
        ],
        points: [
          { required: true, message: "请输入商品价格", trigger: "blur" },
        ],
        price: [
          { required: true, message: "请输入市场价格", trigger: "blur" },
        ],
        cost: [
          { required: true, message: "请输入成本价", trigger: "blur" },
        ],
        sort: [
          { required: true, message: "请选择商品排序", trigger: "blur" },
        ],
        picture: [
          {validator: validatePass2, required: true, trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.onLoad();
  },
   watch: {
    $route(to, from) {
     if (to.query.id!=from.query.id) this.onLoad()
    },
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
      if (row.isDelete) {
        return "disable";
      }
    },
    // 放大图片
    magnify(url){
        this.imgrul = url
        this.dialogVisible = true
    },
    // 编辑用户信息
    userUpdate(item) {
      this.rowdata = item;
        this.fileList[0] = { name: item.picture };
      this.$nextTick(() => {
        this.$refs["userform"].clearValidate();
      });
      this.userform = true;
      this.isadd = false;
    },
    // 添加用户信息
    addUser() {
      this.rowdata = {};
      this.$nextTick(() => {
        this.$refs["userform"].clearValidate();
      });
      this.userform = true;
      this.isadd = true;
    },
    // 上传文档封面之前
      handlePreview(file,fileList) {
        this.fileList = fileList
      },
      // 上传商品
      update(data){
        data.spuId = this.$route.query.id*1
addGoodsSize(data).then((res)=>{
  this.$message({
          message: this.isadd?'添加商品成功':'编辑商品成功',
          type: 'success'
        });
        this.onLoad();
  }).catch((err) => {
              alertMessage(this, "error", err);
            });
      },
    // 确定选框
     send(data) {
      this.$refs.userform.validate((valid) => {
        if (valid) {
          // 创建一个序列化表单
          let imagelist =new FormData()
          // 处理文件队列中的文件将待上传文件加入序列化表单
this.fileList.forEach((element) => {
   if (element.status=="ready")imagelist.append("file", element.raw)
})
// 判断是否有文件需要上传
if (imagelist.getAll('file').length!=0) {
  addGoodsImg(imagelist).then((res)=>{
  this.$message({
          message: '文件上传服务器成功',
          type: 'success'
        });
        data.picture = res.data.data[0]
        this.update(data)
}).catch((err) => {
              alertMessage(this, "error", err);
            });
}else{
  this.update(data)
}
          this.userform = false;
        }
      });
    },
    //恢复
    check(row) {
      this.$confirm("确定吗？", this.$t("tip"), {
        confirmButtonText: this.$t("submitText"),
        cancelButtonText: this.$t("cancelText"),
        type: "warning",
      })
        .then(() => {
          row.isDelete = this.isDelete == 0 ? 1 : 0;
          addGoodsSize(row)
            .then((res) => {
              alertMessage(this, "success", "操作成功!");
              this.onLoad();
            })
            .catch((err) => {
              alertMessage(this, "error", err);
            });
        })
        .catch(() => {

        });
    },
    // 查询用户
    searchbtn(value) {
      if (value) {
        this.getArticle();
      } else {
        alertMessage(this, "error", "请重新输入");
      }
    },
    // 刷新
    reset() {
      this.search = {};
      this.onLoad();
    },
    // 获取题目列表
    getArticle() {
      const dataobj = {
        isDelete: this.isDelete,
        spuId:this.$route.query.id
      };
      // 获取题目列表
      getAllGoodsList(dataobj).then((res) => {
        const data = res.data.data;
        if (data.recordList) this.tableData = data.recordList[0].skuBackDTOList;
        
      });
    },
    // 进入加载
    onLoad() {
      this.getArticle();
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
.main-btn {
  display: flex;
  .el-button {
    margin-right: 10px;
  }
}
</style>