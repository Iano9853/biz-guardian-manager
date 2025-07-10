import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.47753d81067949429cfcd4ade0ce8255',
  appName: 'biz-guardian-manager',
  webDir: 'dist',
  server: {
    url: 'https://47753d81-0679-4942-9cfc-d4ade0ce8255.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      launchAutoHide: true,
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      backgroundColor: '#000000'
    }
  }
};

export default config;