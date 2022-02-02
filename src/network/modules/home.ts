import { request, AxiosResponse } from "@/network/index";
import { Response } from "@/types/modules/common";
import { UseStatusResponse } from "@/types/modules/home";

/**
 * @description 设置以滴药
 * @author ZhangYù
 * @date 02/02/2022
 * @export
 * @param {number} id
 * @return {*}  {Promise<AxiosResponse<Response<null>>>}
 */
export function SetYesDrop(id: number): Promise<AxiosResponse<Response<null>>> {
  return request<null>({
    url: `/api/reminds/yes/${id}`,
    method: "PUT",
  });
}

/**
 * @description 设置未滴药
 * @author ZhangYù
 * @date 02/02/2022
 * @export
 * @param {number} id
 * @return {*}  {Promise<AxiosResponse<Response<null>>>}
 */
export function SetNoDrop(id: number): Promise<AxiosResponse<Response<null>>> {
  return request<null>({
    url: `/api/reminds/no/${id}`,
    method: "PUT",
  });
}

/**
 * @description 获取某日滴药状态
 * @author ZhangYù
 * @date 02/02/2022
 * @export
 * @param {Date} date
 * @return {*}  {Promise<AxiosResponse<Response<UseStatusResponse>>>}
 */
export function GetUseStatus(
  date: Date
): Promise<AxiosResponse<Response<UseStatusResponse>>> {
  return request<UseStatusResponse>({
    url: "/api/reminds/get",
    data: {
      date,
    },
    method: "GET",
  });
}
