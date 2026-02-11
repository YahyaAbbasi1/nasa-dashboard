import React from "react";
import { FormItem, Input } from "formik-antd";
import { FormInputTypes } from "../../../components/Models/Enumerations";

interface Props {
  id?: string;
  name: string;
  type: FormInputTypes;
  placeholder?: string;
  [x: string]: any;
}

export const CustomInputTextArea = (props: Props, ...rest: any) => {
  return (
    <div>
      <FormItem
        name={props.name}
        label={props.label}
        required={props.required}
        extra={props.extra}
      >
        <Input.TextArea
          id={props.id}
          name={props.name}
          placeholder={props.placeholder}
          {...rest}
        />
      </FormItem>
    </div>
  );
};
