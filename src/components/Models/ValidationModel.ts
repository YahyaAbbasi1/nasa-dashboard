import { ValidationType } from "./Enumerations";

export interface ValidationModel {
  type: ValidationType;
  value?: string | number | boolean;
  message: string;
}