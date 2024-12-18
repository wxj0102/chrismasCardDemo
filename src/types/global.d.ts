import AmmoNamespace from './ammo'

declare global {
  interface Window {
    Ammo: () => Promise<AmmoNamespace>;
  }
}