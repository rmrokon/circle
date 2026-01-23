import crypto, { randomBytes } from 'crypto';
export const randomStringMake = (count: number) => {
  const letter =
    '0123456789ABCDEFGHIJabcdefghijklmnopqrstuvwxyzKLMNOPQRSTUVWXYZ0123456789abcdefghiABCDEFGHIJKLMNOPQRST0123456789jklmnopqrstuvwxyz';
  let randomString = '';
  for (let i = 0; i < count; i++) {
    const randomStringNumber = Math.floor(1 + Math.random() * (letter.length - 1));
    randomString += letter.substring(randomStringNumber, randomStringNumber + 1);
  }
  return randomString;
};

export const RandomString = (digits: number) => {
  return randomBytes(digits).toString('hex');
};

export const generateDefaultInvoiceNumberFromStr = (inputString: string) => {
  const hash = crypto.createHash('sha256').update(inputString).digest('hex');
  const hexString = hash.substring(0, 6);
  return hexString;
};
