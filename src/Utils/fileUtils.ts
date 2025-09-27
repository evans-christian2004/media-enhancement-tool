import * as pdfjsLib from "pdfjs-dist";
// Worker is required for pdfjs to function in browser
import pdfjsWorker from "pdfjs-dist/build/pdf.worker?url";

// Tell pdfjs where the worker is
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

/**
 * Converts a File object to a Base64 encoded string.
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

/**
 * Extracts text content from a PDF file.
 */
export const extractTextFromPdf = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const numPages = pdf.numPages;
  let fullText = "";

  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    fullText += textContent.items.map((item: any) => item.str).join(" ") + "\n";
  }

  return fullText;
};
