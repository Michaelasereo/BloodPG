import { createRoot, Root } from 'react-dom/client';
import React from 'react';
import type { BloodPressureRecord } from '@/types';
import { formatDateOrdinal } from './dateUtils';
import PDFTemplate from '@/components/PDFTemplate/PDFTemplate';

interface PDFGenerationOptions {
  records: BloodPressureRecord[];
  fromDate: Date;
  toDate: Date;
  userName?: string;
  userEmail?: string;
}

// Helper to wait for all images and SVGs to load
function waitForAssets(element: HTMLElement): Promise<void> {
  return new Promise((resolve) => {
    const images = element.querySelectorAll('img');
    const svgs = element.querySelectorAll('svg');
    
    let loadedCount = 0;
    const totalAssets = images.length + svgs.length;
    
    if (totalAssets === 0) {
      resolve();
      return;
    }

    const checkComplete = () => {
      loadedCount++;
      if (loadedCount === totalAssets) {
        resolve();
      }
    };

    images.forEach((img) => {
      if (img.complete) {
        checkComplete();
      } else {
        img.onload = checkComplete;
        img.onerror = checkComplete;
      }
    });

    // For SVGs, wait a short time for rendering
    if (svgs.length > 0) {
      setTimeout(() => {
        for (let i = 0; i < svgs.length; i++) {
          checkComplete();
        }
      }, 200);
    }
  });
}

export async function generateBloodPressurePDF({
  records,
  fromDate,
  toDate,
  userName,
  userEmail,
}: PDFGenerationOptions): Promise<void> {
  if (typeof window === 'undefined') {
    console.error('PDF generation is only available in the browser');
    return;
  }

  // Dynamic imports to avoid SSR issues
  const html2canvas = (await import('html2canvas')).default;
  const { default: jsPDF } = await import('jspdf');

  if (records.length === 0) {
    alert('No records available to download.');
    return;
  }

  const reportId = `bpg${String(records.length).padStart(4, '0')}`;

  // Create original container - visible but off-screen
  const originalContainer = document.createElement('div');
  originalContainer.id = 'pdf-export-original';
  originalContainer.style.position = 'fixed';
  originalContainer.style.top = '0';
  originalContainer.style.left = '0';
  originalContainer.style.width = '595px';
  originalContainer.style.backgroundColor = '#ffffff';
  originalContainer.style.zIndex = '999998';
  originalContainer.style.visibility = 'visible';
  originalContainer.style.opacity = '1';
  originalContainer.style.display = 'block';
  document.body.appendChild(originalContainer);

  let root: Root | null = null;
  let clonedElement: HTMLElement | null = null;

  try {
    console.log('Rendering PDF template...');
    
    // Render PDF template to original container
    root = createRoot(originalContainer);
    root.render(
      React.createElement(PDFTemplate, {
        records,
        fromDate,
        toDate,
        userName,
        userEmail,
        reportId,
      })
    );

    // Wait for React to render
    await new Promise(resolve => setTimeout(resolve, 1500));

    const contentElement = originalContainer.querySelector('#pdf-export-content') as HTMLElement;
    
    if (!contentElement) {
      console.error('Content element not found');
      throw new Error('PDF content element not found');
    }

    console.log('Content element found:', {
      width: contentElement.offsetWidth,
      height: contentElement.offsetHeight,
      scrollHeight: contentElement.scrollHeight
    });
    
    // Wait for all images and SVGs to load
    console.log('Waiting for assets to load...');
    await waitForAssets(contentElement);
    console.log('Assets loaded');
    
    // Additional wait for rendering
    await new Promise(resolve => setTimeout(resolve, 500));

    // Clone the content element for PDF generation (Clone & Destroy method)
    clonedElement = contentElement.cloneNode(true) as HTMLElement;
    clonedElement.id = 'pdf-export-clone';
    clonedElement.style.display = 'block';
    clonedElement.style.position = 'fixed';
    clonedElement.style.left = '0';
    clonedElement.style.top = '0';
    clonedElement.style.width = '595px';
    clonedElement.style.backgroundColor = '#ffffff';
    clonedElement.style.zIndex = '999999';
    clonedElement.style.visibility = 'visible';
    clonedElement.style.opacity = '1';
    
    // Append clone to body
    document.body.appendChild(clonedElement);
    
    // Wait for clone to be ready
    await new Promise(resolve => setTimeout(resolve, 500));

    console.log('Creating canvas from clone...');
    
    // Create canvas manually using html2canvas with optimized settings
    const canvas = await html2canvas(clonedElement, {
      scale: 2, // Balanced scale for good clarity without huge file size
      useCORS: true,
      logging: false, // Disable logging in production
      backgroundColor: '#ffffff',
      width: 595,
      height: clonedElement.scrollHeight || 842,
      allowTaint: true,
      letterRendering: true, // Better text rendering without size increase
      onclone: (clonedDoc, element) => {
        // Ensure cloned element is visible
        const clonedContent = element.querySelector('#pdf-export-clone') || element;
        if (clonedContent) {
          (clonedContent as HTMLElement).style.display = 'block';
          (clonedContent as HTMLElement).style.visibility = 'visible';
          (clonedContent as HTMLElement).style.opacity = '1';
          (clonedContent as HTMLElement).style.position = 'relative';
          (clonedContent as HTMLElement).style.width = '595px';
          (clonedContent as HTMLElement).style.backgroundColor = '#ffffff';
        }
        
        // Ensure all images are visible
        const images = element.querySelectorAll('img');
        images.forEach((img) => {
          (img as HTMLImageElement).style.visibility = 'visible';
          (img as HTMLImageElement).style.opacity = '1';
        });
      }
    });
    
    console.log('Canvas created, dimensions:', canvas.width, 'x', canvas.height);
    
    // Create PDF manually with optimized settings
    const pdf = new jsPDF('p', 'mm', 'a4'); // Use mm and A4 format for compression
    const pdfWidth = pdf.internal.pageSize.getWidth(); // A4 width in mm (210mm)
    const pdfHeight = pdf.internal.pageSize.getHeight(); // A4 height in mm (297mm)
    
    // Calculate image dimensions to fit A4 width
    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;
    
    console.log('Adding image to PDF:', imgWidth, 'mm x', imgHeight, 'mm');
    
    // Convert canvas to image data with optimized JPEG quality (0.8 = best balance for size vs quality)
    const imgData = canvas.toDataURL('image/jpeg', 0.8);
    
    // Handle multi-page PDF if content is taller than one page
    if (imgHeight > pdfHeight) {
      // Content is taller than one page - split across multiple pages
      let heightLeft = imgHeight;
      let position = 0;
      
      // Add first page
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pdfHeight;
      position = -pdfHeight;
      
      // Add additional pages if needed
      while (heightLeft > 0) {
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
        heightLeft -= pdfHeight;
        position -= pdfHeight;
      }
    } else {
      // Single page - content fits on one page
      pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight, undefined, 'FAST');
    }
    
    // Generate filename
    const fromDateStr = formatDateOrdinal(fromDate);
    const toDateStr = formatDateOrdinal(toDate);
    const fileName = `BloodPG_Report_${fromDateStr.replace(/[\s,]/g, '_')}_to_${toDateStr.replace(/[\s,]/g, '_')}.pdf`;
    
    // Save PDF
    pdf.save(fileName);
    
    console.log('PDF saved successfully:', fileName);

  } catch (error) {
    console.error('Error generating PDF:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    alert(`Failed to generate PDF: ${error instanceof Error ? error.message : 'Unknown error'}. Check console for details.`);
  } finally {
    // Clean up cloned element first
    if (clonedElement && clonedElement.parentNode) {
      clonedElement.parentNode.removeChild(clonedElement);
    }
    
    // Clean up original container and React root
    if (root) {
      root.unmount();
    }
    if (originalContainer.parentNode) {
      originalContainer.parentNode.removeChild(originalContainer);
    }
  }
}
