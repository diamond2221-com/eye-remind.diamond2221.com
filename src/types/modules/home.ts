export enum EColumnType {
  "text" = 1,
  "checkbox" = 2,
}

export interface Column {
  id: number;
  key: string;
  title: string;
  type: EColumnType;
}
export enum ERemindStatus {
  "yes" = 1,
  "no" = 0,
}
export enum EIsDel {
  "unDel" = 1,
  "del" = 0,
}

export interface RemindItem {
  name: string;
  medicineId: number;
  [key: string]: Remind | string | number;
}

export interface Remind {
  id: number;
  timeId: number;
  medicineId: number;
  remark: string;
  status: ERemindStatus;
  date: Date;
  addTime: Date;
  updateTime: Date;
  isDel: EIsDel;

  medicine?: MedicineEnum;
  time?: TimeEnum;
}

export interface MedicineEnum {
  id: number;
  name: string;
}
export interface TimeEnum {
  id: number;
  name: string;
  sort: number;
}
export interface UseStatusResponse {
  columns: Column[];
  rows: RemindItem[];
  pageInfo: {
    pageHeader: string;
    startWeek: string;
    endWeek: string;
    week: string;
  };
}

/**
 * 设置药品时间
 */
export type SetRemindData = Pick<
  Remind,
  "timeId" | "medicineId" | "status" | "date"
>;
