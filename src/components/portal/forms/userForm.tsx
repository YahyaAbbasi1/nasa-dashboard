import { CustomFormInputProps } from "../../Models";
import { FormInputTypes, ValidationType } from "../../Models/Enumerations";

export const UserForm = (): CustomFormInputProps[] => {
  const formInputs = [
    {
      type: FormInputTypes.Text,
      name: "firstName",
      label: "First Name",
      disable: false,
      value: "",
      required: true,
      validations: [
        // {
        //   type: ValidationType.required,
        //   message: "First Name is required",
        // },
        {
          type: ValidationType.isEmail,
          message: "not allowed to update",
        },
      ],
    },
    {
      type: FormInputTypes.Text,
      name: "lastName",
      label: "Last Name",
      disable: false,
      required: true,
      value: "",
      validations: [
        {
          type: ValidationType.required,

          message: "Last Name is required",
        },
      ],
    },
    {
      type: FormInputTypes.Email,
      name: "email",
      label: "Email",
      disable: false,
      value: "",
    },
    {
      type: FormInputTypes.Text,
      name: "userName",
      label: "User Name",
      disable: false,
      required: true,
      value: "",
      validations: [
        {
          type: ValidationType.required,

          message: "User Name is required",
        },
      ],
    },

   {
  type: FormInputTypes.Password,
  name: "password", 
  label: "Password",
  disable: false,
  autoComplete: false,
  required: true,
  validations: [
    {
      type: ValidationType.required,
      message: "Password is required",
    },
    {
      type: ValidationType.minLength,
      value: 6,
      message: "Password must be at least 6 characters",
    }
  ],
}
  ];

  return formInputs;
};
