import { useEffect } from 'react';
import { CustomizationSettings } from '@/types/customization';

export function usePageCustomization(settings: CustomizationSettings) {
  useEffect(() => {
    // Apply layout settings
    document.documentElement.style.setProperty('--content-width', getContentWidth(settings.layout.width));
    document.documentElement.style.setProperty('--content-padding', getPaddingSize(settings.layout.padding));
    document.documentElement.style.setProperty('--grid-gap', getGapSize(settings.layout.gap));
    document.documentElement.style.setProperty('--grid-columns', settings.layout.columns.toString());

    // Apply typography settings
    document.documentElement.style.setProperty('--heading-font', settings.typography.headingFont);
    document.documentElement.style.setProperty('--body-font', settings.typography.bodyFont);
    document.documentElement.style.setProperty('--base-font-size', `${settings.typography.baseSize}px`);
    document.documentElement.style.setProperty('--scale-ratio', settings.typography.scaleRatio.toString());

    // Apply color settings
    document.documentElement.style.setProperty('--color-primary', settings.colors.primary);
    document.documentElement.style.setProperty('--color-secondary', settings.colors.secondary);
    document.documentElement.style.setProperty('--color-accent', settings.colors.accent);
    document.documentElement.style.setProperty('--color-background', settings.colors.background);
    document.documentElement.style.setProperty('--color-text', settings.colors.text);

    // Apply effects settings
    if (settings.effects.smoothScroll) {
      document.documentElement.style.scrollBehavior = 'smooth';
    } else {
      document.documentElement.style.scrollBehavior = 'auto';
    }

    // Apply custom CSS
    let customStyleSheet = document.getElementById('custom-styles') as HTMLStyleElement;
    if (!customStyleSheet) {
      customStyleSheet = document.createElement('style');
      customStyleSheet.id = 'custom-styles';
      document.head.appendChild(customStyleSheet);
    }
    customStyleSheet.textContent = settings.advanced.customCSS;

    // Apply custom JavaScript
    if (settings.advanced.customJS) {
      try {
        const script = document.createElement('script');
        script.text = settings.advanced.customJS;
        document.body.appendChild(script);
      } catch (error) {
        console.error('Error applying custom JavaScript:', error);
      }
    }

    // Apply custom meta tags
    if (settings.advanced.metaTags) {
      const metaContainer = document.createElement('div');
      metaContainer.innerHTML = settings.advanced.metaTags;
      const metaTags = metaContainer.getElementsByTagName('meta');
      Array.from(metaTags).forEach(tag => {
        document.head.appendChild(tag);
      });
    }

    // Apply custom classes to body
    if (settings.advanced.customClasses) {
      document.body.className = settings.advanced.customClasses;
    }

    // Cleanup function
    return () => {
      // Remove custom styles
      if (customStyleSheet) {
        customStyleSheet.remove();
      }

      // Reset body classes
      document.body.className = '';

      // Reset CSS variables
      const cssVars = [
        '--content-width',
        '--content-padding',
        '--grid-gap',
        '--grid-columns',
        '--heading-font',
        '--body-font',
        '--base-font-size',
        '--scale-ratio',
        '--color-primary',
        '--color-secondary',
        '--color-accent',
        '--color-background',
        '--color-text'
      ];

      cssVars.forEach(variable => {
        document.documentElement.style.removeProperty(variable);
      });

      // Reset scroll behavior
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, [settings]);
}

// Helper functions
function getContentWidth(width: string): string {
  switch (width) {
    case 'container':
      return '1200px';
    case 'full':
      return '100%';
    case 'narrow':
      return '800px';
    default:
      return '1200px';
  }
}

function getPaddingSize(size: string): string {
  switch (size) {
    case 'none':
      return '0';
    case 'sm':
      return '1rem';
    case 'md':
      return '2rem';
    case 'lg':
      return '4rem';
    default:
      return '2rem';
  }
}

function getGapSize(size: string): string {
  switch (size) {
    case 'none':
      return '0';
    case 'sm':
      return '0.5rem';
    case 'md':
      return '1rem';
    case 'lg':
      return '2rem';
    default:
      return '1rem';
  }
} 