import FileSaver from "file-saver";

import { surpriseMePrompts } from "../constants";

export const getRandomPrompt = (prompt: string): string => {
  const randomIndex = Math.floor(Math.random() * surpriseMePrompts.length);
  const randomPrompt = surpriseMePrompts[randomIndex];

  if (randomPrompt === prompt) return getRandomPrompt(prompt);

  return randomPrompt;
};

export const downloadImage = async (_id: string, photo: string) => {
  FileSaver.saveAs(photo, `download-${_id}.png`);
};
