/**
 * app 接口路径
 */
// export const APPPATH = "EYE-REMIND";
export const APPPATH =
  process.env.NODE_ENV === "production" ? "EYE-REMIND" : "";
/**
 * 线上环境
 */
export const ONLINEHOST = "http://api.diamond2221.com";

/**
 * 测试环境
 */
// export const QAHOST = "http://api.diamond2221.com";
export const QAHOST = "http://127.0.0.1:7003";
// export const QAHOST = "http://192.168.1.15:7003";
// process.env.VUE_APP_BASE_API ||

/**
 * 线上mock
 */
export const MOCKHOST = "https://www.easy-mock.com";

/**
 * 是否mock
 */
export const ISMOCK = false;

/**
 * 当前的host  ONLINEHOST | QAHOST | MOCKHOST
 */
export const MAINHOST: string =
  process.env.NODE_ENV === "production" ? ONLINEHOST : QAHOST;

export const FULLPATH = `${MAINHOST}/${APPPATH}`;
/**
 * 请求的公共参数
 */
interface CommonParams {
  timestamp?: number;
}
export const conmomPrams: CommonParams = {
  // timestamp: Date.now()
};

/**
 * @description token在本地存储的存储的天数，默认7天
 */
export const cookieExpires = 7;

// token 在 localStorage 中存储的 key
export const TOKEN_KEY = "token";

// 用户信息 在 localStorage 中存储的 key
export const USERINFO = "userinfo";
