/// <reference types="vite/client" />

declare module '@react-three/fiber' {
  interface ThreeElements {
    group: any;
    mesh: any;
    primitive: any;
    directionalLight: any;
    ambientLight: any;
    planeGeometry: any;
    boxGeometry: any;
    meshStandardMaterial: any;
  }
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      group: any;
      mesh: any;
      primitive: any;
      directionalLight: any;
      ambientLight: any;
      planeGeometry: any;
      boxGeometry: any;
      meshStandardMaterial: any;
    }
  }
}
