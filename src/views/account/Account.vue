<template>
  <section>

    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.name" placeholder="姓名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="queryAccountList">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleAdd">新增</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--列表-->
    <template>
      <el-table :data="accounts" highlight-current-row v-loading="loading" style="width: 100%;">
        <el-table-column prop="id" label="序号" width="coloum_width"></el-table-column>
        <el-table-column prop="user_name" label="用户名" width="coloum_width"></el-table-column>
        <el-table-column prop="login_name" label="账号" width="coloum_width"></el-table-column>
        <el-table-column prop="role_name" label="角色" width="coloum_width"></el-table-column>
        <el-table-column prop="create_time" label="创建日期" width="coloum_width" sortable></el-table-column>

        <el-table-column label="操作" width="coloum_width">
          <template scope="scope">
            <el-button type="danger" size="small" @click="handleDel(scope.row)">删除</el-button>
          </template>
        </el-table-column>

      </el-table>
    </template>


    <!--新增界面-->
    <el-dialog title="新增账号" v-model="addFormVisible" :close-on-click-modal="false">

      <el-form :model="account" style="width: 70%; margin-left: 76px" label-width="80px">
          <el-form-item label="用户名">
            <el-input v-model="account.user_name"></el-input>
          </el-form-item>

          <el-form-item label="角色">
            <template>
              <el-select v-model="select_role_id" placeholder="请选择角色">
                <el-option
                  v-for="role in roles"
                  :key="role.id"
                  :label="role.name"
                  :value="role.id">
                  <span style="float: left">{{ role.name }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">ID: {{ role.id }}</span>
                </el-option>
              </el-select>
            </template>
          </el-form-item>

          <el-form-item label="账号">
            <el-input v-model="account.login_name"></el-input>
          </el-form-item>

          <el-form-item label="密码">
            <el-input type="password" v-model="account.login_pwd"></el-input>
          </el-form-item>

          <el-form-item label="重复密码">
            <el-input type="password" v-model="account.repeat_login_pwd"></el-input>
          </el-form-item>


      </el-form>

      <div slot="footer" class="dialog-footer">
          <el-button @click.native="addFormVisible = false">取消</el-button>
          <el-button type="primary" @click.native="submitAccount">提交</el-button>
      </div>

    </el-dialog>



  </section>
</template>
<script>

  import {
    api_post_role_list,
    api_post_account,
    api_post_account_list,
    api_delete_account
  } from '../../api/api_account'
  export default {
    data() {
      return {
        filters: {
          name: ''
        },
        addFormVisible: false,//新增界面是否显示
        account: {
          user_name: '',
          login_name: '',
          login_pwd: '',
          repeat_login_pwd: '',
          role_id: '',
        },
        select_role_id: "",
        loading: false,
        accounts: [],
        coloum_width: 200,
        roles: []
      }
    },
    methods: {
      // 处理新增
      handleAdd() {
        this.addFormVisible = true;
        // 刷新角色列表
        this.queryRoleList();
      },

      // 查询账号
      queryAccountList() {
        this.loading = true;
        // 页面无缓存内容时，初始化数据并写入缓存
        api_post_account_list().then(result => {
          if(result.code !== 200){
            this.$message.error('账号列表刷新失败!');
          }else{
            this.accounts = result.data.page.list;
          }
          this.loading = false;
        }).catch(err => this.$message.error('服务器连接错误！'));
      },

      // 处理删除
      handleDel(account) {
        // 删除确认
        this.$confirm('此操作将永久删除该账号, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 请求服务器删除
          this.deleteAccount(account);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })});
      },

      // 查询所有角色
      queryRoleList() {
        this.loading = true;
        // 页面无缓存内容时，初始化数据并写入缓存
        api_post_role_list().then(result => {
          if(result.code !== 200){
            this.$message.error('角色列表刷新失败!');
          }else{
            this.roles = result.data.page.list;
          }
          this.loading = false;
        }).catch(err => this.$message.error('服务器连接错误！'));
      },

      // 提交账号
      submitAccount() {
        // 表单验证
        if (this.account.user_name === "") {
          this.$message.warning("没有填写用户名！");
          return
        }
        if (this.select_role_id === "" || this.select_role_id === 0) {
          this.$message.warning("没有选择角色！");
          return
        }
        // 选择角色ID
        this.account.role_id = parseInt(this.select_role_id);
        if (this.account.login_name === "") {
          this.$message.warning("没有填写登录账号！");
          return
        }
        if (this.account.login_pwd === "") {
          this.$message.warning("没有填写密码！");
          return
        }
        if (this.account.login_pwd !== this.account.repeat_login_pwd) {
          this.$message.warning("两次密码不一致！");
          return
        }
        // 添加账号
        this.addAccount();
      },

      // 添加账号
      addAccount() {
        // 请求API
        api_post_account(this.account).then(result => {
            // 结果判断
            if(result.code !== 200){
              this.$message.warning('添加账号失败！');
            }else {
              this.$message.success('账号添加成功！');
            }
            // 清除表单数据
            this.account = {
              user_name: '',
              login_name: '',
              login_pwd: '',
              repeat_login_pwd: '',
              role_id: '',
            };
            this.select_role_id = "";
            // 刷新账户列表
            this.queryAccountList();
          }
        ).catch(()=>{this.$message.error('服务器连接错误！');});
        // 弹窗隐藏
        this.addFormVisible = false;
      },

      // 删除账号
      deleteAccount(account) {
        api_delete_account(account).then(result => {
            // 结果判断
            if(result.code !== 200){
              this.$message.warning('删除账号失败！');
            }else {
              this.$message.success('账号删除成功！');
            }
            // 刷新账户列表
            this.queryAccountList();
          }
        ).catch(()=>{this.$message.error('服务器连接错误！');});
      }


    },
    created() {
      // 查询账号列表
      this.queryAccountList();
    }
  };

</script>

<style scoped>

</style>
