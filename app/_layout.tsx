 import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from '../store';

export default function RootLayout() {
  useEffect(() => {
     
    if (typeof document !== 'undefined') {
      document.title = 'Shopping List App';
    }
  }, []);

  return (
    <Provider store={store}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </Provider>
  );
}