import { request, AxiosResponse } from "@/network/index";
import { Response } from "@/types/modules/common";
import { Remind, SetRemindData, UseStatusResponse } from "@/types/modules/home";

// 设置滴药时间
export function SetDropTime(
  data: SetRemindData
): Promise<AxiosResponse<Response<Remind>>> {
  return request<Remind>({
    url: `/api/reminds/set`,
    method: "POST",
    data,
  });
}

/**
 * @description 获取某日全部时间段滴药状态
 * @author ZhangYù
 * @date 02/02/2022
 * @export
 * @param {Date} date
 * @return {*}  {Promise<AxiosResponse<Response<UseStatusResponse>>>}
 */
export function GetRemindAll(
  date: Date
): Promise<AxiosResponse<Response<UseStatusResponse>>> {
  return request<UseStatusResponse>({
    url: "/api/reminds/getAll",
    data: {
      date,
    },
    method: "GET",
  });
}
