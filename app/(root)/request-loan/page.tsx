'use client';

import PDFViewer from '../../../components/PDFViewer';
import { AppHeader } from '../../../components/ui/app-header';
import { useRouter } from 'next/navigation';
import NavBar from '../../../components/NavBar';

export default function RequestLoanPage() {
  const router = useRouter();

  return (
    <div className='flex flex-col min-h-screen bg-gradient-to-br from-white to-pink-50'>
      <AppHeader title='Loan Agreement' onBackClick={() => router.back()} />

      <main className='flex-1 pt-16 pb-20 px-4 max-w-md mx-auto w-full'>
        <div className='h-[70vh]'>
          <PDFViewer />
        </div>
      </main>

      <NavBar />
    </div>
  );
}
