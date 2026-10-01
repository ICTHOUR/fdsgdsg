'use client';

import React, { useEffect } from 'react';
import Script from 'next/script';

interface AdSenseScriptProps {
  clientId?: string;
  enabled?: boolean;
}

export const AdSenseScript: React.FC<AdSenseScriptProps> = ({
  clientId = 'ca-pub-811400024240001',
  enabled = true,
}) => {
  useEffect(() => {
    if (!enabled || !clientId) return;
    
    // Check if running inside iframe or preview sandbox domains
    const isIframe = typeof window !== 'undefined' && (
      window.self !== window.top || 
      window.location.hostname.includes('run.app') || 
      window.location.hostname.includes('aistudio') ||
      window.location.hostname.includes('localhost')
    );
    if (isIframe) return;

    try {
      const unfilledIns = document.querySelectorAll('ins.adsbygoogle:not([data-adsbygoogle-status])');
      if (unfilledIns.length > 0) {
        // Trigger adsbygoogle push initialization if uninitialized ad slots exist
        // @ts-expect-error Google AdSense global
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (e) {
      // Safe guard against benign AdSense push errors
    }
  }, [clientId, enabled]);

  // Disable completely in preview / sandbox contexts
  const isPreview = typeof window !== 'undefined' && (
    window.self !== window.top || 
    window.location.hostname.includes('run.app') || 
    window.location.hostname.includes('aistudio')
  );

  if (!enabled || !clientId || isPreview) return null;

  return (
    <Script
      id="google-adsense-script"
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
};
