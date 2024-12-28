import '../styles/globals.css';
import '@/app/styles/layout.css';
import './styles/fonts.css';
import { Metadata } from 'next';
import { UserProvider, useUser } from '@/contexts/UserContext';
import { gilroy } from './fonts';
import { StyledComponentProvider } from '@/contexts/StyledComponentContext';
import { DebugProvider } from '@/components/DebugProvider';

export const metadata: Metadata = {
  title: 'Credmate',
  description: 'Credmate Web Application',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body className={`${gilroy.variable} font-sans antialiased`}>
        <StyledComponentProvider>
          <UserProvider>
            <div style={{ display: 'none' }}>
              <DebugProvider />
            </div>
            {children}
          </UserProvider>
        </StyledComponentProvider>
      </body>
    </html>
  );
}
