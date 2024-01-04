<template>
  <div class="index">
    <el-container>
      <!-- 搜索框 -->
      <el-header>
        <div class="olog-inpt">
          <span>订单名称：</span>
          <el-input
            placeholder="请输入订单名称"
            v-model="search.keywords"
            size="small"
            clearable
          >
          </el-input>
          <span>订单状态：</span>
          <el-select
            v-model="search.status"
            placeholder="请选择订单状态"
            size="small"
          >
            <el-option label="待发货" :value="1"> </el-option>
            <el-option label="待收货" :value="2"> </el-option>
            <el-option label="已完成" :value="3"> </el-option>
            <el-option label="已关闭" :value="4"> </el-option>
          </el-select>
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
          <el-button
            type="primary"
            icon="iconfont icon-sousuo"
            @click="searchbtn(search)"
            >搜索</el-button
          >
          <el-button type="primary" icon="iconfont icon-shuaxin" @click="reset"
            >刷新</el-button
          >
          <el-button type="primary" @click="alldelete">{{
            isDelete ? "所有商品" : "垃圾桶"
          }}</el-button>
        </div>
      </el-header>
      <el-main>
        <template>
          <!-- 表格 -->
          <el-table
            ref="articletable"
            :data="tableData"
            :header-cell-style="{ 'text-align': 'center' }"
            :cell-style="{ 'text-align': 'center', padding: '8px' }"
          >
            <el-table-column type="selection" width="60"> </el-table-column>
            <el-table-column prop="orderCode" label="订单编号">
            </el-table-column>
            <el-table-column
              prop="userAddressDTO.receiverName"
              label="收件人姓名"
            >
            </el-table-column>
            <el-table-column prop="totalPoints" label="支付积分">
            </el-table-column>
            <el-table-column prop="status" label="订单状态">
              <template slot-scope="scope">
                <el-dropdown trigger="click" @command="handleCommand">
                  <span class="el-dropdown-link">
                    {{ scope.row.status == 1 ? "待发货" : "" }}
                    {{ scope.row.status == 2 ? "待收货" : "" }}
                    {{ scope.row.status == 3 ? "已完成" : "" }}
                    {{ scope.row.status == 4 ? "已关闭" : "" }}
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item :command="{status:2,row:scope.row,}" v-if=" scope.row.status == 1">去发货</el-dropdown-item>
                    <el-dropdown-item :command="{status:2,row:scope.row}" v-if=" scope.row.status == 2">添加快递</el-dropdown-item>
                    <el-dropdown-item :command="{status:4,row:scope.row}" v-if=" scope.row.status != 4">关闭订单</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="220" v-if="isDelete == 0">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  @click.native.prevent="userCheck(scope.row)"
                  >查看</el-button
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
        <el-dialog title="填写快递单号" :visible.sync="userform">
          <el-table
            ref="articletable"
            :data="rowdata.freights"
            :header-cell-style="{ background:'#f5f7fa','text-align': 'center' }"
            :cell-style="{ 'text-align': 'center', padding: '8px' }"
          >
           <el-table-column type="index" width="60"> </el-table-column>
            <el-table-column label="物流信息">
              <template slot-scope="scope">
<el-form
            :model="scope.row"
            :rules="formrules"
            label-width="80px"
            :inline="true"
            size="small"
            ref="userform"
          >
            <el-form-item label="快递公司" prop="freightBrand">
              <el-input
                v-model="scope.row.freightBrand"
                placeholder="请输入快递公司"
              ></el-input>
            </el-form-item>
            <el-form-item label="快递单号" prop="freightCode">
              <el-input
                v-model="scope.row.freightCode"
                placeholder="请输入快递单号"
              ></el-input>
            </el-form-item>
            <el-form-item label="价格" prop="price">
              <el-input-number style="width: 100%;" v-model="scope.row.price" :precision="2" :step="0.1" :min="0"></el-input-number>
            </el-form-item>
          </el-form>
              </template>
            </el-table-column>
          </el-table>
          <div slot="footer" class="dialog-footer">
            <el-button @click="addexpressage" v-if="!dialogVisible">增加一条</el-button>
            <el-button @click="userform = false">取 消</el-button>
            <el-button type="primary" @click="send(rowdata)">确 定</el-button>
          </div>
        </el-dialog>
      </el-main>
    </el-container>
    <!-- 查看 -->
    <el-dialog width='80%' :visible.sync="dialogVisible">
      <el-descriptions :border="true" :column="1">
        <el-descriptions-item label="收件人信息">
          <el-descriptions :column="1">
            <el-descriptions-item label="收件人姓名">
              {{ addressdata.receiverName }}
            </el-descriptions-item>
            <el-descriptions-item label="收件人手机号">
              {{ addressdata.phone }}
            </el-descriptions-item>
            <el-descriptions-item label="邮编">
              {{ addressdata.postalCode }}
            </el-descriptions-item>
            <el-descriptions-item label="地址">
              {{ addressdata.address }}
            </el-descriptions-item>
            <el-descriptions-item label="详细地址">
              {{ addressdata.detailAddress }}
            </el-descriptions-item>
          </el-descriptions>
        </el-descriptions-item>
        <el-descriptions-item label="商品列表">
          <el-table
            ref="articletable"
            :data="rowdata.orderItemList"
            :header-cell-style="{ 'text-align': 'center' }"
            :cell-style="{ 'text-align': 'center', padding: '8px' }"
          >
            <el-table-column type="index" width="60"></el-table-column>
            <el-table-column prop="name" label="商品名称"></el-table-column>
            <el-table-column prop="skuName" label="商品型号"></el-table-column>
            <el-table-column label="商品图片">
              <template slot-scope="props">
                <el-image
                  style="cursor: pointer; max-height: 80px"
                  lazy
                  :src="`/api/photos/display?photoPath=${props.row.picture}`"
                  fit="cover"
                ></el-image>
              </template>
            </el-table-column>
            <el-table-column prop="num" label="数量"></el-table-column>
            <el-table-column prop="points" label="积分"></el-table-column>
          </el-table>
        </el-descriptions-item>
        <el-descriptions-item label="物流信息" v-if="rowdata.freights != null">
          <el-table
            ref="articletable"
            :data="rowdata.freights"
            :header-cell-style="{ 'text-align': 'center' }"
            :cell-style="{ 'text-align': 'center', padding: '8px' }"
          >
            <el-table-column type="index" width="60"></el-table-column>
            <el-table-column
              prop="freightBrand"
              label="快递公司"
            ></el-table-column>
            <el-table-column
              prop="freightCode"
              label="快递单号"
            ></el-table-column>
            <el-table-column
              prop="createTime"
              label="创建时间"
            ></el-table-column>
            <el-table-column label="操作" width="220" v-if="isDelete == 0">
              <template slot-scope="scope">
                 <el-button type="text" @click.native.prevent="check(scope.row)"
                  >删除</el-button
                ></template
              ></el-table-column
            >
          </el-table>
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
    <!-- 积分补偿表格 -->
    <el-dialog :visible.sync="pointform" width="35%">
       <template slot="title">
      
      <span style="font-size: 24px;"> 提示</span>
        <div class="title"><i class="el-icon-warning"></i> 确定要关闭订单吗？</div>
       </template>
<el-form
            :model="pointdata"
            :rules="pointrules"
            :inline="true"
            size="small"
            ref="pointform"
            v-if="closegood"
            label-width="80px"
          >
          <el-form-item label="积分补偿" prop="issure">
              <el-radio-group
                v-model="pointdata.issure"
              >
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="积分" prop="points" v-if="pointdata.issure">
              <el-input-number v-model="pointdata.points" :min="0"></el-input-number>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="pointform= closegood = false">取 消</el-button>
            <el-button type="primary" @click="openpoint(pointdata)">确 定</el-button>
          </div>
        </el-dialog>
  </div>
</template>

<script>
import { getAllOrderList,updateOrderList } from "@/api/pshop/order";
import { addUserIntegral } from "@/api/pshop/integral";
import { alertMessage } from "@/util/alert";
import { fullscreenToggel } from "@/util/util";
import { mapGetters, mapState } from "vuex";
export default {
  name: "",
  components: {},
  data() {
    return {
      userform: false,//添加快递单号
      pointform:false,//积分补偿弹窗
      search: {}, //用户搜索字段
      rowdata: {}, //查看字段
      addressdata: {}, //收件地址
      logisticsdata:{},
      pointdata:{},//积分补偿数据
      tableData: [], //表格数据
      fileList: [], //图片地址
      dialogVisible: false, //查看弹窗
      closegood:false,//积分补偿表格
      total: 0,
      pagesize: 10, //条数
      current: 1, //页码
      isDelete: 0, //是否删除
      formrules: {
        freightBrand: [{ required: true, message: "请输入快递公司", trigger: "blur" }],
        freightCode: [
          { required: true, message: "请输入快递编号", trigger: "blur" },
        ],
         price: [
          { required: true, message: "请输入快递价格", trigger: "blur" },
        ],
      },
      pointrules:{
        issure: [{ required: true, message: "请选择是否补偿积分", trigger: "blur" }],
        points: [{ required: true, message: "请输入积分", trigger: "blur" }],
      }
    };
  },
  created() {
    this.onLoad();
  },
  watch: {
    $route(to, from) {
      if (to.query.id != from.query.id) this.onLoad();
    },
  },
  computed: {
    ...mapGetters(["isFullScren", "userInfo", "showFullScren"]),
    ...mapState({
      showFullScren: (state) => state.common.showCollapse,
    }),
  },
  methods: {
    // 查看删除的文件
    alldelete() {
      (this.isDelete = this.isDelete == 0 ? 1 : 0), this.onLoad();
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
    // 查看用户信息
    userCheck(item) {
      this.rowdata = item;
      this.addressdata = item.userAddressDTO;
      this.addressdata.address =
        item.userAddressDTO.region.provinceName +
        "-" +
        item.userAddressDTO.region.cityName +
        "-" +
        item.userAddressDTO.region.districtName;
      this.dialogVisible = true;
    },
    // 订单状态选项
    handleCommand(command) {
      this.logisticsdata = command.row
      if (command.status==2) {
        this.rowdata.status = command.status
        this.rowdata.id = command.row.id
        this.rowdata.freights=[{
          freightBrand:'',
          freightCode:'',
          price:0.00
          }]
        this.userform = true;
      }else if (command.status==4) {
        this.rowdata.status = command.status
        this.rowdata.id = command.row.id
        this.pointform = true
      }
    },
    // 关闭订单
    openpoint(data){       
      data.points = this.logisticsdata.totalPoints
      if (this.closegood) {
        data.userId = this.logisticsdata.userId
        data.event = '订单关闭'
        this.$refs.pointform.validate((valid) => {
        if (valid) {
addUserIntegral(data)
              .then((res) => {
                alertMessage(this, "success", "积分补偿成功");
                this.pointform = false
              })
              .catch((err) => {
                alertMessage(this, "error", err);
              });
        }
        })
      }else{
        this.closegood = true;
        updateOrderList(this.rowdata)
            .then((res) => {
              alertMessage(this, "success", "订单关闭成功!");
              this.onLoad();
            })
            .catch((err) => {
              alertMessage(this, "error", err);
            });
      }
    },
    // 再加一条物流单号
    addexpressage(){
      this.rowdata.freights.push({
          freightBrand:'',
          freightCode:'',
          price:0.00
          })
    
    },
    // 确定选框
    send(data) {
      // 添加快递时
      if (this.logisticsdata.freights!=null) data.freights= data.freights.concat(this.logisticsdata.freights)
      this.$refs.userform.validate((valid) => {
        if (valid) {
          // 创建一个序列化表单
          updateOrderList(data)
            .then((res) => {
              this.$message({
                message: "添加快递成功",
                type: "success",
              });
              this.onLoad();
            })
            .catch((err) => {
              alertMessage(this, "error", err);
            });
          this.userform = false;
        }
      });
    },
    //恢复
    check(row) {
row.isDelete=1
      this.$confirm("确定删除吗？", this.$t("tip"), {
        confirmButtonText: this.$t("submitText"),
        cancelButtonText: this.$t("cancelText"),
        type: "warning",
      })
        .then(() => {
          updateOrderList(this.rowdata)
            .then((res) => {
              alertMessage(this, "success", "操作成功!");
              this.dialogVisible = false;
              this.onLoad();
            })
            .catch((err) => {
              alertMessage(this, "error", err);
            });
        })
        .catch(() => {});
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
        size: this.pagesize,
        current: this.current,
        keywords: this.search.keywords,
        isDelete: this.isDelete,
        status: this.search.status,
        userInfoId: this.$route.query.id,
      };
      // 获取题目列表
      getAllOrderList(dataobj).then((res) => {
        const data = res.data.data;
        this.tableData = data.recordList;
        this.total = data.count;
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
.el-dropdown .el-dropdown-link {
  color: #409eff;
  cursor: pointer;
}
.el-dialog {
  .el-form {
    display: flex;
    flex-direction: column;
    :deep(.el-form-item__content) {
      width: 80%;
    }
  }
  .el-icon-warning{
    color: #e6a23c;
    font-size: 24px;
  }
  .title{
    padding-top: 20px;
    text-align: center;
    font-size: 20px;
  }
}
</style>