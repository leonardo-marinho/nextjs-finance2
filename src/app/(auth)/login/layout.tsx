import { PropsWithChildren } from 'react';
import { ToastContainer } from 'react-toastify';

const RootLayout = ({ children }: PropsWithChildren): JSX.Element => {
  return (
    <>
      <ToastContainer />
      {children}
    </>
  );
};

export default RootLayout;
