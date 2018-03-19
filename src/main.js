import Vue from "vue";
import App from "./App.vue";
import router from "./router";

import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";

import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";

import firebaseConfig from "../firebaseConfig";
firebase.initializeApp(firebaseConfig);

Vue.config.productionTip = false;
Vue.use(Vuetify);
// test commit
new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
