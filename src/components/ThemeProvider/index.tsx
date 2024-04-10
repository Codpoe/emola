import { createContext, useContext, useEffect, useState } from 'react';
import { Helmet, isBrowser } from 'servite/client';
import { Theme, ThemeConfig } from './themes';
import initThemeScriptStr from '@/prebuild/initTheme.prebuilt?raw';

export { type Theme, type ThemeConfig };

interface ThemeContextValue {
  themeConfig: ThemeConfig;
  setThemeConfig: React.Dispatch<React.SetStateAction<ThemeConfig>>;
}

const themeContext = createContext<ThemeContextValue>({} as any);

export interface ThemeProviderProps {
  children?: React.ReactNode;
}

export function ThemeProvider(props: ThemeProviderProps) {
  const { children } = props;

  const [themeConfig, setThemeConfig] = useState<ThemeConfig>(() => {
    if (isBrowser) {
      return window.__SERVITE_themeUtils__.getInitialThemeConfig();
    } else {
      return {
        name: 'zinc',
        mode: 'light',
      };
    }
  });

  useEffect(() => {
    // 监听 media change，重新设置 theme
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleMediaQueryChange = (e: MediaQueryListEvent) => {
      setThemeConfig(prev => ({ ...prev, mode: e.matches ? 'dark' : 'light' }));
    };

    mediaQuery.addEventListener('change', handleMediaQueryChange);

    return () => {
      mediaQuery.removeEventListener('change', handleMediaQueryChange);
    };
  }, []);

  useEffect(() => {
    if (themeConfig !== window.__SERVITE_themeUtils__.getInitialThemeConfig()) {
      window.__SERVITE_themeUtils__.setThemeConfig(themeConfig, true);
    }
  }, [themeConfig]);

  return (
    <>
      <Helmet>
        <script>{initThemeScriptStr}</script>
      </Helmet>
      <themeContext.Provider value={{ themeConfig, setThemeConfig }}>
        {children}
      </themeContext.Provider>
    </>
  );
}

export function useTheme() {
  return useContext(themeContext);
}
