import { useEffect } from 'react';
import ReactGA from 'react-ga4';
import { useLocation } from 'react-router-dom';

declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'js' | 'set',
      targetId: string | Date,
      config?: Record<string, any>,
    ) => void;
    dataLayer: any[];
  }
}

const MEASUREMENT_ID = process.env.REACT_APP_GA4_MEASUREMENT_ID;

const useGoogleAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    if (MEASUREMENT_ID) {
      ReactGA.initialize(MEASUREMENT_ID);
    }
  }, []);

  useEffect(() => {
    if (MEASUREMENT_ID) {
      ReactGA.send({
        hitType: 'pageview',
        page: location.pathname + location.search,
      });
    }
  }, [location]);
};

export { useGoogleAnalytics };
