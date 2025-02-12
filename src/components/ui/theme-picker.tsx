'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Palette } from 'lucide-react';
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

export function ThemePicker({ value, onChange }: ThemePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('presets');
  const [customTheme, setCustomTheme] = useState<Theme>(value);

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