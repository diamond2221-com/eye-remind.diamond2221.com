import axios, {
  AxiosResponse,
  AxiosRequestConfig,
  Canceler,
  AxiosInstance,
  AxiosPromise,
} from "axios";
import { encrypt } from "@/utils/index";
import { Response } from "@/types/modules/common";

declare type Methods =
  | "GET"
  | "OPTIONS"
  | "HEAD"
  | "POST"
  | "PUT"
  | "DELETE"
  | "TRACE"
  | "CONNECT";
declare interface Datas {
  method?: Methods;
  [key: string]: any;
}

export const baseURL =
  process.env.NODE_ENV === "production"
    ? "https://api.diamond2221.com/EYE-REMIND"
    : "/";

class HttpRequest {
  public queue: Array<{
    config: AxiosRequestConfig;
    cancel: Canceler;
    token: string;
  }>; // 请求的url集合
  public constructor() {
    this.queue = [];
  }

  destroy(config: AxiosRequestConfig, cancel?: Canceler, destroy = false) {
    const { url, method, params, data } = config;
    const token = encrypt({ url, method, params, data });
    const sameRequestUrl = this.queue.filter((v) => v.config.url === url);
    const sameRequest = sameRequestUrl.every((v) => v.token === token);
    const infoMessage = `${url} 接口重复: ${new Date().toLocaleString()}`;
    if (destroy) {
      if (sameRequest && sameRequestUrl.length) {
        cancel && cancel(infoMessage);
      } else {
        this.queue = this.queue.filter((v) => {
          const boolean = v.config.url !== url;
          if (destroy && !boolean) {
            if (v.token === token) {
              v.cancel(infoMessage);
            } else {
              v.cancel(infoMessage);
            }
          }
          return boolean;
        });

        if (cancel) {
          this.queue.push({
            config,
            token,
            cancel,
          });
        }
      }
    } else {
      this.queue = this.queue.filter((v) => v.config.url !== url);
    }

    if (!this.queue.length) {
      // hide loading
      setTimeout(() => {
        // Loading.hide();
      }, 200);
    }
    return token;
  }

  interceptors(instance: AxiosInstance, url?: string) {
    // 请求拦截
    instance.interceptors.request.use(
      (config: AxiosRequestConfig) => {
        // 添加全局的loading...
        if (!Object.keys(this.queue).length) {
          // show loading
          //   Loading.show();
        }
        config.cancelToken = new axios.CancelToken((cancel) => {
          if (url) {
            this.destroy(config, cancel, true);
          }
        });
        return config;
      },
      (error: any) => {
        console.error(error);
      }
    );

    // 响应拦截
    instance.interceptors.response.use((res: AxiosResponse<Response>) => {
      if (url) {
        this.destroy(res.config);
      }
      const { data, status } = res;
      if (status === 200 && data && data.code === 200) {
        // 请求成功
        return res;
      }
      return requestFail(res); // 失败回调
    });
  }

  async request<T = any>(options: AxiosRequestConfig) {
    const instance = axios.create();
    await this.interceptors(instance, options.url);
    return instance(options) as AxiosPromise<Response<T>>;
  }
}

// 请求失败
const requestFail = (res: AxiosResponse): AxiosResponse<Response> => {
  const errStr = "网络繁忙！";
  // token失效重新登陆
  if (res.data.code === 1000001 || res.data.code === 401) {
    // tologin
    return res;
  } else if (res.data.code === 17 || res.data.code === 10) {
    return res;
  } else if (res.data && res.data.code) {
    Promise.reject(res.data);
    return res;
  }
  console.error({
    code: res.data.errcode || res.data.code,
    msg: res.data.errmsg || errStr,
  });
  return res;
};

// 合并axios参数
const conbineOptions = (
  _opts: any,
  data: Datas,
  method: Methods,
  header: any = {}
): AxiosRequestConfig => {
  let opts = _opts;
  if (typeof opts === "string") {
    opts = { url: opts };
  }
  const _data = { ...opts.data, ...data };
  const options = {
    method: opts.method || data.method || method || "GET",
    url: opts.url,
    headers: { ...header },
    baseURL,
  };
  return options.method.toUpperCase() !== "GET" && options.method !== "DELETE"
    ? Object.assign(options, { data: _data })
    : Object.assign(options, { params: _data });
};

const HTTP = new HttpRequest();

/**
 * 抛出整个项目的api方法
 */
const Api = (() => {
  const fun = async <T = any>(
    opts: AxiosRequestConfig | string,
    data = {},
    method: Methods = "GET"
  ) => {
    const header = {};
    if (typeof opts === "string" && ([] as string[]).indexOf(opts) === -1) {
      // xxx
    }
    const newOpts = conbineOptions(opts, data, method, header);
    const res = await HTTP.request<T>(newOpts);
    return res;
  };

  return fun;
})();

export const request = Api;
export default Api;
export * from "axios";
