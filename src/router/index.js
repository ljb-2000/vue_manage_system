import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/Login'
import Home from '@/views/Home'
import Access from '@/views/account/Access'
import Role from '@/views/account/Role'
import Account from '@/views/account/Account'

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: '账户管理',
      iconCls: 'el-icon-message',  //图标样式class
      component: Home,
      children: [
        { path: '/access', component: Access, name: '权限管理' },
        { path: '/role', component: Role, name: '角色管理' },
        { path: '/account', component: Account, name: '账号管理' }
      ]
    },

    {
      path: '/login',
      name: 'Login',
      component: Login
    }
  ]
})
