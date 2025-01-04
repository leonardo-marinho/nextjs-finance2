import { PropsWithChildren } from 'react';
import { ToastContainer } from 'react-toastify';

const RootLayout = ({ children }: PropsWithChildren) => {
  return (
    <>
      <ToastContainer />
      {children}
    </>
  );
};

export default RootLayout;
