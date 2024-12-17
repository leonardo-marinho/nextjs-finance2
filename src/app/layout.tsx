import '@/lib/ui/styles/fonts';
import '@/lib/ui/styles/globals.css';
import { cn } from '@/lib/ui/utils/classnames';
import '@radix-ui/themes/styles.css';
import Head from 'next/head';
import { PropsWithChildren } from 'react';
import 'react-toastify/dist/ReactToastify.css';

const RootLayout = ({ children }: PropsWithChildren): JSX.Element => {
  return (
    <html className="dark h-full max-h-full max-w-full overflow-x-hidden">
      <Head>
        <link href="/favicon.ico" rel="icon" sizes="any" />
        <meta content="yes" name="mobile-web-app-capable" />
        <meta content="yes" name="apple-mobile-web-app-capable" />
        <link href="/app.webmanifest" rel="manifest" />
        <title>My App</title>
      </Head>
      <body
        className={cn(
          'max-h-full h-full max-w-screen overflow-x-hidden',
          'bg-white text-neutral-950 dark:bg-neutral-950 dark:text-neutral-50',
        )}
      >
        {children}
      </body>
    </html>
  );
};

export default RootLayout;
