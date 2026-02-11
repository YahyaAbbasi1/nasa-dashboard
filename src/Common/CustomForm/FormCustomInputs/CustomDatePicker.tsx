import { DatePicker, FormItem } from "formik-antd";
import { FormInputTypes } from "../../../components/Models/Enumerations";

interface Props {
  id?: string;
  name: string;
  type: FormInputTypes;
  placeholder?: string;
  [x: string]: any;
}

export const CustomDatePicker = (props: Props, ...rest: any) => {
  return (
    <div>
      <FormItem name={props.name} label={props.label} required={props.required}>
        <DatePicker
          id={props.id}
          name={props.name}
          placeholder={props.placeholder}
          {...rest}
          format="DD/MM/YYYY"
        />
      </FormItem>
    </div>
  );
};
