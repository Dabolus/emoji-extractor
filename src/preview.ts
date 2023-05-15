import { promises as fs } from 'node:fs';
import url from 'node:url';
import { createCanvas, loadImage } from 'canvas';

// Constants
const imageWidth = 2180;
const emojiSize = 40;
const padding = 10;
const headerSpacing = 2;
const separatorHeight = 4;

const headerHeight = Math.round((imageWidth / 6000) * 775);
const emojisPerRow = (imageWidth - padding * 2) / emojiSize;

export interface GeneratePreviewOptions {
  emojisDirectory: string | URL;
  outputFile: string | URL;
}

const headerPromise = loadImage(
  url.fileURLToPath(new URL('../assets/header.png', import.meta.url)),
);

export const generatePreview = async ({
  emojisDirectory,
  outputFile,
}: GeneratePreviewOptions) => {
  process.stdout.write('Parsing emojis from the folder...\n');

  const [emojis, header] = await Promise.all([
    fs.readdir(emojisDirectory),
    headerPromise,
  ]);

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

  ctx.drawImage(header, 0, 0, imageWidth, headerHeight);

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
