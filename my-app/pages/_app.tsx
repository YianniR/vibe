import '../public/styles.css';
import { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import store from '../redux/store';
import { updateTime } from '../utils/clock';

function MyApp({ Component, pageProps }) {
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
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;
