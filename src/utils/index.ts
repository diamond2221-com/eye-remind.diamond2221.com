import md5 from "./md5";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function encrypt(param: { [key: string]: any }): string {
  const { ...params } = param;
  let paramsString = "";
  const paramArr = Object.keys(params).sort();
  paramArr.forEach((item) => {
    let str = params[item];
    if (typeof params[item] === "object" && !params[item]) {
      str = encrypt({ item: params[item] });
    }
    paramsString += `${item}=${str}&`;
  });
  paramsString = paramsString.slice(0, -1);
  paramsString = md5(paramsString);
  return paramsString;
}
