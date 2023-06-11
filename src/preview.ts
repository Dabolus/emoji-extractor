import { promises as fs } from 'node:fs';
import url from 'node:url';
import { createCanvas, loadImage, registerFont } from 'canvas';

// Constants
const emojisPerRow = 54;
const emojiSize = 40;
const padding = 10;
const headerSpacing = 2;
const separatorHeight = 4;

const imageWidth = emojiSize * emojisPerRow + padding * 2;
const headerHeight = Math.round((imageWidth / 6000) * 775);

export interface GeneratePreviewOptions {
  emojisDirectory: string | URL;
  outputFile: string | URL;
}

registerFont(
  url.fileURLToPath(new URL('../assets/Adventure.otf', import.meta.url)),
  { family: 'Adventure' },
);
registerFont(
  url.fileURLToPath(new URL('../assets/Chinyen.otf', import.meta.url)),
  { family: 'Chinyen' },
);

export const generatePreview = async ({
  emojisDirectory,
  outputFile,
}: GeneratePreviewOptions) => {
  process.stdout.write('Parsing emojis from the folder...\n');

  const emojis = await fs.readdir(emojisDirectory);

  const rows = Math.ceil(emojis.length / emojisPerRow);

  const imageWidth = emojiSize * emojisPerRow + padding * 2;
  const imageHeight =
    emojiSize * rows +
    padding * 2 +
    separatorHeight +
    headerSpacing +
    headerHeight;

  const canvas = createCanvas(imageWidth, imageHeight);
  const ctx = canvas.getContext('2d');

  process.stdout.write('Drawing the background...\n');

  ctx.fillStyle = '#d0e0ff';
  ctx.fillRect(0, 0, imageWidth, imageHeight);

  process.stdout.write('Drawing the header...\n');

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.lineWidth = 4;

  ctx.font = '150px Adventure';
  ctx.fillStyle = '#f0f0f0';
  ctx.strokeStyle = '#000';
  ctx.fillText('Complete Emoji Collection', imageWidth / 2, headerHeight / 3);
  ctx.strokeText('Complete Emoji Collection', imageWidth / 2, headerHeight / 3);

  ctx.font = '100px Chinyen';
  ctx.fillStyle = '#f6ba30';
  ctx.strokeStyle = '#4f3d08';
  ctx.fillText('by Dabolus', imageWidth / 2, (headerHeight / 3) * 2);
  ctx.strokeText('by Dabolus', imageWidth / 2, (headerHeight / 3) * 2);

  process.stdout.write('Drawing the separator...\n');

  ctx.fillStyle = '#195284';
  ctx.fillRect(0, headerHeight, imageWidth, separatorHeight);

  await Promise.all(
    emojis.map(async (emoji, index) => {
      process.stdout.write(`Drawing emoji n°${index + 1} (${emoji})...\n`);

      const image = await loadImage(
        url.fileURLToPath(new URL(emoji, emojisDirectory)),
      );

      ctx.drawImage(
        image,
        (index % emojisPerRow) * emojiSize + padding,
        Math.floor(index / emojisPerRow) * emojiSize +
          headerHeight +
          separatorHeight +
          padding,
        emojiSize,
        emojiSize,
      );
    }),
  );

  process.stdout.write('Writing output...\n');

  await fs.writeFile(outputFile, canvas.toBuffer());

  process.stdout.write('Done!\n');
};
