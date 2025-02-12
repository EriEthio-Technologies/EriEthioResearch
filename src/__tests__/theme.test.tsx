import { renderHook, act } from '@testing-library/react';
import { useThemeTransition } from '@/hooks/useThemeTransition';
import { defaultAnimations } from '@/types/theme';

const mockTheme1 = {
  name: 'Theme 1',
  colors: {
    primary: '#000000',
    secondary: '#ffffff',
    accent: '#ff0000',
    background: '#f0f0f0',
    text: '#333333',
    muted: '#666666',
    border: '#cccccc'
  },
  fonts: {
    heading: 'Arial',
    body: 'Arial'
  },
  spacing: {
    base: 4,
    scale: 1.5
  },
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '16px'
  },
  animations: defaultAnimations
};

const mockTheme2 = {
  ...mockTheme1,
  name: 'Theme 2',
  colors: {
    primary: '#ffffff',
    secondary: '#000000',
    accent: '#00ff00',
    background: '#333333',
    text: '#f0f0f0',
    muted: '#999999',
    border: '#666666'
  }
};

describe('useThemeTransition', () => {
  it('should initialize with current theme', () => {
    const { result } = renderHook(() => useThemeTransition(mockTheme1));
    expect(result.current.currentDisplayTheme).toBe(mockTheme1);
    expect(result.current.isPreviewing).toBe(false);
    expect(result.current.isTransitioning).toBe(false);
  });

  it('should handle theme preview', () => {
    const { result } = renderHook(() => useThemeTransition(mockTheme1));
    
    act(() => {
      result.current.previewTheme(mockTheme2);
    });

    expect(result.current.isPreviewing).toBe(true);
    expect(result.current.currentDisplayTheme).toBe(mockTheme2);
  });

  it('should handle theme transition', () => {
    const { result } = renderHook(() => useThemeTransition(mockTheme1));
    
    act(() => {
      result.current.transitionToTheme(mockTheme2);
    });

    expect(result.current.isTransitioning).toBe(true);
    
    // Check if colors are being interpolated
    const currentColors = result.current.currentDisplayTheme.colors;
    Object.keys(currentColors).forEach(key => {
      const color = currentColors[key as keyof typeof currentColors];
      expect(color).toMatch(/^#[0-9a-f]{6}$/i);
    });
  });
}); 