export interface CustomizationSettings {
  layout: LayoutSettings;
  typography: TypographySettings;
  colors: ColorSettings;
  effects: EffectSettings;
  advanced: AdvancedSettings;
  seo: SEOSettings;
  performance: PerformanceSettings;
  accessibility: AccessibilitySettings;
  internationalization: I18nSettings;
  security: SecuritySettings;
}

export interface PageCustomizationProps {
  initialSettings?: CustomizationSettings;
  onUpdate: (settings: CustomizationSettings) => Promise<void>;
}

export interface ColorPickerProps {
  value: string;
  onChange: (value: string) => void;
}

export interface LayoutSettings {
  type: 'default' | 'sidebar' | 'landing' | 'blog' | 'docs' | 'portfolio' | 'ecommerce';
  width: 'container' | 'full' | 'narrow' | 'custom';
  customWidth?: string;
  padding: 'none' | 'sm' | 'md' | 'lg' | 'custom';
  customPadding?: string;
  gap: 'none' | 'sm' | 'md' | 'lg' | 'custom';
  customGap?: string;
  columns: number;
  maxWidth?: string;
  contentAlignment: 'left' | 'center' | 'right';
  verticalSpacing: 'compact' | 'normal' | 'relaxed';
  headerStyle: 'fixed' | 'sticky' | 'static';
  footerStyle: 'simple' | 'expanded' | 'minimal';
  sidebarPosition?: 'left' | 'right';
  sidebarWidth?: string;
  containerPadding?: string;
  breakpoints: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
  };
}

export interface TypographySettings {
  headingFont: string;
  bodyFont: string;
  monoFont: string;
  baseSize: number;
  scaleRatio: number;
  lineHeight: number;
  paragraphSpacing: number;
  fontWeights: {
    light: number;
    normal: number;
    medium: number;
    semibold: number;
    bold: number;
  };
  letterSpacing: {
    tight: string;
    normal: string;
    wide: string;
  };
  headingSizes: {
    h1: string;
    h2: string;
    h3: string;
    h4: string;
    h5: string;
    h6: string;
  };
  customFonts?: {
    name: string;
    url: string;
    weight?: number;
    style?: string;
  }[];
}

export interface ColorSettings {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  success: string;
  warning: string;
  error: string;
  info: string;
  muted: string;
  surface: string;
  border: string;
  shadow: string;
  overlay: string;
  gradients: {
    primary: {
      from: string;
      to: string;
      direction?: string;
    };
    secondary: {
      from: string;
      to: string;
      direction?: string;
    };
  };
  darkMode: {
    background: string;
    text: string;
    surface: string;
    border: string;
  };
  customColors?: Record<string, string>;
}

export interface EffectSettings {
  animations: boolean;
  parallax: boolean;
  fadeIn: boolean;
  smoothScroll: boolean;
  animationDuration: string;
  animationTiming: 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out';
  transitionDuration: string;
  scrollBehavior: 'smooth' | 'auto';
  hoverEffects: {
    scale: boolean;
    shadow: boolean;
    glow: boolean;
  };
  loadingEffects: {
    skeleton: boolean;
    blur: boolean;
    fade: boolean;
  };
  customAnimations?: Record<string, {
    keyframes: string;
    duration: string;
    timing: string;
  }>;
}

export interface AdvancedSettings {
  customCSS: string;
  customJS: string;
  metaTags: string;
  customClasses: string;
  customAttributes?: Record<string, string>;
  inlineStyles?: Record<string, string>;
  scriptLoading: 'defer' | 'async' | 'normal';
  cssModules: boolean;
  prefetch: boolean;
  preload: string[];
  criticalCSS: string;
  customFunctions?: Record<string, string>;
}

export interface SEOSettings {
  title: string;
  description: string;
  keywords: string[];
  ogImage: string;
  ogTitle: string;
  ogDescription: string;
  twitterCard: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  canonicalUrl: string;
  robots: string;
  structuredData: string;
  alternateLanguages: Record<string, string>;
  metaViewport: string;
  favicon: string;
  appleTouchIcon: string;
  manifestJson: string;
}

export interface PerformanceSettings {
  imageLazyLoading: boolean;
  imageOptimization: {
    quality: number;
    format: 'auto' | 'webp' | 'avif';
    sizes: string[];
  };
  caching: {
    browser: boolean;
    cdn: boolean;
    serverSide: boolean;
  };
  minification: {
    html: boolean;
    css: boolean;
    js: boolean;
  };
  compression: boolean;
  deferLoading: boolean;
  preconnect: string[];
  dns_prefetch: string[];
}

export interface AccessibilitySettings {
  aria: {
    landmarks: boolean;
    labels: boolean;
    descriptions: boolean;
  };
  contrast: {
    minimum: number;
    enhanced: boolean;
  };
  focusVisible: boolean;
  reducedMotion: boolean;
  skipLinks: boolean;
  semanticHTML: boolean;
  keyboardNavigation: boolean;
  screenReaderOnly: string[];
  textAlternatives: {
    images: boolean;
    videos: boolean;
    audio: boolean;
  };
}

export interface I18nSettings {
  defaultLocale: string;
  supportedLocales: string[];
  fallbackLocale: string;
  direction: 'ltr' | 'rtl';
  numberFormat: {
    locale: string;
    currency: string;
    style: string;
  };
  dateFormat: {
    locale: string;
    format: string;
  };
  translations: Record<string, Record<string, string>>;
}

export interface SecuritySettings {
  contentSecurityPolicy: boolean;
  xssProtection: boolean;
  frameOptions: 'deny' | 'sameorigin' | 'allow-from';
  contentTypeOptions: boolean;
  referrerPolicy: string;
  permissions: string[];
  cors: {
    enabled: boolean;
    origins: string[];
    methods: string[];
  };
}

export const defaultSettings: CustomizationSettings = {
  layout: {
    type: 'default',
    width: 'container',
    padding: 'md',
    gap: 'md',
    columns: 12
  },
  typography: {
    headingFont: 'Inter',
    bodyFont: 'Inter',
    baseSize: 16,
    scaleRatio: 1.25
  },
  colors: {
    primary: '#2563eb',
    secondary: '#16a34a',
    accent: '#f59e0b',
    background: '#ffffff',
    text: '#1f2937'
  },
  effects: {
    animations: true,
    parallax: false,
    fadeIn: true,
    smoothScroll: true
  },
  advanced: {
    customCSS: '',
    customJS: '',
    metaTags: '',
    customClasses: ''
  },
  seo: {
    title: '',
    description: '',
    keywords: [],
    ogImage: '',
    ogTitle: '',
    ogDescription: '',
    twitterCard: '',
    twitterTitle: '',
    twitterDescription: '',
    twitterImage: '',
    canonicalUrl: '',
    robots: '',
    structuredData: '',
    alternateLanguages: {},
    metaViewport: '',
    favicon: '',
    appleTouchIcon: '',
    manifestJson: ''
  },
  performance: {
    imageLazyLoading: true,
    imageOptimization: {
      quality: 80,
      format: 'auto',
      sizes: ['100vw']
    },
    caching: {
      browser: true,
      cdn: true,
      serverSide: true
    },
    minification: {
      html: true,
      css: true,
      js: true
    },
    compression: true,
    deferLoading: true,
    preconnect: [],
    dns_prefetch: []
  },
  accessibility: {
    aria: {
      landmarks: true,
      labels: true,
      descriptions: true
    },
    contrast: {
      minimum: 4.5,
      enhanced: true
    },
    focusVisible: true,
    reducedMotion: false,
    skipLinks: true,
    semanticHTML: true,
    keyboardNavigation: true,
    screenReaderOnly: [],
    textAlternatives: {
      images: true,
      videos: true,
      audio: true
    }
  },
  internationalization: {
    defaultLocale: 'en',
    supportedLocales: ['en'],
    fallbackLocale: 'en',
    direction: 'ltr',
    numberFormat: {
      locale: 'en',
      currency: 'USD',
      style: 'standard'
    },
    dateFormat: {
      locale: 'en',
      format: 'MMM d, yyyy'
    },
    translations: {}
  },
  security: {
    contentSecurityPolicy: true,
    xssProtection: true,
    frameOptions: 'deny',
    contentTypeOptions: true,
    referrerPolicy: 'strict-origin-when-cross-origin',
    permissions: [],
    cors: {
      enabled: false,
      origins: [],
      methods: []
    }
  }
};