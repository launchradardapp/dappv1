declare module 'react-avatar-editor' {
    import * as React from 'react';
  
    export interface AvatarEditorProps {
      image: string | File;
      width?: number;
      height?: number;
      border?: number | [number, number];
      borderRadius?: number;
      scale?: number;
      rotate?: number;
      position?: { x: number; y: number };
      color?: [number, number, number, number];
      style?: React.CSSProperties;
      onPositionChange?: (position: { x: number; y: number }) => void;
      className?: string;
      crossOrigin?: 'anonymous' | 'use-credentials' | '';
      disableBoundaryChecks?: boolean;
    }
  
    export default class AvatarEditor extends React.Component<AvatarEditorProps, any> {
      getImage(): HTMLCanvasElement;
      getImageScaledToCanvas(): HTMLCanvasElement;
    }
  }
  