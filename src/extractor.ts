import { promises as fs } from 'node:fs';
import type { Font, Glyph } from 'fontkit';

export interface GlyphImage {
  originX: number;
  originy: number;
  type: string;
  data: Uint8Array;
}

interface GlyphWithImage extends Glyph {
  getImageForSize(size: number): GlyphImage | null;
}

export const extractCodePointsImagesFromFont = async (
  font: Font,
  outputDirectory: string | URL,
) => {
  await fs.mkdir(outputDirectory, { recursive: true });

  const extractedEmojis = [];

  for (let i = 0; i < font.numGlyphs; i++) {
    // TODO: fix typings upstream
    const glyph = font.getGlyph(i) as GlyphWithImage;
    const glyphImage = glyph.getImageForSize(160);

    if (glyphImage?.data) {
      process.stdout.write(`Extracting emoji ${glyph.name}...\n`);

      try {
        await fs.writeFile(
          new URL(`${glyph.name}.png`, outputDirectory),
          glyphImage.data,
        );

        extractedEmojis.push(glyph.name);

        process.stdout.write(`Emoji ${glyph.name} extracted successfully.\n`);
      } catch {
        process.stdout.write(`Error extracting ${glyph.name}!\n`);
      }
    }
  }

  return extractedEmojis;
};
