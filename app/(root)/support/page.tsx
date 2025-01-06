'use client';

import { useEffect } from 'react';
import { 
  Box, 
  useTheme,
  alpha
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';
import { auth } from '../../../lib/firebase';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import EmailIcon from '@mui/icons-material/Email';
import ChatIcon from '@mui/icons-material/Chat';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import Image from 'next/image';

declare global {
  interface Window {
    Intercom: any;
  }
}

export default function SupportPage() {
  const { userProfile } = useUser();
  const router = useRouter();
  const theme = useTheme();

  const handleBack = () => {
    router.back();
  };

  const handleWhatsApp = () => {
    window.open('https://wa.me/919876543210', '_blank');
  };

  const handleEmail = () => {
    window.open('mailto:support@credmate.com');
  };

  const handleLiveChat = () => {
    if (window.Intercom) {
      window.Intercom('show');
      window.Intercom('showNewMessage');
    }
  };

  useEffect(() => {
    const authToken = document.cookie
      .split('; ')
      .find(row => row.startsWith('authToken='))
      ?.split('=')[1];

    if (!authToken) {
      router.push('/auth/phone');
      return;
    }

    const script = document.createElement('script');
    script.innerHTML = `
      window.intercomSettings = {
        api_base: "https://api-iam.intercom.io",
        app_id: "z6rqm674",
        ${userProfile ? `
        name: "${userProfile.name || 'User'}", 
        email: "${userProfile.email || ''}", 
        user_id: "${userProfile.id}",
        created_at: ${Math.floor(new Date(userProfile.createdAt || Date.now()).getTime() / 1000)},
        hide_default_launcher: true
        ` : ''}
      };

      (function(){var w=window;var ic=w.Intercom;if(typeof ic==="function"){ic('reattach_activator');ic('update',w.intercomSettings);}else{var d=document;var i=function(){i.c(arguments);};i.q=[];i.c=function(args){i.q.push(args);};w.Intercom=i;var l=function(){var s=d.createElement('script');s.type='text/javascript';s.async=true;s.src='https://widget.intercom.io/widget/z6rqm674';var x=d.getElementsByTagName('script')[0];x.parentNode.insertBefore(s,x);};if(document.readyState==='complete'){l();}else if(w.attachEvent){w.attachEvent('onload',l);}else{w.addEventListener('load',l,false);}}})();
    `;
    document.body.appendChild(script);

    return () => {
      if (window.Intercom) {
        window.Intercom('shutdown');
      }
      document.body.removeChild(script);
    };
  }, [userProfile, router]);

  return (
    <Box sx={{ 
      minHeight: '100vh',
      bgcolor: 'white',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div className="fixed top-0 left-0 right-0 z-50">
        <div className="bg-white/80 backdrop-blur-lg border-b border-neutral-100">
          <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
            <button 
              onClick={handleBack}
              className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-300 active:scale-95"
            >
              <Image
                src="/images/searchprofileicons/arrowbendleft.svg"
                alt="Back"
                width={20} 
                height={20}
                className="opacity-70"
              />
            </button>
            <h1 className="text-lg font-semibold bg-gradient-to-r from-pink-700 to-pink-500 bg-clip-text text-transparent">
              Help & Support
            </h1>
            <div className="w-10" />
          </div>
        </div>
      </div>

      <main className="flex-1 overflow-y-auto">
        <div className="px-6 pt-16 pb-24 bg-gradient-to-br from-white to-pink-50 min-h-full">
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-pink-100 p-6 mb-8">
              <div className="w-16 h-16 rounded-full bg-pink-100 flex items-center justify-center mx-auto mb-4">
                <SupportAgentIcon sx={{ fontSize: 32, color: '#A2195E' }} />
              </div>
              <h1 className="text-2xl font-bold text-neutral-800 mb-3 bg-gradient-to-r from-pink-700 to-pink-500 bg-clip-text text-transparent text-center">
                How can we help you?
              </h1>
              <p className="text-base text-neutral-600 text-center mb-0">
                Choose your preferred method to connect with us
              </p>
            </div>

            <div className="space-y-4">
              <button
                onClick={handleWhatsApp}
                className="w-full bg-white rounded-2xl shadow-sm overflow-hidden border border-pink-100 hover:border-pink-200 hover:shadow-md transition-all duration-300 p-4 flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-full bg-[#25D366]/10 flex items-center justify-center">
                  <WhatsAppIcon sx={{ fontSize: 24, color: '#25D366' }} />
                </div>
                <div className="flex-1 text-left">
                  <span className="text-base font-medium text-neutral-800 block">WhatsApp Support</span>
                  <p className="text-sm text-neutral-500 mt-1">Quick responses, 9 AM - 6 PM</p>
                </div>
              </button>

              <button
                onClick={handleEmail}
                className="w-full bg-white rounded-2xl shadow-sm overflow-hidden border border-pink-100 hover:border-pink-200 hover:shadow-md transition-all duration-300 p-4 flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
                  <EmailIcon sx={{ fontSize: 24, color: '#dc3545' }} />
                </div>
                <div className="flex-1 text-left">
                  <span className="text-base font-medium text-neutral-800 block">Email Support</span>
                  <p className="text-sm text-neutral-500 mt-1">We'll respond within 24 hours</p>
                </div>
              </button>

              <button
                onClick={handleLiveChat}
                className="w-full bg-white rounded-2xl shadow-sm overflow-hidden border border-pink-100 hover:border-pink-200 hover:shadow-md transition-all duration-300 p-4 flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-full bg-pink-50 flex items-center justify-center">
                  <ChatIcon sx={{ fontSize: 24, color: '#A2195E' }} />
                </div>
                <div className="flex-1 text-left">
                  <span className="text-base font-medium text-neutral-800 block">Live Chat</span>
                  <p className="text-sm text-neutral-500 mt-1">Chat with our support team</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </main>
    </Box>
  );
}
