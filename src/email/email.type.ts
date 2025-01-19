export type SendEmail = {
  to: string[];
  cc?: string[];
  bcc?: string[];
  subject: string;
  body: string;
};
