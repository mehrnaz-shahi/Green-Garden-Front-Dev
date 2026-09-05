import axios from "axios";
import { resolveMock } from "./mockApi";

const BASE_URL = "http://localhost:8000/";
const USE_MOCK = process.env.REACT_APP_USE_MOCK !== "false";

const instance = axios.create({
  baseURL: BASE_URL,
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const toPlain = (data) => {
  if (data instanceof FormData) {
    const obj = {};
    data.forEach((value, key) => {
      obj[key] = value;
    });
    return obj;
  }
  return data;
};

const mock = (method, path, extras = {}) =>
  resolveMock(method, path, {
    ...extras,
    data: toPlain(extras.data),
  });

const responseStatus = (error) => error?.response?.status;

const checkToken = async (str, token) => {
  if (USE_MOCK) return mock("GET", str, { token });
  const response = await axios.get(BASE_URL + str, {
    withCredentials: true,
    headers: { Authorization: "Bearer " + token },
  });
  return response;
};

const getData = async (str) => {
  if (USE_MOCK) return mock("GET", str);
  try {
    const response = await axios.get(BASE_URL + str, { withCredentials: true });
    return response.data;
  } catch (error) {
    return mock("GET", str);
  }
};

const get = async (str) => {
  if (USE_MOCK) return mock("GET", str);
  try {
    const response = await axios.get(BASE_URL + str, { withCredentials: true });
    return response;
  } catch (error) {
    return mock("GET", str);
  }
};

const postData = async (str, data) => {
  if (USE_MOCK) {
    const result = mock("POST", str, { data });
    return result?.data ?? result;
  }
  try {
    const response = await axios.post(BASE_URL + str, data);
    return response.data;
  } catch (error) {
    const result = mock("POST", str, { data });
    return result?.data ?? result;
  }
};

const putData = async (str, data, token) => {
  if (USE_MOCK) {
    const result = mock("PUT", str, { data, token });
    return result?.data ?? result;
  }
  try {
    const response = await axios.put(BASE_URL + str, data, {
      headers: { Authorization: `Token ${token}` },
    });
    return response.data;
  } catch (error) {
    const result = mock("PUT", str, { data, token });
    return result?.data ?? result;
  }
};

const post = async (str, data) => {
  if (USE_MOCK) return mock("POST", str, { data });
  try {
    const response = await axios.post(BASE_URL + str, data);
    return response;
  } catch (error) {
    if (error?.response) return error.response;
    return mock("POST", str, { data });
  }
};

const getWithParam = async (str, params) => {
  if (USE_MOCK) return mock("GET", str, { params });

  let totalParams = "";
  let addAnd = false;
  for (let key in params) {
    if (addAnd) totalParams += "&";
    addAnd = true;
    if (typeof params[key] === "boolean") {
      const numBool = params[key] === true ? "1" : "0";
      totalParams += key + "=" + numBool;
    } else {
      totalParams += key + "=" + params[key];
    }
  }

  try {
    const response = await axios.get(BASE_URL + str + "?" + totalParams);
    return response.data;
  } catch (error) {
    return mock("GET", str, { params });
  }
};

const get_for_user = async (str, token) => {
  if (USE_MOCK) return mock("GET", str, { token });
  try {
    const response = await axios.get(BASE_URL + str, {
      headers: { Authorization: `Token ${token}` },
    });
    return response.data;
  } catch (error) {
    if (responseStatus(error)) return responseStatus(error);
    return mock("GET", str, { token });
  }
};

const post_pass = async (str, data, token) => {
  if (USE_MOCK) return mock("POST", str, { data, token });
  try {
    const response = await axios.post(BASE_URL + str, data, {
      headers: { Authorization: `Token ${token}` },
    });
    return response;
  } catch (error) {
    if (responseStatus(error)) return responseStatus(error);
    return mock("POST", str, { data, token });
  }
};

const get_by_token = async (str, token) => {
  if (USE_MOCK) return mock("GET", str, { token });
  try {
    const response = await axios.get(BASE_URL + str, {
      headers: { Authorization: `Token ${token}` },
    });
    return response.data;
  } catch (error) {
    if (responseStatus(error)) return responseStatus(error);
    return mock("GET", str, { token });
  }
};

const put_edit_user = async (str, data, token) => {
  if (USE_MOCK) return mock("PATCH", str, { data, token });
  try {
    const response = await axios.patch(BASE_URL + str, data, {
      headers: { Authorization: `Token ${token}` },
    });
    return response;
  } catch (err) {
    return mock("PATCH", str, { data, token });
  }
};

const put = async (str, token) => {
  if (USE_MOCK) return mock("PUT", str, { token });
  try {
    const response = await axios.put(
      BASE_URL + str,
      {},
      { headers: { Authorization: `Token ${token}` } }
    );
    return response;
  } catch (error) {
    if (responseStatus(error)) return responseStatus(error);
    return mock("PUT", str, { token });
  }
};

const deleteData = async (str, id, token) => {
  const path = `${str}/${id}`;
  if (USE_MOCK) return mock("DELETE", path, { token });
  try {
    await axios.delete(`${BASE_URL + str}/${id}`, {
      headers: { Authorization: `Token ${token}` },
    });
  } catch (error) {
    return mock("DELETE", path, { token });
  }
};

export {
  getData,
  postData,
  checkToken,
  post,
  get,
  getWithParam,
  get_for_user,
  put_edit_user,
  put,
  get_by_token,
  post_pass,
  deleteData,
  putData,
};
