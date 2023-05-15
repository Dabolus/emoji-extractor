import { existsSync } from 'node:fs';
import { extractCodePointsImagesFromFont } from './extractor.js';
import { generatePreview } from './preview.js';
import { openFont } from './utils.js';

const fontPaths = [
  process.argv.slice(2).join(' '),
  './Apple Color Emoji.ttc',
  './Apple Color Emoji.ttf',
  '/System/Library/Fonts/Apple Color Emoji.ttc',
  '/System/Library/Fonts/Apple Color Emoji.ttf',
  './AppleColorEmoji.ttc',
  './AppleColorEmoji.ttf',
];

const fontPath = fontPaths.find(path => existsSync(path));

if (!fontPath) {
  process.stderr.write(
    'Unable to find the Apple Color Emoji font. Please, specify a valid path.\n',
  );
  process.exit(1);
}

const font = await openFont(fontPath);
if (!font) {
  process.stderr.write('Invalid font file provided.\n');
  process.exit(1);
}

process.stdout.write('Starting emojis extraction from font...\n');
await extractCodePointsImagesFromFont(
  font,
  new URL('../emojis/raw/', import.meta.url),
);

process.stdout.write('Generating preview image...\n');
await generatePreview({
  emojisDirectory: new URL('../emojis/raw/', import.meta.url),
  outputFile: new URL('../emojis/preview.png', import.meta.url),
});
