<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0;">
      <el-form :inline="true" :model="role" class="demo-form-inline" >
        <el-form-item>
          <el-input v-model="role.name" placeholder="角色名"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click.native.prevent="handleAdd">添加</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--列表-->
    <template>
      <el-table :data="roles" highlight-current-row v-loading="loading" style="width: 100%;" @expand="handleExpand">
        <!--权限列表-->
        <el-table-column type="expand">
          <template scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <template v-for="access in props.row.accesses">
                <el-form-item label="权限" style="width: 33%">
                  <span>{{ access.code }}　{{ access.name }}&nbsp;&nbsp;&nbsp;&nbsp;</span>
                  <el-button size="small" @click="handleUnbind(props.row, access)"><i class="el-icon-delete"></i></el-button>
                </el-form-item>
              </template>
            </el-form>
          </template>
        </el-table-column>

        <el-table-column prop="id" label="序号" width="coloum_width"></el-table-column>
        <el-table-column prop="name" label="角色" width="coloum_width"></el-table-column>
        <el-table-column prop="create_time" label="创建日期" width="coloum_width" sortable></el-table-column>

        <el-table-column label="操作" width="coloum_width">
          <template scope="scope">
            <el-button type="danger" size="small" @click="handleDel(scope.row)">删除</el-button>
            <el-button type="primary" size="small" @click="selectRole(scope.row)">绑定权限</el-button>
          </template>
        </el-table-column>

      </el-table>
    </template>

    <!--新增界面-->
    <el-dialog title="选择要绑定的权限" v-model="selectListVisible" :close-on-click-modal="false">
      <!--列表-->
      <template>
        <el-table :data="accesses" highlight-current-row v-loading="loading" style="width: 100%;" @current-change="selectAccess">
          <el-table-column prop="id" label="序号" width="coloum_width">
          </el-table-column>
          <el-table-column prop="code" label="权限码" width="coloum_width">
          </el-table-column>
          <el-table-column prop="name" label="权限名" width="coloum_width">
          </el-table-column>
          <el-table-column prop="create_time" label="创建日期" width="coloum_width" sortable>
          </el-table-column>
        </el-table>
      </template>

      <div slot="footer" class="dialog-footer">
        <el-button @click.native="selectListVisible = false">取消</el-button>
        <el-button type="primary" @click.native="BindAccess">提交</el-button>
      </div>

    </el-dialog>



  </section>
</template>
<script>

  import {
    api_post_role,
    api_post_access_list,
    api_post_role_list,
    api_get_role_accesses,
    api_post_bind_access,
    api_post_unbind_access,
    api_delete_role
  } from '../../api/api_account'

  export default {
    data() {
      return {
        role: {name: '',},
        roles: [],
        loading: false,
        coloum_width: 200,
        //新增界面是否显示
        selectListVisible: false,
        accesses: [],
        // 权限绑定
        role_id: 0,
        access_id: 0,
      }
    },
    computed: {
    },
    methods: {
      // 处理添加
      handleAdd() {
        if(this.role.name === "") {
          this.$message.warning('角色信息不全！');
          return
        }
        // 请求服务器
        this.addRole(this.role);
      },

      // 添加角色
      addRole(role) {
        // 请求API
        api_post_role(role.name).then(result => {
          // 结果判断
          if(result.code !== 200){
            this.$message.warning('添加角色失败！');
          }else {
            this.$message.success('角色添加成功！');
          }
          // 清除表单
          role.name = "";
          // 刷新角色列表
          this.queryRoleList();
        }).catch(()=> {this.$message.error('服务器连接错误！');});
      },

      // 处理删除
      handleDel(role) {
        this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() =>
          // 删除角色
          this.deleteRole(role)
        ).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })});
      },

      // 删除角色
      deleteRole(role) {
          // 请求服务器删除
          api_delete_role(role).then(result => {
            if(result.code !== 200){
              this.$message.error('角色删除失败!');
            }else{
              this.$message.success('角色删除成功!');
            }
            // 刷新角色列表
            this.queryRoleList();
          }).catch(err => this.$message.error('服务器连接错误！'));

      },

      // 查询所有角色
      queryRoleList() {
        this.loading = true;
        // 页面无缓存内容时，初始化数据并写入缓存
        api_post_role_list().then(result => {
          if(result.code !== 200){
            this.$message.error('角色列表刷新失败!');
          }else{
            let roles = result.data.page.list;
            for(let role in roles) {
              roles[role].accesses = [];
            }
            this.roles = roles;
          }
          this.loading = false;
        }).catch(err => {
          this.$message.error('服务器连接错误！');
          console.log(err);
        });
      },

      // 处理角色展开事件
      handleExpand(row, expand) {
        if (expand) {
          // 查询角色的权限列表
          this.queryRoleAccesses(row);
        }
      },

      // 请求查询角色的权限列表
      queryRoleAccesses(role) {
        api_get_role_accesses(role.id).then(result => {
          if(result.code !== 200){
            this.$message.error('角色的权限列表刷新失败!');
          }else{
            role.accesses = result.data.accesses;
          }
        }).catch(err => {
          this.$message.error('服务器连接错误！');
          console.log(err);
        });
      },

      // 弹出选择权限的列表
      selectRole(row) {
        this.queryAccessList();
        this.selectListVisible = true;
        this.role_id = row.id;
      },

      // 查询权限列表
      queryAccessList() {
        this.loading = true;
        // 页面无缓存内容时，初始化数据并写入缓存
        api_post_access_list().then(result => {
          if(result.code !== 200){
            this.$message.error('权限列表刷新失败!');
          }else{
            this.accesses = result.data.page.list;
          }
          this.loading = false;
        }).catch(err => this.$message.error('服务器连接错误！'));
      },

      // 为角色绑定权限
      BindAccess() {
        if (this.access_id === 0) {
          this.$message.warning("请先选择权限！");
          return
        }
        api_post_bind_access(this.role_id, this.access_id).then(result => {
          if(result.code !== 200){
            this.$message.error('绑定权限失败!');
          }else{
            this.selectListVisible = false;
            this.$message.success('成功绑定权限!');
          }
          // 清除选择的角色和权限
          this.role_id = 0;
          this.access_id = 0;
          // 刷新角色列表
          this.queryRoleList();
          this.loading = false;
        }).catch(err => {
          this.$message.error('服务器连接错误！');
          console.log(err);
        });
      },

      // 选择权限
      selectAccess(selection){
        if (selection !== null){
          this.access_id = parseInt(selection.id);
        }
      },

      // 处理解绑
      handleUnbind(role, access) {
        if (role.id === 0 || access.id === 0) {
          this.$message.error('解除权限失败!');
          return
        }
        this.$confirm('此操作将解绑该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
          }).then(() => {
            // 解除绑定
            this.unbindAccess(role, access)
          }).catch(() => {
              this.$message({
              type: 'info',
              message: '已取消'
          })});
      },

      // 为角色解除绑定权限
      unbindAccess(role, access) {
        // 解除绑定
        api_post_unbind_access(role.id, access.id).then(result => {
          if (result.code !== 200) {
            this.$message.error('解除权限失败!');
          } else {
            this.$message.success('成功解除权限!');
          }
          // 刷新角色列表
          this.queryRoleList();
          this.loading = false;
        }).catch(err => this.$message.error('服务器连接错误！'));
      },

    },
    created() {
      // 页面刷新时刷新角色列表
      this.queryRoleList();
    }
  };


</script>

<style>
  .dialog-footer {

  }
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }


  .el-form-item label {
    width: 50px;
  }
</style>
