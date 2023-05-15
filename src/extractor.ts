import { promises as fs } from 'node:fs';
import type { Font } from 'fontkit';
import type { SBIXGlyph } from './model';

export const extractCodePointsImagesFromFont = async (
  font: Font,
  outputDirectory: string | URL,
) => {
  await fs.mkdir(outputDirectory, { recursive: true });

  const extractedEmojis = [];

  for (let i = 0; i < font.numGlyphs; i++) {
    // TODO: fix typings upstream
    const glyph = font.getGlyph(i) as SBIXGlyph;
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
