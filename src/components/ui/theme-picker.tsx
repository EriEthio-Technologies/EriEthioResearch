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
  colors: Record<string, string>;
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
  },
];

export default function ThemePicker({ themes }: { themes: Theme[] }) {
  const [selectedTheme, setSelectedTheme] = useState<Theme>();

  const handlePresetSelect = (theme: Theme) => {
    setSelectedTheme(theme);
  };

  const handleCustomThemeChange = (updates: Partial<Theme>) => {
    if (selectedTheme) {
      const updatedTheme = {
        ...selectedTheme,
        ...updates,
      };
      setSelectedTheme(updatedTheme);
    }
  };

  const handleExportTheme = () => {
    if (selectedTheme) {
      const themeData = JSON.stringify(selectedTheme, null, 2);
      const blob = new Blob([themeData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `theme-${selectedTheme.name.toLowerCase().replace(/\s+/g, '-')}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
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
          importedTheme.colors
        ) {
          setSelectedTheme(importedTheme);
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
    setSelectedTheme(theme);
    // Apply preview theme temporarily
    Object.entries(theme.colors).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--preview-${key}`, value);
    });
    setTimeout(() => {
      setSelectedTheme(undefined);
      // Remove preview styles
      Object.keys(theme.colors).forEach((key) => {
        document.documentElement.style.removeProperty(`--preview-${key}`);
      });
    }, 2000);
  };

  return (
    <Popover open={!!selectedTheme} onOpenChange={(isOpen) => !isOpen && setSelectedTheme(undefined)}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between"
          onClick={() => setSelectedTheme(themes[0])}
        >
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4" />
            <span>Theme: {selectedTheme?.name}</span>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-4">
        <Tabs value="presets" onValueChange="presets">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="presets" className="flex-1">Presets</TabsTrigger>
          </TabsList>

          <TabsContent value="presets">
            <div className="grid grid-cols-1 gap-4">
              {themes.map((theme) => (
                <motion.button
                  key={theme.name}
                  className={`
                    p-4 rounded-lg border transition-colors text-left
                    ${selectedTheme?.name === theme.name
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
                    {selectedTheme?.name === theme.name && (
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
        </Tabs>
      </PopoverContent>
    </Popover>
  );
} 