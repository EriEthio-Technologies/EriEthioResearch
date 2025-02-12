import { useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';

export function usePageEvents() {
  const supabase = createClient();

  const trackEvent = useCallback(async (
    eventType: string,
    eventData: Record<string, any> = {}
  ) => {
    try {
      // Get the current page view ID from localStorage
      const pageViewId = localStorage.getItem('current_page_view_id');
      if (!pageViewId) return;

      await supabase.rpc('track_page_event', {
        _page_view_id: pageViewId,
        _event_type: eventType,
        _event_data: eventData
      });
    } catch (error) {
      console.error('Error tracking page event:', error);
    }
  }, []);

  useEffect(() => {
    // Track scroll depth
    let maxScrollDepth = 0;
    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollTop = window.scrollY;
        const scrollDepth = Math.round((scrollTop / scrollHeight) * 100);

        if (scrollDepth > maxScrollDepth) {
          maxScrollDepth = scrollDepth;
          trackEvent('scroll_depth', { depth: scrollDepth });
        }
      }, 500);
    };

    // Track time on page
    const startTime = Date.now();
    let timeOnPageInterval: NodeJS.Timeout;

    const trackTimeOnPage = () => {
      const timeOnPage = Math.round((Date.now() - startTime) / 1000);
      trackEvent('time_on_page', { seconds: timeOnPage });
    };

    timeOnPageInterval = setInterval(trackTimeOnPage, 30000); // Every 30 seconds

    // Track clicks on interactive elements
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target) return;

      // Track button clicks
      if (
        target.tagName === 'BUTTON' ||
        target.closest('button') ||
        target.getAttribute('role') === 'button'
      ) {
        trackEvent('button_click', {
          text: target.textContent?.trim(),
          id: target.id,
          class: target.className
        });
      }

      // Track link clicks
      if (target.tagName === 'A' || target.closest('a')) {
        const link = target.tagName === 'A' ? target : target.closest('a');
        if (!link) return;

        trackEvent('link_click', {
          href: (link as HTMLAnchorElement).href,
          text: link.textContent?.trim(),
          id: link.id,
          class: link.className
        });
      }
    };

    // Track form submissions
    const handleSubmit = (event: Event) => {
      const form = event.target as HTMLFormElement;
      if (!form) return;

      trackEvent('form_submit', {
        id: form.id,
        action: form.action,
        method: form.method
      });
    };

    // Track copy events
    const handleCopy = () => {
      const selectedText = window.getSelection()?.toString().trim();
      if (!selectedText) return;

      trackEvent('text_copy', {
        text: selectedText.length > 100
          ? selectedText.slice(0, 100) + '...'
          : selectedText
      });
    };

    // Add event listeners
    window.addEventListener('scroll', handleScroll);
    document.addEventListener('click', handleClick);
    document.addEventListener('submit', handleSubmit);
    document.addEventListener('copy', handleCopy);

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('click', handleClick);
      document.removeEventListener('submit', handleSubmit);
      document.removeEventListener('copy', handleCopy);
      clearTimeout(scrollTimeout);
      clearInterval(timeOnPageInterval);

      // Track final time on page
      trackTimeOnPage();
    };
  }, [trackEvent]);

  return { trackEvent };
} 