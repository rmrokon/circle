/* eslint-disable @typescript-eslint/no-explicit-any */
import { readFile } from 'fs';

export const HTML_EMAIL_TEMPLATES = {
  NEW_EMPLOYEE_CREATE_POST_PASSWORD_EMAIL: 'newEmployeeCreatePostPasswordEmail.html',
  SEND_SEPA_TO_ACCOUNTING_EMAILS: 'sendSepaFileLinkToAccountingEmails.html',
};

export default function getContentFromHtmlTemplate(filepath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    readFile(`${process.cwd()}/src/templates/${filepath}`, 'utf8', (error: any, htmlString: any) => {
      if (!error && htmlString) {
        resolve(htmlString);
      } else {
        reject(error);
      }
    });
  });
}
