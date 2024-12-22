import { Geist } from "next/font/google";
import { Providers } from './providers';
import "./globals.css";

const geist = Geist({ subsets: ["latin"] });

export const metadata = {
  title: 'CloudVault - Secure File Upload',
  description: 'Upload and manage your files securely with CloudVault',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#2563eb" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${geist.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
