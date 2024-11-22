import { sha256 } from 'js-sha256';

export const hashClientPassword = (password: string): string => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);

  return sha256(data);
};
