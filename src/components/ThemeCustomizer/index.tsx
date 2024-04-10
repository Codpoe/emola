import { Button } from 'shadcn-react';
import { MoonIcon, SunIcon } from 'shadcn-react/icons';
import { ThemeConfig, useTheme } from '../ThemeProvider';
import { cn } from '@/utils';

const themeModes: {
  mode: ThemeConfig['mode'];
  label: string;
  icon: React.ReactNode;
}[] = [
  { mode: 'light', label: 'Light', icon: <SunIcon /> },
  { mode: 'dark', label: 'Dark', icon: <MoonIcon /> },
];

export function ThemeCustomizer() {
  const { themeConfig, setThemeConfig } = useTheme();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="text-xs text-muted-foreground font-semibold">颜色</div>
        <div className="grid grid-cols-3 gap-2">
          {window.__SERVITE_themeUtils__.getThemes().map(theme => {
            const active = theme.name === themeConfig.name;
            return (
              <Button
                key={theme.name}
                className={cn(
                  'justify-start px-2',
                  active && 'border-primary bg-primary/10 hover:bg-primary/10'
                )}
                variant="outline"
                size="sm"
                onClick={() => {
                  setThemeConfig(prev => ({
                    ...prev,
                    name: theme.name,
                  }));
                }}
              >
                <div
                  className="w-5 h-5 flex-shrink-0 mr-1 rounded-full"
                  style={{
                    backgroundColor: `hsl(${theme.activeColor[themeConfig.mode]})`,
                  }}
                />
                {theme.label}
              </Button>
            );
          })}
        </div>
      </div>
      <div className="space-y-2">
        <div className="text-xs text-muted-foreground font-semibold">模式</div>
        <div className="grid grid-cols-2 gap-2">
          {themeModes.map(({ mode, label, icon }) => {
            const active = mode === themeConfig.mode;
            return (
              <Button
                key={mode}
                className={cn(
                  'justify-start px-2',
                  active && 'border-primary bg-primary/10 hover:bg-primary/10'
                )}
                variant="outline"
                size="sm"
                icon={icon}
                onClick={() => {
                  setThemeConfig(prev => ({
                    ...prev,
                    mode,
                  }));
                }}
              >
                {label}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
