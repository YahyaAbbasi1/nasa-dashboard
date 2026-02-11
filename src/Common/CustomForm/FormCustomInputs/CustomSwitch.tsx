import React from "react";
import { FormItem, Switch } from "formik-antd";
import { FormInputTypes } from "../../../components/Models/Enumerations";

interface Props {
  name: string;
  type: FormInputTypes;
  label: string;
  [x: string]: any;
}

export const CustomSwitch = (props: Props, ...rest: any) => {
  return (
    <div>
      <FormItem
        name={props.name}
        label={props.label}
        required={props.required}
        extra={props.extra}
      >
        <Switch
          name={props.name}
          checkedChildren="true"
          unCheckedChildren="false"
          {...rest}
        />
      </FormItem>
    </div>
  );
};
