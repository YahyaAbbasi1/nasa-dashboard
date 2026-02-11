import { FormItem, Input } from "formik-antd";
import { FormInputTypes } from "../../../components/Models/Enumerations";

interface Props {
  id?: string;
  name: string;
  type: FormInputTypes;
  placeholder?: string;
  autoComplete?: boolean;
  [x: string]: any;
}

export const CustomInputPassword = (props: Props, ...rest: any) => {
  const autoCompleteValue =
    props.autoComplete === false // If autoComplete is explicitly false
      ? "new-password" // Disable autocomplete
      : "on";
  return (
    <div>
      <FormItem name={props.name} label={props.label} required={props.required}>
        <Input.Password
          id={props.id}
          name={props.name}
          placeholder={props.placeholder}
          autoComplete={autoCompleteValue}
          {...rest}
        />
      </FormItem>
    </div>
  );
};
