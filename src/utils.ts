import { open, Font } from 'fontkit';

export const openFont = (fileName: string): Promise<Font | undefined> =>
  open(fileName, 'AppleColorEmoji');
