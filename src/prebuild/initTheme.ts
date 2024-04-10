import { themes, ThemeConfig } from '@/components/ThemeProvider/themes';

declare global {
  interface Window {
    __SERVITE_themeUtils__: {
      getThemes: () => typeof themes;
      getInitialThemeConfig: () => ThemeConfig;
      setThemeConfig: (
        themeConfig: ThemeConfig,
        saveToStorage?: boolean
      ) => void;
    };
  }
}

const THEME_STORAGE_KEY = 'emola:theme';

const defaultLightThemeConfig: ThemeConfig = {
  name: 'zinc',
  mode: 'light',
};

const defaultDarkThemeConfig: ThemeConfig = {
  name: 'zinc',
  mode: 'dark',
};

let initialThemeConfig = defaultLightThemeConfig;
const themeStr = window.localStorage.getItem(THEME_STORAGE_KEY);

// 优先使用 storage 里已有的 theme
if (themeStr) {
  initialThemeConfig = JSON.parse(themeStr);
} else if (window.matchMedia) {
  // 如果 storage 没有的话就再判断 prefers-color-scheme
  const { matches } = window.matchMedia('(prefers-color-scheme: dark)');
  initialThemeConfig = matches
    ? defaultDarkThemeConfig
    : defaultLightThemeConfig;
}

/**
 * 挂载 theme css 变量
 */
const mountThemeCssVars = (themeConfig: ThemeConfig) => {
  const theme = themes.find(x => x.name === themeConfig.name) || themes[0];
  const cssVars = theme.cssVars[themeConfig.mode];

  let styleEl = document.querySelector(
    'style[emola-theme]'
  ) as HTMLStyleElement | null;
  const exist = Boolean(styleEl);

  styleEl ||= document.createElement('style');

  styleEl.setAttribute('emola-theme', '');
  styleEl.innerHTML = `
    :root {
      ${Object.keys(cssVars)
        .map(key => `--${key}: ${cssVars[key as keyof typeof cssVars]};`)
        .join('\n')}
    }
  `;
  if (!exist) {
    document.documentElement.appendChild(styleEl);
  }
};

const setThemeConfig = (themeConfig: ThemeConfig, saveToStorage = false) => {
  // 切换 html 的类名
  if (themeConfig.mode === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }

  // 挂载新的 css 变量
  mountThemeCssVars(themeConfig);

  // 存到 storage
  if (saveToStorage) {
    window.localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(themeConfig));
  }
};

// 设置初始主题
setThemeConfig(initialThemeConfig);

// 暴露给 react 应用里使用
window.__SERVITE_themeUtils__ = {
  getThemes() {
    return themes;
  },
  getInitialThemeConfig() {
    return initialThemeConfig;
  },
  setThemeConfig,
};
