import React from "react";
import { Form, Formik, FormikHelpers } from "formik";
import { SubmitButton } from "formik-antd";
import { getInputs } from "./FormCustomInputs/GetInputs";
import { CustomDatePicker } from "./FormCustomInputs/CustomDatePicker";
import { CustomInputNumber } from "./FormCustomInputs/CustomInputNumber";
import { CustomInputPassword } from "./FormCustomInputs/CustomInputPassword";
import { CustomInputTextArea } from "./FormCustomInputs/CustomInputTextArea";
import { CustomSelect } from "./FormCustomInputs/CustomSelect";
import { CustomSwitch } from "./FormCustomInputs/CustomSwitch";
import { CustomTextInput } from "./FormCustomInputs/CustomTextInput";

import { FormInputTypes } from "../../components/Models/Enumerations";
import { CustomFormInputProps } from "../../components/Models";

interface CustomFormProps {
  formSchema: CustomFormInputProps[];
  initialValues?: any;
  onSubmit?: (values: any, formOptions: FormikHelpers<any>) => any;
}

export const CustomForm: React.FC<CustomFormProps> = (
  props: CustomFormProps
) => {
  const { initialValues, inputs, validationSchema } = getInputs(
    props.formSchema,
    props.initialValues
  );

  // Provide a no-op fallback for onSubmit if it's undefined
  const handleSubmit = props.onSubmit || (() => {});

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {() => (
        <Form noValidate>
          {inputs.map(({ name, type, value, ...props }) => {
            switch (type) {
              case FormInputTypes.Select:
                return (
                  <CustomSelect
                    key={name}
                    label={props.label!}
                    placeholder={props.placeholder}
                    name={name}
                    options={props.options!}
                    initialValue={props.initialValue}
                    required={props.required}
                    multiple={props.multiple}
                    className="custom-select"
                  />
                );

              case FormInputTypes.Text:
                return (
                  <CustomTextInput
                    key={name}
                    name={name}
                    label={props.label}
                    placeholder={props.placeholder}
                    type={type}
                    required={props.required}
                    width={props.width}
                    extra={props.extra}
                    disabled={props.disable}
                  />
                );

              case FormInputTypes.Password:
                return (
                  <CustomInputPassword
                    key={name}
                    name={name}
                    label={props.label}
                    placeholder={props.placeholder}
                    type={type}
                    required={props.required}
                    autoComplete={props.autoComplete}
                  />
                );

              case FormInputTypes.Email:
                return (
                  <CustomTextInput
                    key={name}
                    name={name}
                    label={props.label}
                    placeholder={props.placeholder}
                    type={type}
                    required={props.required}
                  />
                );

              case FormInputTypes.DatePicker:
                return (
                  <CustomDatePicker
                    key={name}
                    name={name}
                    label={props.label}
                    placeholder={props.placeholder}
                    type={type}
                    required={props.required}
                  />
                );
              case FormInputTypes.Number:
                return (
                  <CustomInputNumber
                    key={name}
                    name={name}
                    label={props.label}
                    placeholder={props.placeholder}
                    type={type}
                    value={props.initialValue}
                    required={props.required}
                    min={props.min}
                    max={props.max}
                    extra={props.extra}
                  />
                );

              case FormInputTypes.Switch:
                return (
                  <CustomSwitch
                    key={name}
                    type={type}
                    name={name}
                    label={props.label!}
                    required={props.required}
                    disable={props.disable}
                  />
                );
              case FormInputTypes.TextArea:
                return (
                  <CustomInputTextArea
                    key={name}
                    name={name}
                    label={props.label}
                    placeholder={props.placeholder}
                    type={type}
                    required={props.required}
                    extra={props.extra}
                  />
                );

              case FormInputTypes.Hidden:
                return <></>;

              default:
                return (
                  <CustomTextInput
                    key={name}
                    name={name}
                    label={props.label}
                    placeholder={props.placeholder}
                    type={type}
                    required={props.required}
                  />
                );
            }
          })}

          {props.onSubmit && (
            <SubmitButton className="input-form-submit-button">
              {props.initialValues ? "Update" : "Add"}
            </SubmitButton>
          )}
        </Form>
      )}
    </Formik>
  );
};
