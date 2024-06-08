import '../public/styles.css';
import { useEffect, useState } from 'react';
import { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import store from '../redux/store';
import { updateTime } from '../utils/clock';
import { useSelector } from 'react-redux';

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSelector((state: any) => state.settings.theme);

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  return <>{children}</>;
}

function MyApp({ Component, pageProps }: AppProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    updateTime();
    const intervalId = setInterval(updateTime, 1000);
    return () => clearInterval(intervalId);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <Provider store={store}>
      <ThemeProvider>
        <Component {...pageProps} />
      </ThemeProvider>
    </Provider>
  );
}

export default MyApp;
