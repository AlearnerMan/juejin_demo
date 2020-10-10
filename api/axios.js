import axios from "axios";

import env from "../config/environment";
import baseUrl from "../config/baseUrl";

axios.default.timeout = 1500;

axios.default.baseURL = baseUrl[env];

axios.interceptors.request.use(
  config => {
    return config;
  },
  err => {
    return new Error("请求拦截器报错了");
  }
);

axios.interceptors.response.use(
  response => {
    return response;
  },
  err => {
    return new Error("返回拦截器报错了");
  }
);

export default axios;
