import { baseModel } from "./baseModel";

export interface userModel extends baseModel {
  id: string | number;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  passwordHash: string;
  password: string
  avatar?: string;
}
