import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff } from 'lucide-react';
import { Form, Formik } from 'formik';
import type { ISignUpInitialValues } from '../../types/auth.types';
import { signUpValidationSchema } from '../../types/auth.types';
import { useNavigate } from 'react-router-dom';

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const navigate = useNavigate();

  const signupInitialValues: ISignUpInitialValues = {
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    organisation: '',
    password: '',
    confirmPassword: '',
  };

  const handleSubmit = (values: ISignUpInitialValues) => {
    console.log('Sign in attempt with:', values);
    navigate('/');
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side */}
      <div className="hidden lg:flex lg:w-3/5">
        <img src="/assets/signIn-bg.png" className="h-screen w-screen object-cover" />
      </div>

      {/* Right side - Sign In Form */}
      <div className="flex-1 flex items-center px-6 bg-background -translate-x-8 rounded-l-4xl lg: w-2/5">
        <div className="w-full max-w-2xl space-y-8">
          {/* Logo and Title */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[hsl(var(--gradient-start))] to-[hsl(var(--gradient-mid))] flex items-center justify-center">
                <img src="auditbot-logo.png" className="w-6 h-6" />
              </div>
              <span className="text-xl font-semibold text-foreground">Auditbots</span>
            </div>
            <h1 className="text-3xl font-semibold text-foreground">Create a new account</h1>
          </div>

          {/* Form */}
          <Formik
            initialValues={signupInitialValues}
            validationSchema={signUpValidationSchema}
            onSubmit={handleSubmit}
          >
            {(formik) => (
              <Form id="login-form" className="space-y-4">
                {/* First Name and Last Name Row */}
                <div className="flex gap-5">
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="firstname" className="text-sm font-medium text-foreground">
                      First Name<span className="text-red-600 -ml-2">*</span>
                    </Label>
                    <Input
                      id="firstname"
                      name="firstname"
                      type="text"
                      placeholder="First Name"
                      value={formik.values.firstname}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="h-12"
                    />
                    {formik.errors.firstname && formik.touched.firstname ? (
                      <div className="text-sm text-red-600 mt-1">{formik.errors.firstname}</div>
                    ) : null}
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="lastname" className="text-sm font-medium text-foreground">
                      Last Name<span className="text-red-600 -ml-2">*</span>
                    </Label>
                    <Input
                      id="lastname"
                      name="lastname"
                      type="text"
                      placeholder="Last Name"
                      value={formik.values.lastname}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="h-12"
                    />
                    {formik.errors.lastname && formik.touched.lastname ? (
                      <div className="text-sm text-red-600 mt-1">{formik.errors.lastname}</div>
                    ) : null}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-foreground">
                    Email<span className="text-red-600 -ml-2">*</span>
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="h-12"
                  />
                  {formik.errors.email && formik.touched.email ? (
                    <div className="text-sm text-red-600">{formik.errors.email}</div>
                  ) : null}
                </div>
                {/* Phone and Organisation Row */}
                <div className="flex gap-5">
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium text-foreground">
                      Phone<span className="text-red-600 -ml-2">*</span>
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="text"
                      placeholder="Enter your phone number"
                      value={formik.values.phone}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="h-12"
                    />
                    {formik.errors.phone && formik.touched.phone ? (
                      <div className="text-sm text-red-600">{formik.errors.phone}</div>
                    ) : null}
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="organisation" className="text-sm font-medium text-foreground">
                      Organisation<span className="text-red-600 -ml-2">*</span>
                    </Label>
                    <Input
                      id="organisation"
                      name="organisation"
                      type="text"
                      placeholder="Enter your organisation"
                      value={formik.values.organisation}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="h-12"
                    />
                    {formik.errors.organisation && formik.touched.organisation ? (
                      <div className="text-sm text-red-600">{formik.errors.organisation}</div>
                    ) : null}
                  </div>
                </div>
                {/* Password and Confirm Password Row */}
                <div className="flex gap-5">
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium text-foreground">
                      Password<span className="text-red-600 -ml-2">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="h-12 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {formik.errors.password && formik.touched.password ? (
                      <div className="text-sm text-red-600">{formik.errors.password}</div>
                    ) : null}
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label
                      htmlFor="confirmPassword"
                      className="text-sm font-medium text-foreground"
                    >
                      Confirm Password<span className="text-red-600 -ml-2">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Confirm your password"
                        value={formik.values.confirmPassword}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="h-12 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {formik.errors.confirmPassword && formik.touched.confirmPassword ? (
                      <div className="text-sm text-red-600">{formik.errors.confirmPassword}</div>
                    ) : null}
                  </div>
                </div>
                <Button type="submit" className="w-full h-12 text-base font-medium">
                  Sign Up
                </Button>
                <div className="text-center text-sm text-muted-foreground">
                  Already have an account?{' '}
                  <a href="/sign-in" className="text-primary hover:underline font-medium">
                    SignIn
                  </a>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
