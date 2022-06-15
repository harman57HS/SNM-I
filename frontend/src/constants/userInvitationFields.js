import RadioField from "../components/shared/fields/RadioField";
import { Validator } from "../helpers";
import { defaultField } from "./index";

export const userInvitationFields = {
  is_superuser: {
    ...defaultField,
    label: 'Admin?',
    component: RadioField,
    options: {Yes: true, No: false},
    required: true,
  },
  email: {
    ...defaultField,
    required: true,
    label: 'Email',
    type: 'email',
    validator: Validator.email,
  },
  // password: {
  //   ...defaultField,
  //   label: 'Password',
  //   type: 'password',
  //   required: true,
  //   validator: Validator.password
  // },
  first_name: {
    ...defaultField,
    label: 'First name',
  },
  last_name: {
    ...defaultField,
    label: 'Last name',
  },
  primary_phone_number: {
    ...defaultField,
    type: 'phoneNumber',
    label: 'Telephone'
  },
  alt_phone_number: {
    ...defaultField,
    type: 'phoneNumber',
    label: 'Alternate phone number',
  }
};