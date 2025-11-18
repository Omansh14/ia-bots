import * as Yup from 'yup';

export const loginValidationSchema = Yup.object({
  email: Yup.string().email('Invalid email address').required('Required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Required')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .matches(/[@$!%*?&]/, 'Password must contain at least one special character'),
});

export const signUpValidationSchema = Yup.object({
  firstname: Yup.string().min(3, 'First name must be at least 3 characters').required('Required'),
  lastname: Yup.string().min(3, 'Last name must be at least 3 characters').required('Required'),
  email: Yup.string().email('Invalid email address').required('Required'),
  phone: Yup.string()
    .matches(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number')
    .required('Required'),
  organisation: Yup.string()
    .min(2, 'Organization must be at least 3 characters')
    .required('Required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Required')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .matches(/[@$!%*?&]/, 'Password must contain at least one special character'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), undefined], 'Passwords must match')
    .required('Required'),
});

export interface ILoginInitialValues {
  email: string;
  password: string;
}

export interface ISignUpInitialValues {
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  organisation: string;
  password: string;
  confirmPassword: string;
}


