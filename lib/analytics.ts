// lib/analytics.ts

export const trackEvent = (eventName: string, eventParams?: Record<string, any>) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, eventParams);
  }
};

export const trackQuoteSubmission = (formData: {
  source: 'calculator' | 'quote_form';
  participants?: number;
  duration?: string;
  location?: string;
  estimatedBudget?: string;
}) => {
  trackEvent('generate_lead', {
    event_category: 'engagement',
    event_label: formData.source,
    value: formData.participants || 0,
    lead_source: formData.source,
    location: formData.location || 'unknown',
    duration: formData.duration || 'unknown',
    estimated_budget: formData.estimatedBudget || 'unknown',
  });
};
