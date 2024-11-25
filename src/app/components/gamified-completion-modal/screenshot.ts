import html2canvas from 'html2canvas';

export class screenshot {
  constructor() {}
  public captureElement = async (selector: string): Promise<void> => {
    const element = document.querySelector(selector);
    if (!element) {
      console.error('Element not found');
      return;
    }

    try {
      const canvas = await html2canvas(element as HTMLElement);
      const link = document.createElement('a');
      link.download = 'screenshot.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Error capturing the screenshot:', error);
    }
  };
}
