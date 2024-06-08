export const Utils = {
    addHttp: (url: string) => {
      if (!/^https?:\/\//i.test(url)) {
        return 'http://' + url;
      }
      return url;
    },
    isValidUrl: (url: string) => {
      try {
        new URL(url);
        return true;
      } catch (_) {
        return false;
      }
    },
    saveToLocalStorage: (key: string, data: any) => {
      localStorage.setItem(key, JSON.stringify(data));
    },
    loadFromLocalStorage: (key: string) => {
      return JSON.parse(localStorage.getItem(key) || '[]');
    },
    getFaviconUrl: (url: string) => {
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}`;
    },
    showMessage: (message: string, type: string) => {
      const messageElement = document.getElementById('message');
      if (messageElement) {
        messageElement.textContent = message;
        messageElement.className = `message ${type}`;
        messageElement.style.display = 'block';
        setTimeout(() => {
          messageElement.style.display = 'none';
        }, 3000);
      }
    },
  };
  