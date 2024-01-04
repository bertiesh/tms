<template>
  <div class="index">
    <el-container>
      <!-- 搜索框 -->
      <el-header>
        <div class="olog-inpt">
          <span>菜单名称：</span>
          <el-input
            placeholder="请输入内容"
            v-model="search.name"
            size="small"
            clearable
          >
          </el-input>
          <span>菜单路由：</span>
          <el-input
            placeholder="请输入内容"
            v-model="search.path"
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
          <el-button
            type="primary"
            icon="iconfont icon-sousuo"
            @click="searchbtn"
            >搜索</el-button
          >
          <el-button type="primary" icon="iconfont icon-shuaxin" @click="reset"
            >刷新</el-button
          >
        </div>
      </el-header>
      <el-main>
        <template>
          <!-- 添加按钮 -->
          <el-button
            type="primary"
            icon="iconfont icon-icon_tianjia"
            @click.native.prevent="addUser()"
            >添加</el-button
          >
          <!-- 表格 -->
          <el-table
            :data="tableData"
            :header-cell-style="{ 'text-align': 'center' }"
            row-key="id"
            :cell-style="{ 'text-align': 'center', padding: '8px' }"
            :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
            :row-class-name="tableRowClassName"
          >
            <el-table-column type="index" label="序号" width="80">
            </el-table-column>
            <el-table-column prop="name" label="菜单名称"> </el-table-column>
            <el-table-column prop="path" label="路由地址"> </el-table-column>
            <el-table-column prop="icon" label="菜单图标" width="70">
              <template slot-scope="scope">
                <i :class="scope.row.icon"></i>
              </template>
            </el-table-column>
            <el-table-column prop="orderNum" label="菜单排序"> </el-table-column>
            <el-table-column label="操作" width="280">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  @click.native.prevent="userCheck(scope.row)"
                  :disabled="scope.row.isDisable == 1"
                  >查看</el-button
                >
                <el-button
                  type="text"
                  @click.native.prevent="userUpdate(scope.row)"
                  :disabled="scope.row.isDisable == 1"
                  >编辑</el-button
                >
                <el-button
                  type="text"
                  @click.native.prevent="deleteRow(scope.row)"
                  :disabled="scope.row.isDisable == 1"
                  >删除</el-button
                >
                <el-button
                  type="text"
                  @click.native.prevent="addSon(scope.row)"
                  :disabled="scope.row.isDisable == 1"
                  >增加子项</el-button
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
            <el-form-item label="菜单名称" prop="name">
              <el-input
                v-model="rowdata.name"
                placeholder="请输入菜单名称"
              ></el-input>
            </el-form-item>
            <el-form-item label="路由地址" prop="path">
              <el-input
                v-model="rowdata.path"
                placeholder="请输入路由地址"
              ></el-input>
            </el-form-item>
            <el-form-item label="上级菜单">
              <TreeSelect
                :value="isaddson ? rowdata.id : rowdata.parentId"
                placeholder="请选择上级菜单"
                :options="tableData"
                :disabled="isaddson||rowdata.parentId==0"
                @getValue="getValue($event)"
                style="width: 200px"
                v-if="userform"
              />
            </el-form-item>
            <el-form-item label="菜单图标" prop="icon">
              <el-input
                v-model.lazy="rowdata.icon"
                @focus="innerVisible = true"
                placeholder="请输入菜单图标"
                style="width: 200px"
                clearable
              >
                <template slot="append"
                  ><i :class="rowdata.icon"></i
                ></template>
              </el-input>
            </el-form-item>
            <el-form-item label="菜单排序" prop="orderNum">
              <el-input-number
                v-model="rowdata.orderNum"
                controls-position="right"
                style="width: 200px"
              ></el-input-number>
            </el-form-item>
            <el-form-item label="导航路由" prop="isHidden">
             <el-radio-group v-model="rowdata.isHidden" style="width: 200px">
      <el-radio :label="0">是</el-radio>
      <el-radio :label="1">否</el-radio>
      默认为是
    </el-radio-group>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="userform = false">取 消</el-button>
            <el-button type="primary" @click="send(rowdata)">确 定</el-button>
          </div>
        </el-dialog>
        <!-- 菜单图标 -->
        <el-dialog title="菜单图标" :visible.sync="innerVisible">
          <el-tabs v-model="activeName">
            <el-tab-pane
              :label="item.label"
              :name="item.label"
              v-for="(item, index) in iconList"
              :key="index"
            >
              <div
                v-for="(items, index) in item.list"
                :key="index"
                @click="selecticon(items)"
                class="selecticon"
              >
                <i :class="items"></i>
                <span>{{ items }}</span>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-dialog>
        <!-- 查看 -->
        <el-dialog title="查看" :visible.sync="usercheck">
          <el-descriptions :border="true" :column="1">
            <el-descriptions-item label="菜单名称">
              {{ rowdata.name }}
            </el-descriptions-item>
            <el-descriptions-item label="路由地址">
              {{ rowdata.path }}
            </el-descriptions-item>
            <el-descriptions-item label="菜单图标">
              {{ rowdata.icon }}
            </el-descriptions-item>
            <el-descriptions-item label="创建时间">
              {{rowdata.createTime}}
            </el-descriptions-item>
          </el-descriptions>
        </el-dialog>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import {
  getMenuList,
  addMenu,
  deleteMenu,
  getMenuByPath,
  getMenuByName,
} from "@/api/setup/menu";
import iconList from "@/config/iconList";
import { alertMessage } from "@/util/alert";
import { dateFormat } from "@/util/date";
import { fullscreenToggel } from "@/util/util";
import { mapGetters, mapState } from "vuex";
import TreeSelect from "@/components/TreeSelect.vue";
export default {
  name: "",
  components: { TreeSelect },
  data() {
    var validatePass2 = (rule, value, callback) => {
        if (this.rowdata.icon!='') {
            callback();
        }else{
            callback(new Error('请上传文档封面'));
        }
      };
    return {
      iconList: iconList,
      activeName: "通用图标",
      innerVisible: false,
      usercheck: false,
      userform: false,
      isadd: true,
      isaddson: false,
      search: {},
      rowdata: {},
      tableData: [],
      formrules: {
        name: [{ required: true, message: "请输入菜单名称", trigger: "blur" }],
        path: [{ required: true, message: "请输入路由地址", trigger: "blur" }],
        orderNum: [
          { required: true, message: "请选择菜单序号", trigger: "blur" },
        ],
        icon:[{validator: validatePass2,trigger: "blur" }],
      },
      icon: "",
    };
  },
  created() {
    this.onLoad();
  },
  computed: {
    ...mapGetters(["isFullScren","showFullScren"]),
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
    // 清楚表单验证
    clearformValidate() {
      this.$nextTick(() => {
        this.$refs["userform"].clearValidate();
      });
    },
    // 编辑表单确定按钮
    send(data) {
        this.$refs.userform.validate((valid) => {
          if (valid) {
            if (this.isadd) {
              if (data.id) {
                data.parentId = data.id;
               delete data.id
              }
              addMenu(data).then(
                (res) => {
                  this.onLoad();
                  alertMessage(this, "success", "添加菜单成功!");
                },
                (error) => {
                  alertMessage(this, "error",'添加菜单失败');
                }
              );
            } else {
              const time = dateFormat(new Date());
              data.createTime = time
              if (data.parentId == 0) data.parentId = null;
              addMenu(data).then(
                (res) => {
                  if (res.status == 200) {
                    this.onLoad();
                    alertMessage(this, "success", "修改信息成功!");
                  } else {
                    alertMessage(this, "error", "修改信息出错!");
                  }
                },
                (error) => {
                  alertMessage(this, "error", "修改信息出错!");
                }
              );
            }
            this.userform = false;
          }
        });
    },
    // 添加用户信息
    addUser() {
      this.rowdata = {};
      this.clearformValidate();
      this.userform = true;
      this.isadd = true;
      this.isaddson = false;
    },
    // 添加子项
    addSon(data) {
      this.rowdata = {};
      this.clearformValidate();
      this.rowdata.id = data.id;
      this.userform = true;
      this.isadd = true;
      this.isaddson = true;
    },
    // 查看用户信息
    userCheck(item) {
      if (item.parentId == null) item.parentId = "";
     item.createTime= item.createTime.split("T")[0]
     
      this.rowdata = item;
      this.usercheck = true;
    },
    // 编辑用户信息
    userUpdate(item) {
      if (item.parentId == null) item.parentId = 0;
      this.rowdata = item;
      this.userform = true;
      this.clearformValidate();
      this.isadd = false;
      this.isaddson = false;
    },
    // 删除信息
    deleteRow(row) {
        this.$confirm("确定要删除吗？", this.$t("tip"), {
          confirmButtonText: this.$t("submitText"),
          cancelButtonText: this.$t("cancelText"),
          type: "warning",
        })
          .then(() => {
           deleteMenu(row.id).then(
            (res) => {
              alertMessage(this, "success", "删除信息成功!");
              this.onLoad();
            }
          ).catch((err) => {
            alertMessage(this, "error", err);
          });

          })
          .catch(() => {});
    },
    // 查询用户
    searchbtn() {
        if (this.search.name) {
          getMenuByName(this.search.name).then((res) => {
            const data = res.data.data;
            this.tableData = data;
            this.total = data.length;
          });
        } else if (this.search.path) {
          getMenuByPath(this.search.path).then((res) => {
            const data = res.data.data;
            this.tableData = data;
            this.total = data.total;
          });
        } else {
          alertMessage(this, "error", "请重新输入");
        }
    },
    // 获取图标
    selecticon(item) {
      this.innerVisible = false;
      this.rowdata.icon = item;
    },
    // 接受子组件treeselect值
    getValue(value) {
      this.rowdata.parentId = value;
    },
    // 刷新
    reset() {
      this.search = {};
      this.onLoad();
    },
    // 进入加载
    onLoad() {
      getMenuList().then((res) => {
        const data = res.data.data;
        this.tableData = data;
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
::v-deep.el-tab-pane {
  display: flex;
  flex-wrap: wrap;
  .selecticon {
    width: 70px;
    height: 100px;
    margin: 15px;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    transition: all 0.5s;
    span {
      font-size: 8px;
    }
    .iconfont {
      font-size: 30px;
    }
  }
  .selecticon:hover {
    cursor: pointer;
    transform: scale(1.2);
  }
}
</style>