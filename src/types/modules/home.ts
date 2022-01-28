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
  [key: string]: ERemindStatus | string;
}

export interface UseStatusResponse {
  columns: Column[];
  list: RemindItem[];
}
