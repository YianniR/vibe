export const loadWebsitesFromLocalStorage = () => {
    if (typeof window !== 'undefined') {
      return JSON.parse(localStorage.getItem('websites')) || [];
    }
    return [];
  };
  
  export const saveWebsitesToLocalStorage = (data: any) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('websites', JSON.stringify(data));
    }
  };
  