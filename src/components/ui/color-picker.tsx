'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ColorPickerProps } from '@/types/customization';
import { Check, ChevronDown } from 'lucide-react';

const presetColors = [
  '#2563eb', // blue-600
  '#16a34a', // green-600
  '#f59e0b', // amber-500
  '#dc2626', // red-600
  '#9333ea', // purple-600
  '#0891b2', // cyan-600
  '#ffffff', // white
  '#1f2937', // gray-800
];

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentColor, setCurrentColor] = useState(value);
  const [recentColors, setRecentColors] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setCurrentColor(value);
  }, [value]);

  const handleColorChange = (color: string) => {
    setCurrentColor(color);
    onChange(color);
    addToRecentColors(color);
    if (inputRef.current) {
      inputRef.current.value = color;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;
    if (isValidColor(color)) {
      handleColorChange(color);
    }
  };

  const addToRecentColors = (color: string) => {
    setRecentColors(prev => {
      const filtered = prev.filter(c => c !== color);
      return [color, ...filtered].slice(0, 5);
    });
  };

  const isValidColor = (color: string) => {
    const s = new Option().style;
    s.color = color;
    return s.color !== '';
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
            <div
              className="w-4 h-4 rounded-full border"
              style={{ backgroundColor: currentColor }}
            />
            <span>{currentColor}</span>
          </div>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Current Color</Label>
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-full border"
                style={{ backgroundColor: currentColor }}
              />
              <Input
                ref={inputRef}
                type="text"
                defaultValue={currentColor}
                onChange={handleInputChange}
                className="flex-1"
              />
            </div>
          </div>

          {recentColors.length > 0 && (
            <div className="space-y-2">
              <Label>Recent Colors</Label>
              <div className="grid grid-cols-8 gap-2">
                {recentColors.map((color, index) => (
                  <button
                    key={`${color}-${index}`}
                    className="w-6 h-6 rounded-full border relative"
                    style={{ backgroundColor: color }}
                    onClick={() => handleColorChange(color)}
                  >
                    {color === currentColor && (
                      <Check className="h-4 w-4 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white stroke-2" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label>Preset Colors</Label>
            <div className="grid grid-cols-8 gap-2">
              {presetColors.map((color, index) => (
                <button
                  key={`${color}-${index}`}
                  className="w-6 h-6 rounded-full border relative"
                  style={{ backgroundColor: color }}
                  onClick={() => handleColorChange(color)}
                >
                  {color === currentColor && (
                    <Check className="h-4 w-4 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white stroke-2" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <Input
              type="color"
              value={currentColor}
              onChange={e => handleColorChange(e.target.value)}
              className="w-full h-8"
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
} 