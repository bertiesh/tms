<template>
  <div class="index">
    <el-container>
      <!-- 搜索框 -->
      <el-header>
        <div class="olog-inpt">
          <span>菜单名称：</span>
          <el-input
            placeholder="请输入内容"
            v-model="search.keywords"
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
            >添加模块</el-button
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
            <el-table-column prop="resourceName" label="接口名称">
            </el-table-column>
            <el-table-column prop="isAnonymous" label="匿名访问">
              <template slot-scope="scope">
                {{scope.row.isAnonymous?'允许':"禁止"}}
              </template>
            </el-table-column>
            <el-table-column label="接口地址"
              ><template slot-scope="scope">
                {{scope.row.url?scope.row.url:"——"}}
              </template>
            </el-table-column>
            <el-table-column label="请求方式">
              <template slot-scope="scope">
                {{scope.row.requestMethod?scope.row.requestMethod:"——"}}
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间">
            </el-table-column>
            <el-table-column label="操作" width="280">
              <template slot-scope="scope">
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
                  >增加接口</el-button
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
            <el-form-item prop="resourceName" :label="isadd?'模块名称':'接口名称'">
              <el-input
                v-model="rowdata.resourceName"
                placeholder="请输入接口名称"
              ></el-input>
            </el-form-item>
            <el-form-item label="接口地址" prop="url" v-if="isaddson||rowdata.parentId">
              <el-input
                v-model="rowdata.url"
                placeholder="请输入接口地址"
              ></el-input>
            </el-form-item>
            <el-form-item label="请求方式" prop="requestMethod" v-if="isaddson||rowdata.parentId">
              <el-select
                v-model="rowdata.requestMethod"
                placeholder="请输入接口地址"
              >
              <el-option
      value="GET">
    </el-option>
    <el-option
      value="POST">
    </el-option>
    <el-option
      value="PUT">
    </el-option>
    <el-option
      value="DELETE">
    </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="上级接口" v-if="isaddson||rowdata.parentId">
              <TreeSelect
                :value="isaddson ? rowdata.id : rowdata.parentId"
                placeholder="请选择上级菜单"
                :options="tableData"
                :props='{
                  value: "id", // ID字段名
          label: "resourceName", // 显示名称
          children: "children", // 子级字段名
                }'
                :disabled="isaddson || rowdata.parentId == 0"
                @getValue="getValue($event)"
                style="width: 200px"
                v-if="userform"
              />
            </el-form-item>
             <el-form-item label="匿名访问"  prop="isAnonymous">
             <el-radio-group v-model="rowdata.isAnonymous" style="width: 200px">
      <el-radio :label="1">允许</el-radio>
      <el-radio :label="0">禁止</el-radio>
      默认为是
    </el-radio-group>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="userform = false">取 消</el-button>
            <el-button type="primary" @click="send(rowdata)">确 定</el-button>
          </div>
        </el-dialog>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { getResourcesList,addResource,deleteResource } from "@/api/setup/resource";
import { alertMessage } from "@/util/alert";
import { fullscreenToggel } from "@/util/util";
import { mapGetters, mapState } from "vuex";
import TreeSelect from "@/components/TreeSelect.vue";
export default {
  name: "",
  components: { TreeSelect },
  data() {
    return {
      userform: false,
      isadd: true,
      isaddson: false,
      search: {},
      rowdata: {},
      tableData: [],
      formrules: {
        resourceName: [{ required: true, message: "请输入菜单名称", trigger: "blur" }],
        requestMethod: [{ required: true, message: "请输入路由地址", trigger: "blur" }],
        url: [
          { required: true, message: "请选择菜单序号", trigger: "blur" },
        ],
        isAnonymous: [{ message: "请选择菜单序号",required: true, trigger: "blur" }],
      },
    };
  },
  created() {
    this.onLoad();
  },
  computed: {
    ...mapGetters(["isFullScren", "showFullScren"]),
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
              delete data.id;
            }
            addResource(data).then(
              (res) => {
                this.onLoad();
                alertMessage(this, "success", "添加菜单成功!");
              },
              (error) => {
                alertMessage(this, "error", "添加菜单失败");
              }
            );
          } else {
            if (data.parentId == 0) data.parentId = null;
            addResource(data).then(
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
          deleteResource(row.id).then(
            (res) => {
              alertMessage(this, "success", "删除信息成功!");
              this.onLoad();
            },
            (error) => {
              alertMessage(this, "error", "删除信息出错!");
            }
          );
        })
        .catch(() => {});
    },
    // 查询用户
    searchbtn() {
      if (this.search) {
        this.onLoad();
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
      const data = {
        keywords: this.search.keywords,
      };
      getResourcesList(data).then((res) => {
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