import '../styles/globals.css';
import './styles/layout.css';
import './styles/fonts.css';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Credmate',
  description: 'Credmate Web Application'
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
