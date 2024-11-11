import html2pdf from 'html2pdf.js';

export const generatePDF = async (element: HTMLElement, filename: string) => {
  // Wait for images to load before generating PDF
  const loadImages = async () => {
    const images = Array.from(element.getElementsByTagName('img'));
    const imagePromises = images.map(img => {
      return new Promise((resolve, reject) => {
        if (img.complete) {
          resolve(null);
        } else {
          img.onload = () => resolve(null);
          img.onerror = reject;
        }
      });
    });
    await Promise.all(imagePromises);
  };

  const opt = {
    margin: [10, 10, 10, 10],
    filename,
    image: { 
      type: 'jpeg', 
      quality: 0.98,
      maxWidth: 800,
      maxHeight: 800,
      compression: 'MEDIUM'
    },
    html2canvas: { 
      scale: 2,
      useCORS: true,
      logging: false,
      imageTimeout: 15000,
      removeContainer: true
    },
    jsPDF: { 
      unit: 'mm', 
      format: 'a4', 
      orientation: 'portrait',
      compress: true
    },
    pagebreak: { 
      mode: ['avoid-all', 'css', 'legacy'],
      before: '.page-break-before',
      after: '.page-break-after',
      avoid: ['img', '.avoid-break']
    }
  };

  try {
    // Wait for all images to load
    await loadImages();
    // Generate PDF
    await html2pdf().set(opt).from(element).save();
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    return false;
  }
};