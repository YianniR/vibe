export const loadSettingsFromLocalStorage = () => {
    if (typeof window !== 'undefined') {
      const settings = localStorage.getItem('settings');
      return settings ? JSON.parse(settings) : null;
    }
    return null;
  };
  
  export const saveSettingsToLocalStorage = (settings: any) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('settings', JSON.stringify(settings));
    }
  };
  
  
  
  export const saveWebsitesToLocalStorage = (websites: any) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('websites', JSON.stringify(websites));
    }
  };
  
  export const loadWebsitesFromLocalStorage = () => {
    if (typeof window !== 'undefined') {
      const websites = localStorage.getItem('websites');
      return websites ? JSON.parse(websites) : [];
    }
    return [];
  };
  
  