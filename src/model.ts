import { Glyph } from 'fontkit';

export interface GlyphImage {
  originX: number;
  originy: number;
  type: string;
  data: Uint8Array;
}

export interface SBIXGlyph extends Glyph {
  type: 'SBIX';
  getImageForSize(size: number): GlyphImage;
}

export interface COLRLayer {
  glyph: Glyph;
  color: {
    red: number;
    green: number;
    blue: number;
    alpha: number;
  };
}

export interface COLRGlyph extends Glyph {
  type: 'COLR';
  layers: COLRLayer[];
}
