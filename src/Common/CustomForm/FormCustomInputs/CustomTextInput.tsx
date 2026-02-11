import React from "react";
import { FormItem, Input } from "formik-antd";
import { FormInputTypes } from "../../../components/Models/Enumerations";

interface Props {
  id?: string;
  name: string;
  type: FormInputTypes;
  placeholder?: string;
  width?: string;
  disabled?: boolean;
  [x: string]: any;
}

export const CustomTextInput = (props: Props, ...rest: any) => {
  return (
    <div>
      <FormItem
        name={props.name}
        label={props.label}
        required={props.required}
        extra={props.extra}
      >
        <Input
          id={props.id}
          name={props.name}
          placeholder={props.placeholder}
          width={props.width}
          disabled={props.disabled}
          {...rest}
        />
      </FormItem>
    </div>
  );
};
