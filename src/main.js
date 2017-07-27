// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
Vue.config.productionTip = false;

// element-ui
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import 'font-awesome/css/font-awesome.min.css'


Vue.use(ElementUI);

import {getTimeStorage} from './api/api_account'

// 实现单点登入
router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    // 注销
    sessionStorage.clear();
    localStorage.clear();
  }else{
    let token = getTimeStorage("USER_TOKEN");
    if(token === null) {
      // token不存在，转向登录
      next({path: '/login'});

    }
  }
  next();


});


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
});
