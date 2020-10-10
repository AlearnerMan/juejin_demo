import axios from "./axios";

const AXIOS_BASIC = {
  createHTTPRequest(data = {}) {
    const reqParams = {
      url: data.url,
      method: data.method || "POST"
    };
    data.params && (reqParams.params = data.params);
    data.data && (reqParams.data = data.data);
    data.headers && (reqParams.headers = data.headers);
    return new Promise((resolve, reject) => {
      axios.post(reqParams).then(
        response => {
          resolve(response);
        },
        err => {
          reject(err);
        }
      );
    });
  },
  post(data = {}) {
    const postData = {
      url: data.url,
      method: "POST",
      data: data.params
    };
    data.headers && (postData.headers = data.headers);
    return new Promise((resolve, reject) => {
      axios.post(postData).then(
        response => {
          resolve(response);
        },
        err => {
          reject(err);
        }
      );
    });
  },
  get(data = {}) {
    const getData = {
      url: data.url,
      method: "GET",
      params: data.params
    };
    data.headers && (getData.headers = data.headers);
    return new Promise((resolve, reject) => {
      axios.get(getData).then(
        response => {
          resolve(response);
        },
        err => {
          reject(err);
        }
      );
    });
  }
};

export default AXIOS_BASIC;
