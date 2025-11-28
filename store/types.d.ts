import type { RootState, AppDispatch } from './index';

declare module '@/store' {
  export const store: typeof import('./index').store;
  export type RootState = typeof import('./index').RootState;
  export type AppDispatch = typeof import('./index').AppDispatch;
}
