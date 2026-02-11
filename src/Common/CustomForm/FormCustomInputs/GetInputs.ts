import { CustomFormInputProps } from "../../../components/Models";
import { ValidationType, FormInputTypes } from "../../../components/Models/Enumerations";
import * as yup from "yup";

export const getInputs = (
  form: CustomFormInputProps[],
  initialValues: { [key: string]: any } = {}
) => {
  const formWithInitialValues = form.map((input) => ({
    ...input,
    initialValue: initialValues[input.name] || "",
  }));

  const validationSchema = generateValidationSchema(form);

  return {
    validationSchema: validationSchema,
    initialValues,
    inputs: formWithInitialValues,
  };
};

const generateValidationSchema = (inputs: CustomFormInputProps[]) => {
  let schemaShape: { [key: string]: any } = {};

  inputs.forEach((input) => {
    if (input.validations) {
      // Determine the base schema type based on input type
      let fieldSchema: any;
      
      if (input.type === FormInputTypes.Number) {
        fieldSchema = yup.number().nullable();
      } else if (input.type === FormInputTypes.Select) {
        // For select fields, we need to handle both string and number values
        fieldSchema = yup.mixed().nullable();
      } else if (input.type === FormInputTypes.DatePicker) {
        // For date fields, we need to handle date objects and strings
        fieldSchema = yup.mixed().nullable();
      } else {
        fieldSchema = yup.string().nullable();
      }

      input.validations.forEach((rule: any) => {
        switch (rule.type) {
          case ValidationType.isEmail:
            if (input.type === FormInputTypes.Email) {
              fieldSchema = fieldSchema.email(rule.message);
            }
            break;

          case ValidationType.minLength:
            if (input.type === FormInputTypes.Text || input.type === FormInputTypes.TextArea) {
              fieldSchema = fieldSchema.min(rule.value as number, rule.message);
            }
            break;

          case ValidationType.maxLength:
            if (input.type === FormInputTypes.Text || input.type === FormInputTypes.TextArea) {
              fieldSchema = fieldSchema.max(rule.value as number, rule.message);
            }
            break;

          case ValidationType.passwordMatch:
            const confirmPasswordField = inputs.find(
              (item) => item.name === "confirmPassword"
            );
            if (confirmPasswordField) {
              fieldSchema = fieldSchema.oneOf(
                [yup.ref(confirmPasswordField.name)],
                rule.message
              );
            }
            break;

          // Add more validation rule cases as needed

          default:
            break;
        }
      });

      if (!input.required) {
        fieldSchema = fieldSchema.nullable(); // Set the field as not required
      } else {
        fieldSchema = fieldSchema.required(
          input.validations.find(
            (rule: any) => rule.type === ValidationType.required
          )?.message
        );
      }

      // Add the field schema to the shape object
      schemaShape[input.name] = fieldSchema;
    }
  });

  return yup.object().shape(schemaShape);
};
