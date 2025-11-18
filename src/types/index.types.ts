import * as Yup from 'yup';

export const ProfileSchema = Yup.object().shape({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  userId: Yup.string().required('User ID is required'),
});

export type Client = {
  client_id: string;
  name: string;
  industry: string;
  timestamp: Date;
  audit_procedures: number;
  action: string[];
};

export type Bot = {
  id: string;
  category: string;
  auditProcedure: string;
  description: string;
  documentForEvidence: string;
  company: string;
  location: string;
  period: string;
  fYear: string;
  industry: string;
};

export type UploadedFile = {
  id: string;
  name: string;
};

export type Category = {
  id: string;
  name: string;
  files: UploadedFile[];
};

export type DragData = {
  file: UploadedFile;
  fromCategory: string | null;
};

export type AuditProcedure = {
  id: string;
  category: string;
  name: string;
  description: string;
  document: string;
}

export interface AuditData {
  jobId: string;
  location: string;
  auditProcedures: number;
  exceptions: number;
  startDate: string;
  endDate: string;
  createdOn: string;
  status: "In-Progress" | "Completed" | "Inactive";
}
