'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Palette, Download, Upload } from 'lucide-react';
import { ColorPicker } from '@/components/ui/color-picker';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface Theme {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    muted: string;
    border: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  spacing: {
    base: number;
    scale: number;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
  };
}

interface ThemePickerProps {
  value: Theme;
  onChange: (theme: Theme) => void;
}

const presetThemes: Theme[] = [
  {
    name: 'Modern Dark',
    colors: {
      primary: '#00FF9D',
      secondary: '#FF2079',
      accent: '#7928CA',
      background: '#0A0A0A',
      text: '#FFFFFF',
      muted: '#666666',
      border: '#333333',
    },
    fonts: {
      heading: 'Inter',
      body: 'Inter',
    },
    spacing: {
      base: 16,
      scale: 1.5,
    },
    borderRadius: {
      sm: '4px',
      md: '8px',
      lg: '16px',
    },
  },
  {
    name: 'Light Minimal',
    colors: {
      primary: '#2563EB',
      secondary: '#16A34A',
      accent: '#F59E0B',
      background: '#FFFFFF',
      text: '#1F2937',
      muted: '#9CA3AF',
      border: '#E5E7EB',
    },
    fonts: {
      heading: 'Inter',
      body: 'Inter',
    },
    spacing: {
      base: 16,
      scale: 1.5,
    },
    borderRadius: {
      sm: '4px',
      md: '8px',
      lg: '16px',
    },
  },
  {
    name: 'Cyberpunk',
    colors: {
      primary: '#FF00FF',
      secondary: '#00FFFF',
      accent: '#FFFF00',
      background: '#000000',
      text: '#FFFFFF',
      muted: '#666666',
      border: '#333333',
    },
    fonts: {
      heading: 'Inter',
      body: 'Inter',
    },
    spacing: {
      base: 16,
      scale: 1.5,
    },
    borderRadius: {
      sm: '0px',
      md: '0px',
      lg: '0px',
    },
  },
];

const defaultThemes: Theme[] = [
  {
    name: 'Neon Nights',
    colors: {
      primary: '#00FF9D',
      secondary: '#FF2079',
      accent: '#7928CA',
      background: '#0A0A0B',
      text: '#FFFFFF',
      muted: '#6B7280',
      border: '#1F2937'
    },
    fonts: {
      heading: 'Inter',
      body: 'Inter'
    },
    spacing: {
      base: 4,
      scale: 1.5
    },
    borderRadius: {
      sm: '0.25rem',
      md: '0.5rem',
      lg: '1rem'
    }
  },
  {
    name: 'Ocean Breeze',
    colors: {
      primary: '#0891B2',
      secondary: '#0EA5E9',
      accent: '#38BDF8',
      background: '#0F172A',
      text: '#F8FAFC',
      muted: '#64748B',
      border: '#1E293B'
    },
    fonts: {
      heading: 'Montserrat',
      body: 'Inter'
    },
    spacing: {
      base: 4,
      scale: 1.5
    },
    borderRadius: {
      sm: '0.375rem',
      md: '0.75rem',
      lg: '1.5rem'
    }
  },
  {
    name: 'Forest Dawn',
    colors: {
      primary: '#16A34A',
      secondary: '#22C55E',
      accent: '#4ADE80',
      background: '#052E16',
      text: '#ECFDF5',
      muted: '#059669',
      border: '#064E3B'
    },
    fonts: {
      heading: 'Poppins',
      body: 'Source Sans Pro'
    },
    spacing: {
      base: 4,
      scale: 1.618
    },
    borderRadius: {
      sm: '0.125rem',
      md: '0.25rem',
      lg: '0.5rem'
    }
  },
  {
    name: 'Sunset Gradient',
    colors: {
      primary: '#F59E0B',
      secondary: '#D97706',
      accent: '#FBBF24',
      background: '#7C2D12',
      text: '#FEF3C7',
      muted: '#B45309',
      border: '#92400E'
    },
    fonts: {
      heading: 'DM Sans',
      body: 'DM Sans'
    },
    spacing: {
      base: 4,
      scale: 1.4
    },
    borderRadius: {
      sm: '1rem',
      md: '1.5rem',
      lg: '2rem'
    }
  },
  {
    name: 'Royal Purple',
    colors: {
      primary: '#7C3AED',
      secondary: '#6D28D9',
      accent: '#8B5CF6',
      background: '#2E1065',
      text: '#F5F3FF',
      muted: '#7C3AED',
      border: '#4C1D95'
    },
    fonts: {
      heading: 'Raleway',
      body: 'Open Sans'
    },
    spacing: {
      base: 4,
      scale: 1.333
    },
    borderRadius: {
      sm: '0.5rem',
      md: '1rem',
      lg: '9999px'
    }
  }
];

export function ThemePicker({ value, onChange }: ThemePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('presets');
  const [customTheme, setCustomTheme] = useState<Theme>(value);
  const [customizing, setCustomizing] = useState(false);
  const [previewTheme, setPreviewTheme] = useState<Theme | null>(null);

  const handlePresetSelect = (theme: Theme) => {
    onChange(theme);
    setIsOpen(false);
  };

  const handleCustomThemeChange = (updates: Partial<Theme>) => {
    const updatedTheme = {
      ...customTheme,
      ...updates,
    };
    setCustomTheme(updatedTheme);
    onChange(updatedTheme);
  };

  const handleExportTheme = () => {
    const themeData = JSON.stringify(value, null, 2);
    const blob = new Blob([themeData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `theme-${value.name.toLowerCase().replace(/\s+/g, '-')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportTheme = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedTheme = JSON.parse(e.target?.result as string);
        // Validate imported theme structure
        if (
          importedTheme.name &&
          importedTheme.colors &&
          importedTheme.fonts &&
          importedTheme.spacing &&
          importedTheme.borderRadius
        ) {
          onChange(importedTheme);
        } else {
          alert('Invalid theme file format');
        }
      } catch (error) {
        console.error('Error importing theme:', error);
        alert('Error importing theme');
      }
    };
    reader.readAsText(file);
  };

  const handlePreview = (theme: Theme) => {
    setPreviewTheme(theme);
    // Apply preview theme temporarily
    Object.entries(theme.colors).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--preview-${key}`, value);
    });
    setTimeout(() => {
      setPreviewTheme(null);
      // Remove preview styles
      Object.keys(theme.colors).forEach((key) => {
        document.documentElement.style.removeProperty(`--preview-${key}`);
      });
    }, 2000);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between"
          onClick={() => setIsOpen(true)}
        >
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4" />
            <span>Theme: {value.name}</span>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full mb-4">
            <TabsTrigger value="presets" className="flex-1">Presets</TabsTrigger>
            <TabsTrigger value="customize" className="flex-1">Customize</TabsTrigger>
          </TabsList>

          <TabsContent value="presets">
            <div className="grid grid-cols-1 gap-4">
              {presetThemes.map((theme) => (
                <motion.button
                  key={theme.name}
                  className={`
                    p-4 rounded-lg border transition-colors text-left
                    ${value.name === theme.name
                      ? 'border-neon-cyan bg-neon-cyan/10'
                      : 'border-gray-700 hover:border-gray-600'
                    }
                  `}
                  onClick={() => handlePresetSelect(theme)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{theme.name}</span>
                    {value.name === theme.name && (
                      <Check className="w-4 h-4 text-neon-cyan" />
                    )}
                  </div>
                  <div className="flex gap-2">
                    {Object.values(theme.colors).map((color, index) => (
                      <div
                        key={index}
                        className="w-6 h-6 rounded-full border border-gray-700"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </motion.button>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="customize">
            <div className="space-y-6">
              <div className="space-y-4">
                <Label>Colors</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm">Primary</Label>
                    <ColorPicker
                      value={customTheme.colors.primary}
                      onChange={(color) =>
                        handleCustomThemeChange({
                          colors: { ...customTheme.colors, primary: color },
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label className="text-sm">Secondary</Label>
                    <ColorPicker
                      value={customTheme.colors.secondary}
                      onChange={(color) =>
                        handleCustomThemeChange({
                          colors: { ...customTheme.colors, secondary: color },
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label className="text-sm">Accent</Label>
                    <ColorPicker
                      value={customTheme.colors.accent}
                      onChange={(color) =>
                        handleCustomThemeChange({
                          colors: { ...customTheme.colors, accent: color },
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label className="text-sm">Background</Label>
                    <ColorPicker
                      value={customTheme.colors.background}
                      onChange={(color) =>
                        handleCustomThemeChange({
                          colors: { ...customTheme.colors, background: color },
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Label>Typography</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm">Heading Font</Label>
                    <select
                      value={customTheme.fonts.heading}
                      onChange={(e) =>
                        handleCustomThemeChange({
                          fonts: { ...customTheme.fonts, heading: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 bg-black/30 border border-gray-700 rounded-lg"
                    >
                      <option value="Inter">Inter</option>
                      <option value="Roboto">Roboto</option>
                      <option value="Open Sans">Open Sans</option>
                    </select>
                  </div>
                  <div>
                    <Label className="text-sm">Body Font</Label>
                    <select
                      value={customTheme.fonts.body}
                      onChange={(e) =>
                        handleCustomThemeChange({
                          fonts: { ...customTheme.fonts, body: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 bg-black/30 border border-gray-700 rounded-lg"
                    >
                      <option value="Inter">Inter</option>
                      <option value="Roboto">Roboto</option>
                      <option value="Open Sans">Open Sans</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Label>Spacing</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm">Base (px)</Label>
                    <input
                      type="number"
                      value={customTheme.spacing.base}
                      onChange={(e) =>
                        handleCustomThemeChange({
                          spacing: {
                            ...customTheme.spacing,
                            base: parseInt(e.target.value),
                          },
                        })
                      }
                      className="w-full px-3 py-2 bg-black/30 border border-gray-700 rounded-lg"
                    />
                  </div>
                  <div>
                    <Label className="text-sm">Scale</Label>
                    <input
                      type="number"
                      step="0.1"
                      value={customTheme.spacing.scale}
                      onChange={(e) =>
                        handleCustomThemeChange({
                          spacing: {
                            ...customTheme.spacing,
                            scale: parseFloat(e.target.value),
                          },
                        })
                      }
                      className="w-full px-3 py-2 bg-black/30 border border-gray-700 rounded-lg"
                    />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
} 