import { FormInputTypes } from "./Enumerations";
import { InputSelectOptionModel } from "./InputSelectOptionModel";
import { ValidationModel } from "./ValidationModel";

export interface CustomFormInputProps {
  [x: string]: any;
  // id: number;
  name: string;
  value?: string | number | number[];
  placeholder?: string;
  label?: string;
  extra?: string;
  type: FormInputTypes;
  options?: InputSelectOptionModel[];
  typeValue?: "string" | "boolean";
  validations?: ValidationModel[];
  required?: boolean;
  min?: number;
  max?: number;
  width?: string;
  disable?: boolean;
  multiple?: boolean;
  autoComplete?: boolean;
  onChange?: (value: string) => void;
  isChecked?: boolean;
}
