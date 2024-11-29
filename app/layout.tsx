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
      <body>
        {children}
      </body>
    </html>
  );
}
