import { FormItem, Select } from "formik-antd";
import { InputSelectOptionModel } from "../../../components/Models/InputSelectOptionModel";

const { Option } = Select;

interface Props {
  options?: InputSelectOptionModel[];
  label: string;
  name: string;
  initialValue?: any; // Add initialValue prop
  [x: string]: any;
}

export const CustomSelect = ({
  label,
  options,
  initialValue,
  ...props
}: Props) => {
  return (
    <div>
      <FormItem name={props.name} label={label} required={props.required}>
        <Select
          {...props}
          style={{ width: "100%" }}
          allowClear
          placeholder={props.placeholder}
        >
          {options?.map((opt) => {
            return (
              <Option key={opt.key} value={opt.value}>
                {opt.description}
              </Option>
            );
          })}
        </Select>
      </FormItem>
    </div>
  );
};
