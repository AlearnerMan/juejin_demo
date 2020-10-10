import { createHTTPRequest } from "./http.js";
export const checkIsLogin = data => {
  return createHTTPRequest(data);
};
