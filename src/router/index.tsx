import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
const SignInPage = lazy(() => import('../pages/auth/signIn'));
const SignUpPage = lazy(() => import('../pages/auth/signUp'));
const Layout = lazy(() => import('../components/layout/Layout'));
const HomePage = lazy(() => import('../pages/dashboard/home'));
const ProfilePage = lazy(() => import('../pages/dashboard/Profile'));
const ClientPage = lazy(() => import('@/pages/dashboard/client/Client'));
const NotFoundPage = lazy(() => import('../pages/404/404Page'));
const CreateClientHomePage = lazy(() => import('../pages/dashboard/client/add-client/index'));
const CreateClientStep1 = lazy(() => import('../pages/dashboard/client/add-client/Step1'));
const CreateClientStep2 = lazy(() => import('../pages/dashboard/client/add-client/Step2'));
const CreateClientStep3 = lazy(() => import('../pages/dashboard/client/add-client/Step3'));
const CreateClientFinalStep = lazy(() => import('../pages/dashboard/client/add-client/Step4'));
const AuditProcedures = lazy(() => import('../pages/dashboard/AuditProcedures'));
const ProcedureReview = lazy(() => import('../pages/dashboard/procedure-review'));
const ClientInfoPage = lazy(() => import('../pages/dashboard/client/ClientInfo'));
const OutputPage = lazy(() => import('../pages/dashboard/Output'));

const Router = () => {
  return (
    <Routes>
      <Route path="/sign-in" element={<SignInPage />} />
      <Route path="/register" element={<SignUpPage />} />
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="settings" element={<ProfilePage />} />
        <Route path="clients">
          <Route index element={<ClientPage />} />
          <Route path="add-client" element={<CreateClientHomePage />}>
            <Route index element={<CreateClientStep1 />} />
            <Route path="upload-data" element={<CreateClientStep2 />} />
            <Route path="organise-upload" element={<CreateClientStep3 />} />
          </Route>
          <Route path=":id">
            <Route index element={<ClientInfoPage />} />
            <Route path=":jobId" element={<OutputPage />} />
          </Route>
          <Route path="data-filtering" element={<CreateClientFinalStep />} />
          <Route path="procedure-review" element={<ProcedureReview />} />
        </Route>

        <Route path="audit-procedures">
          <Route index element={<AuditProcedures />} />
          <Route path="create-audit-procedure" element={<></>} />
        </Route>
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default Router;
