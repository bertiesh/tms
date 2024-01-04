<template>
  <div class="index">
    <el-container>
      <el-main>
        <template>
          <!-- 添加按钮 -->
          <el-button
            type="primary"
            icon="iconfont icon-icon_tianjia"
            @click.native.prevent="addUser()"
            >添加</el-button
          >
          <el-button type="primary" icon="iconfont icon-shuaxin" @click="reset"
            >刷新</el-button
          >
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
          <!-- 权限设置 -->
          <!-- 表格 -->
          <el-table
            :data="tableData"
            :header-cell-style="{ 'text-align': 'center' }"
            :cell-style="{ 'text-align': 'center', padding: '8px' }"
            :row-class-name="tableRowClassName"
          >
            <el-table-column type="index" label="序号" width="50">
            </el-table-column>
            <el-table-column prop="roleName" label="角色名称">
            </el-table-column>
            <el-table-column prop="roleLabel" label="角色描述">
            </el-table-column>
            <el-table-column label="操作" width="260">
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
                  @click.native.prevent="roleAction(scope.row)"
                  :disabled="scope.row.isDisable == 1"
                  >权限</el-button
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
            size="small"
            ref="userform"
          >
            <el-form-item label="角色名称" prop="roleName">
              <el-input v-model="rowdata.roleName"></el-input>
            </el-form-item>
            <el-form-item label="角色描述" prop="roleLabel">
              <el-input
                v-model="rowdata.roleLabel"
                type="text"
                maxlength="50"
                show-word-limit
              ></el-input>
            </el-form-item>
            <el-form-item label="禁用菜单" v-show="!isadd">
             <el-radio-group v-model="rowdata.isDisable">
      <el-radio label="是"></el-radio>
      <el-radio label="否"></el-radio>
    </el-radio-group>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="userform = false">取 消</el-button>
            <el-button type="primary" @click="send(rowdata)">确 定</el-button>
          </div>
        </el-dialog>
        <!-- 弹出框（权限） -->
        <el-dialog title="角色权限" :visible.sync="roleaction">
          <el-tabs v-model="activeName">
            <el-tab-pane label="菜单权限" name="first">
              <el-tree
                :data="menu"
                :props="{ label: 'name' }"
                show-checkbox
                node-key="id"
                ref="menutree"
                highlight-current
              >
              </el-tree>
            </el-tab-pane>
             <el-tab-pane label="接口权限" name="second">
              <el-tree
                :data="resourcedata"
                :props="{ label: 'label' }"
                show-checkbox
                node-key="id"
                ref="resourcetree"
                highlight-current
              >
              </el-tree>
            </el-tab-pane>
          </el-tabs>
          <div slot="footer" class="dialog-footer">
            <el-button @click="userform = false">取 消</el-button>
            <el-button type="primary" @click="authoritysend(rowdata)">确 定</el-button>
          </div>
        </el-dialog>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import {
  addUserRole,
  updataUserRole,
  getMenuTree,
  getRoleTree,
  setRole,
  deleteUserRole,
  getRoleResourcesList
} from "@/api/authority/role";
import { alertMessage } from "@/util/alert";
import { fullscreenToggel } from "@/util/util";
import { mapGetters, mapState } from "vuex";
export default {
  name: "",
  components: {},
  data() {
    return {
      activeName: "first",
      roleaction: false,//权限狂
      userform: false,//添加和编辑框
      isadd: true,//区别添加和编辑
      rowdata: {},//弹出框数据
      tableData: [],//表格数据
      menu: [],//菜单树
      resourcedata:[],//接口树
      formrules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
        ],
        roleLabel: [
          { required: true, message: "请输入角色描述", trigger: "blur" },
        ],
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
    // 清楚表单验证
    clearformValidate() {
      this.$nextTick(() => {
        this.$refs["userform"].clearValidate();
      });
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
    // 编辑表单确定按钮
    send(data) {
      this.$refs.userform.validate((valid) => {
        if (valid) {
          const rowdata = data;
          if (this.isadd) {
            addUserRole(rowdata).then(
              (res) => {
                if (res.data.code == 200) {
                  this.onLoad();
                  alertMessage(this, "success", "添加信息成功!");
                } else {
                  alertMessage(this, "error", res.message);
                }
              },
              (error) => {
                alertMessage(this, "error", error);
              }
            );
          } else {
            rowdata.isDisable = rowdata.isDisable =="是"?1:0

            updataUserRole(rowdata).then(
              (res) => {
                if (res.data.code == 200) {
                  this.onLoad();
                  alertMessage(this, "success", "修改信息成功!");
                } else {
                  alertMessage(this, "error", "修改信息出错!");
                }
              },
              (error) => {
                alertMessage(this, "error", error);
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
      this.userform = true;
      this.clearformValidate();
      this.isadd = true;
    },
    // 编辑用户信息
    userUpdate(item) {
      this.rowdata = item;
      this.userform = true;
      this.clearformValidate();
      this.isadd = false;
    },
    // 删除
    deleteRow(row) {
      this.$confirm("确定要删除吗？", this.$t("tip"), {
        confirmButtonText: this.$t("submitText"),
        cancelButtonText: this.$t("cancelText"),
        type: "warning",
      })
        .then(() => {
          deleteUserRole([row.id]).then(
            (res) => {
              if (res.data.code == 200) {
                this.onLoad();
                alertMessage(this, "success", "删除成功!");
              } else {
                alertMessage(this, "error", "删除失败!");
              }
            },
            (error) => {
              alertMessage(this, "error", "删除失败!");
            }
          );
        })
        .catch(() => {});
    },
    // 角色权限
    roleAction(item) {
      this.rowdata = item
      let menuarr = [],resourcearr=[];
  item.labelOptionDTOS.forEach(el => {
    if (el.children) {
            el.children.forEach(element => {
              menuarr.push(element.id)
            });
          }else{
            menuarr.push(el.id)
          }
  });
  item.resourceOptionDTOS.forEach(el => {
    if (el.children) {
            el.children.forEach(element => {
              resourcearr.push(element.id)
            });
          }else{
            resourcearr.push(el.id)
          }
  });
      this.roleaction = true;
      this.$nextTick(() => {
        this.$refs.menutree.setCheckedKeys(menuarr);
        this.$refs.resourcetree.setCheckedKeys(resourcearr);
      });
    },
    // 确定权限
    authoritysend(item) {
      let menulist = this.$refs.menutree
        .getCheckedKeys()
        .concat(this.$refs.menutree.getHalfCheckedKeys());
        let resourcelist = this.$refs.resourcetree
        .getCheckedKeys()
        .concat(this.$refs.resourcetree.getHalfCheckedKeys());
       const data ={
        roleName:item.roleName,
        id:item.id,
        menuIdList:menulist,
        resourceIdList:resourcelist
       }
      setRole(data).then((res) => {
        const data = res.data;
        if (data.code == 200) {
          alertMessage(this, "success", data.message);
          this.$store.dispatch("LogOut").then(() => {
                  this.$router.push({ path: "/login" });
                });
        } else {
          alertMessage(this, "error", "设置失败");
        }
        this.roleaction = false;
      });
    },
    // 刷新
    reset(){
      this.onLoad()
    },
    // 进入加载
    onLoad() {
      const loading = this.$loading({
          lock: true,
          text: '拼命加载中...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
      getMenuTree().then((res) => {
        const data = res.data.data;
        this.menu = data;
      });
      getRoleTree().then((res) => {
        const data = res.data.data;
        this.tableData = data.recordList;
        loading.close();
      });
getRoleResourcesList().then((res) => {
        const data = res.data.data;
        this.resourcedata = data;
      });
    },
    // 全屏
    fullScren() {
      fullscreenToggel();
    },
    // 动态添加行类名
    tableRowClassName({row}) {
      if (row.isDisable == 1) {
        return "disable";
      }
    },
  },
};
</script>
<style lang='scss' scoped>
@import "@/assets/style/index/hometable.scss";
::v-deep .el-main {
  .el-tooltip {
    margin-left: 10px;
  }
  .el-dialog {
    width: 400px;
  }
}
</style>