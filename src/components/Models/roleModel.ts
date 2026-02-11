import { baseModel } from "./baseModel";

export interface roleModel extends baseModel {
      id: number;
  permissionIds: number[];
  name: string;
}