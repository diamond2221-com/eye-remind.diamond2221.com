export enum EColumnType {
  "text" = 1,
  "checkbox" = 2,
}

export interface Column {
  key: string;
  title: string;
  type: EColumnType;
}
export enum ERemindStatus {
  "yes" = 1,
  "no" = 0,
}
export interface RemindItem {
  name: string;
  [key: string]: Remind | string;
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
  list: RemindItem[];
  pageInfo: {
    pageHeader: string;
    startWeek: string;
    endWeek: string;
    week: string;
  };
}
