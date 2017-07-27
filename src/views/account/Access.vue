<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0;">
      <el-form :inline="true" :model="access" class="demo-form-inline">
        <el-form-item >
          <el-input v-model="access.code" placeholder="权限码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="access.name" placeholder="权限名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="handleAdd">添加</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--列表-->
    <template>
      <el-table :data="accesses" highlight-current-row v-loading="loading" style="width: 100%;">
        <el-table-column prop="id" label="序号" width="coloum_width">
        </el-table-column>
        <el-table-column prop="code" label="权限码" width="coloum_width">
        </el-table-column>
        <el-table-column prop="name" label="权限名" width="coloum_width">
        </el-table-column>
        <el-table-column prop="create_time" label="创建日期" width="coloum_width" sortable>
        </el-table-column>

        <el-table-column label="操作" width="coloum_width">
          <template scope="scope">
            <el-button type="danger" size="small" @click.native.prevent="handleDel(scope.row)">删除</el-button>
          </template>
        </el-table-column>

      </el-table>
    </template>



  </section>
</template>
<script>

  import { api_post_access, api_post_access_list, api_delete_access } from '../../api/api_account'
  export default {
    data() {
      return {
        access: {
          code: '',
          name: ''
        },
        loading: false,
        accesses: [],
        coloum_width: 200,
      }
    },
    methods: {
      // 处理添加
      handleAdd() {
        // 校验参数
        if(this.access.code === "" || this.access.name ==="" ) {
          this.$message.warning('权限信息不全！');
          return
        }
        // 请求API
        this.addAccess(this.access);
      },

      // 添加权限
      addAccess(access) {
        // 请求API
        api_post_access(this.access).then(result => {
            // 结果判断
            if(result.code !== 200){
              this.$message.warning('添加权限失败！');
            }else {
              this.$message.success('权限添加成功！');
            }
            // 清除表单
            access.code = "";
            access.name = "";
            // 刷新权限列表
            this.queryAccessList();
          }
        ).catch(()=> {
          this.$message.error('服务器连接错误！');
        });
      },

      // 处理删除
      handleDel(access) {
        this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 请求服务器删除
          this.deleteAccess(access);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })});
      },

      // 请求服务器删除
      deleteAccess(access) {
        api_delete_access(parseInt(access.code)).then(result => {
          if(result.code !== 200){
            this.$message.error('权限删除失败!');
            console.log(result)
          }else{
            this.$message.success('权限删除成功!');
          }
          // 刷新权限列表
          this.queryAccessList();
        }).catch(err => this.$message.error('服务器连接错误！'));
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
      }
    },
    created () {
      // 页面刷新时刷新权限列表
      this.queryAccessList();
    }
  };

</script>

<style scoped>

</style>
