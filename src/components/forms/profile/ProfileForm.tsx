import React from 'react';
import { Formik, Form, Field } from 'formik';
import { ProfileSchema } from '@/types/index.types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export const ProfileForm: React.FC = () => {
  return (
    <Formik
      initialValues={{
        firstName: '',
        lastName: '',
        email: '',
        userId: '',
      }}
      validationSchema={ProfileSchema}
      onSubmit={(values) => {
        console.log('Profile Form Submitted:', values);
      }}
    >
      {({ errors, touched }) => (
        <Form className="w-full">
          <div className="space-y-4 w-full px-4">
            {/* User ID and Email in one row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="userId">User ID</Label>
                <Field as={Input} id="userId" name="userId" placeholder="User-ID" />
                {errors.userId && touched.userId && (
                  <p className="text-sm text-red-500">{errors.userId}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Field
                  as={Input}
                  id="email"
                  name="email"
                  type="email"
                  placeholder="abc@gmail.com"
                />
                {errors.email && touched.email && (
                  <p className="text-sm text-red-500">{errors.email}</p>
                )}
              </div>
            </div>

            {/* First Name and Last Name in one row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Field as={Input} id="firstName" name="firstName" placeholder="First name" />
                {errors.firstName && touched.firstName && (
                  <p className="text-sm text-red-500">{errors.firstName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Field as={Input} id="lastName" name="lastName" placeholder="Last name" />
                {errors.lastName && touched.lastName && (
                  <p className="text-sm text-red-500">{errors.lastName}</p>
                )}
              </div>
            </div>
            <div className="flex gap-3 items-center justify-end mt-2">
              <Button size="sm" className="hover:cursor-pointer">
                Save Changes
              </Button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};
