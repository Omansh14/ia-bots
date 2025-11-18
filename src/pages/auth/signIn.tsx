import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff } from 'lucide-react';
import { Form, Formik } from 'formik';
import type { ILoginInitialValues } from '../../types/auth.types';
import { loginValidationSchema } from '../../types/auth.types';
import { useNavigate } from 'react-router-dom';

const SignInPage = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const navigate = useNavigate();

  const loginInitialValues: ILoginInitialValues = {
    email: '',
    password: '',
  };

  const handleSubmit = (values: ILoginInitialValues) => {
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
      <div className="flex-1 flex items-center justify-center p-4 bg-background -translate-x-8 rounded-l-4xl">
        <div className="w-full max-w-md space-y-8">
          {/* Logo and Title */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[hsl(var(--gradient-start))] to-[hsl(var(--gradient-mid))] flex items-center justify-center">
                <img src="auditbot-logo.png" className="w-6 h-6" />
              </div>
              <span className="text-xl font-semibold text-foreground">Auditbots</span>
            </div>
            <h1 className="text-3xl font-semibold text-foreground">Sign in to your account</h1>
          </div>

          {/* Form */}
          <Formik
            initialValues={loginInitialValues}
            validationSchema={loginValidationSchema}
            onSubmit={handleSubmit}
          >
            {(formik) => (
              <Form id="login-form" className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-foreground">
                    Email Address<span className="text-red-600 -ml-2">*</span>
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="h-12"
                    
                  />
                  {formik.errors.email && formik.touched.email ? (
                    <div className="text-sm text-red-600 mt-1">{formik.errors.email}</div>
                  ) : null}
                </div>
                <div className="space-y-2">
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
                <Button type="submit" className="w-full h-12 text-base font-medium">
                  Sign In
                </Button>
                <div className="text-center text-sm text-muted-foreground">
                  Doesn't have an account?{' '}
                  <a href="/register" className="text-primary hover:underline font-medium">
                    Signup
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

export default SignInPage;
