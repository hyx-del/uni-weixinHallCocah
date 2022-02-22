/*
 * @Author: jiu yin
 * @Date: 2021-09-22 11:23:48
 * @LastEditTime: 2022-01-18 16:59:50
 * @LastEditors: jiu yin zhen jing
 * @Description: 666
 * @FilePath: \weixinmini-school\src\main.js
 * jiu
 */
import Vue from 'vue'
import VueI18n from 'vue-i18n'

import App from './App'
import store from './store'
import * as api from './api'

import en from './static/lang/EN.json';
import cn from './static/lang/CN.json';

Vue.use(VueI18n)

Vue.prototype.api =  api;
Vue.prototype.$store = store;
Vue.prototype.$other = { type: "other" };
Vue.config.productionTip = false

import cuCustom from './colorui/components/cu-custom.vue';
Vue.component('cu-custom', cuCustom);
import ShareModal from './pages/components/share-modal.vue';
Vue.component('share-modal', ShareModal);

App.mpType = 'app'

const messages = {
    en: en,
    cn: cn,
}

const i18n = new VueI18n({
    locale: 'cn',
    fallbackLocale: 'cn',
    messages,
})
Vue.prototype._i18n = i18n

const app = new Vue({
    i18n,
    store,
    ...App
})
app.$mount()
