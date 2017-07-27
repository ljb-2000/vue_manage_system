<template>
  <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-position="left" label-width="0px"
           class="demo-ruleForm login-container">
    <h3 class="title">系统登录</h3>
    <el-form-item prop="account">
      <el-input type="text" v-model="ruleForm.account" auto-complete="off" placeholder="账号"></el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input type="password" v-model="ruleForm.password" auto-complete="off" placeholder="密码"></el-input>
    </el-form-item>
    <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox>
    <el-form-item style="width:100%;">
      <el-button type="primary" style="width:100%;" @click.native.prevent="handleSubmit" :loading="logining">登录
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  import axios from "axios";
  import {api_post_login, setTimeStorage} from "../api/api_account";

  export default {
    data() {
      return {
        logining: false,
        ruleForm: {
          account: 'admin',
          password: 'helloworld'
        },
        rules: {
          account: [
            {required: true, message: '请输入账号', trigger: 'blur'},
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'},
          ]
        },
        checked: true
      };
    },
    methods: {
      handleSubmit() {
        api_post_login(this.ruleForm.account, this.ruleForm.password).then(result => {
          if (result.code === 200) {
            setTimeStorage("USER_TOKEN", this.ruleForm.account, 3*60*60*1000);

            this.$router.push({path:  "/", query: {user: this.ruleForm.account}});
          } else {
            console.log(result);
            this.$message.error('账号或者密码错误！');
          }
        }).catch(err => {
          if(err.message === "Network Error"){
            this.$message.error('服务器连接失败！');
          }else {
            this.$message.error('未知错误！');
          }
        });
      }
    }
  }

</script>

<style lang="scss" scoped>
  .login-container {
    /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    margin: 180px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
    .title {
      margin: 0px auto 40px auto;
      text-align: center;
      color: #505458;
    }
    .remember {
      margin: 0px 0px 35px 0px;
    }
  }
</style>
