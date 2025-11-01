
import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { X, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PWAInstaller = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBanner(true);
    };

    const handleAppInstalled = () => {
      setShowInstallBanner(false);
      setDeferredPrompt(null);
      toast({
        title: "تم التثبيت بنجاح!",
        description: "شكراً لتثبيت التطبيق. استمتع بقراءة المانغا!",
      });
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [toast]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    }
    setDeferredPrompt(null);
    setShowInstallBanner(false);
  };

  const handleDismiss = () => {
    setShowInstallBanner(false);
  };

  return (
    <AnimatePresence>
      {showInstallBanner && (
        <motion.div
          initial={{ y: 200 }}
          animate={{ y: 0 }}
          exit={{ y: 200 }}
          transition={{ type: 'spring', stiffness: 100 }}
          className="fixed bottom-24 left-4 right-4 z-[60] max-w-md mx-auto"
        >
          <div className="bg-coral text-white p-4 rounded-xl shadow-lg border border-white/20" style={{'--accent-coral': '#e85a4f'}}>
            <div className="flex items-center justify-between gap-4">
              <div className="flex-shrink-0">
                <Download className="w-8 h-8"/>
              </div>
              <div>
                <h3 className="font-bold text-base">تثبيت التطبيق</h3>
                <p className="text-sm opacity-90">احصل على أفضل تجربة بتثبيت التطبيق.</p>
              </div>
              <div className="flex items-center gap-2">
                <Button onClick={handleInstallClick} className="bg-white text-coral hover:bg-white/90 font-bold" style={{'--accent-coral': '#e85a4f'}}>
                  تثبيت
                </Button>
                <Button onClick={handleDismiss} variant="ghost" size="icon" className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/20">
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PWAInstaller;
