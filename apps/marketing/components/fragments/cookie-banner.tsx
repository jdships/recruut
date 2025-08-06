'use client';

import * as React from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'motion/react';

import { Button } from '@workspace/ui/components/button';

const KEY = 'cookie_consent';

export function CookieBanner(): React.JSX.Element {
  const [showBanner, setShowBanner] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (!localStorage.getItem(KEY)) {
      setShowBanner(true);
    }
  }, []);

  const handleDenyCookies = (): void => {
    setShowBanner(false);
    localStorage.setItem(KEY, 'denied');
  };

  const handleAcceptCookies = (): void => {
    setShowBanner(false);
    localStorage.setItem(KEY, 'accepted');
  };

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{
            opacity: 1,
            y: 0,
            transition: {
              duration: 0.3,
              delay: 2
            }
          }}
          exit={{
            opacity: 0,
            y: 50,
            transition: {
              duration: 0.3
            }
          }}
          className="fixed inset-x-2 bottom-2 z-50 rounded-xl sm:bottom-4 sm:left-4 sm:right-auto sm:max-w-sm"
        >
          <div className="rounded-xl border bg-background p-4 shadow-lg">
            <p className="mb-3 text-sm">
              We use cookies primarily for analytics and to enhance your
              experience. By accepting you agree to our use of cookies.{' '}
              <Link
                href="/cookie-policy"
                className="underline hover:text-primary"
              >
                Learn more
              </Link>
            </p>
            <div className="flex flex-row gap-2">
              <Button
                type="button"
                variant="outline"
                className="w-1/2"
                onClick={handleDenyCookies}
              >
                Deny
              </Button>
              <Button
                type="button"
                variant="default"
                className="w-1/2"
                onClick={handleAcceptCookies}
              >
                Accept
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
