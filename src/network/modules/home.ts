import { request, AxiosResponse } from "@/network/index";
import { Response } from "@/types/modules/common";
import { UseStatusResponse } from "@/types/modules/home";

/**
 * @description 设置以滴药
 * @author ZhangYù
 * @date 28/01/2022
 * @export
 * @return {*}
 */
export function SetToDrop(): Promise<AxiosResponse<Response<string>>> {
  return request<string>({
    url: "/set/to",
    method: "PUT",
    data: {},
  });
}

/**
 * @description 设置未滴药
 * @author ZhangYù
 * @date 28/01/2022
 * @export
 * @return {*}
 */
export function SetNoDrop(): Promise<AxiosResponse<Response<string>>> {
  return request<string>({
    url: "/set/no",
    method: "PUT",
    data: {},
  });
}

export function GetUseStatus(): Promise<
  AxiosResponse<Response<UseStatusResponse>>
> {
  return request<UseStatusResponse>({
    url: "/api/reminds/get",
    method: "GET",
  });
}
