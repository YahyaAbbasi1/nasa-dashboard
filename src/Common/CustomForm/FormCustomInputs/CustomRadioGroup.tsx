import { FormItem, Radio } from "formik-antd";
import { InputSelectOptionModel } from "../../../components/Models/InputSelectOptionModel";

interface Props {
  options: InputSelectOptionModel[];
  label: string;
  name: string;
  [x: string]: any;
}

export const CustomRadioGroup = ({ label, options, ...props }: Props) => {
  return (
    <div>
      <FormItem name={props.name} label={label} required={props.required}>
        <Radio.Group {...props}>
          {options.map((opt) => {
            return (
              <Radio key={opt.value} value={opt.value} name={props.name}>
                {opt.description}
              </Radio>
            );
          })}
        </Radio.Group>
      </FormItem>
    </div>
  );
};
