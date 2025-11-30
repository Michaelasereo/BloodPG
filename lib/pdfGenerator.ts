import type { BloodPressureRecord } from '@/types';
import { formatDateOrdinal } from './dateUtils';

interface PDFGenerationOptions {
  records: BloodPressureRecord[];
  fromDate: Date;
  toDate: Date;
  userName?: string;
  userEmail?: string;
}

// Helper function to load SVG as image data URL
async function loadSVGAsImage(svgPath: string): Promise<string> {
  try {
    const response = await fetch(svgPath);
    const svgText = await response.text();
    // Convert SVG to data URL
    const svgBlob = new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' });
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(svgBlob);
    });
  } catch (error) {
    console.error('Error loading SVG:', error);
    return '';
  }
}

export async function generateBloodPressurePDF({
  records,
  fromDate,
  toDate,
  userName,
  userEmail,
}: PDFGenerationOptions): Promise<void> {
  // Dynamic import to avoid SSR issues - only load on client
  if (typeof window === 'undefined') {
    console.error('PDF generation is only available in the browser');
    return;
  }

  const { default: jsPDF } = await import('jspdf');
  
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'px',
    format: [595, 842], // A4 size in pixels at 72 DPI
  });

  const pageWidth = 595;
  const pageHeight = 842;
  const margin = 28;
  const contentWidth = pageWidth - (margin * 2);

  // Colors (as RGB values for jsPDF)
  const colors = {
    black: [0, 0, 0] as [number, number, number],
    white: [255, 255, 255] as [number, number, number],
    grayDark: [46, 46, 46] as [number, number, number], // #2e2e2e
    grayMedium: [237, 237, 237] as [number, number, number], // #ededed
    grayLight: [218, 218, 218] as [number, number, number], // #dadada
    grayBorder: [188, 188, 188] as [number, number, number], // #bcbcbc
    grayText: [61, 61, 61] as [number, number, number], // #3d3d3d
    grayTextLight: [117, 117, 117] as [number, number, number], // #757575
  };

  // Helper to set font (jsPDF uses: 'normal', 'bold', 'italic', 'bolditalic')
  const setFont = (weight: 'Regular' | 'Medium' | 'Bold' | 'Italic', size: number) => {
    let fontStyle: 'normal' | 'bold' | 'italic' | 'bolditalic' = 'normal';
    if (weight === 'Bold') fontStyle = 'bold';
    else if (weight === 'Italic') fontStyle = 'italic';
    else if (weight === 'Medium') fontStyle = 'bold'; // Medium maps to bold in jsPDF
    
    doc.setFont('Helvetica', fontStyle);
    doc.setFontSize(size);
  };

  // Helper to get text width
  const getTextWidth = (text: string, size: number, weight: 'Regular' | 'Medium' | 'Bold' = 'Regular') => {
    setFont(weight, size);
    return doc.getTextWidth(text);
  };

  // Helper to draw rounded rectangle (jsPDF doesn't have native support)
  // We'll manually draw using paths for rounded corners
  const drawRoundedRect = (x: number, y: number, w: number, h: number, r: number) => {
    // Draw rounded rectangle manually using paths
    // Top edge with rounded corners
    doc.setFillColor(...colors.grayDark);
    // Main rectangle (excluding corners)
    doc.rect(x + r, y, w - 2 * r, h, 'F');
    doc.rect(x, y + r, w, h - 2 * r, 'F');
    
    // Draw rounded corners using circles
    doc.circle(x + r, y + r, r, 'F'); // Top-left
    doc.circle(x + w - r, y + r, r, 'F'); // Top-right
    doc.circle(x + w - r, y + h - r, r, 'F'); // Bottom-right
    doc.circle(x + r, y + h - r, r, 'F'); // Bottom-left
  };

  let yPos = margin;

  // ========== HEADER SECTION ==========
  // Load and add logo SVG
  try {
    const logoDataUrl = await loadSVGAsImage('/Logoicon.svg');
    if (logoDataUrl) {
      // Logo dimensions: 114x32 at full size, scale down for PDF
      const logoWidth = 76.438; // Scaled to match Figma
      const logoHeight = 17.174; // Scaled to match Figma
      doc.addImage(logoDataUrl, 'SVG', margin, yPos, logoWidth, logoHeight);
      yPos += logoHeight + 3; // Add small gap after logo
    } else {
      // Fallback to text if logo fails to load
      setFont('Medium', 14);
      doc.setTextColor(...colors.black);
      doc.text('BloodPG', margin, yPos + 12);
      yPos += 20;
    }
  } catch (error) {
    console.error('Error loading logo:', error);
    // Fallback to text
    setFont('Medium', 14);
    doc.setTextColor(...colors.black);
    doc.text('BloodPG', margin, yPos + 12);
    yPos += 20;
  }

  // Tagline
  setFont('Regular', 10); // Changed from Medium to Regular
  doc.setTextColor(...colors.black);
  doc.text('The Future of Vitals Monitoring', margin, yPos);

  // ========== REPORT METADATA BAR ==========
  yPos += 45;
  const metadataBarHeight = 27;
  const borderRadius = 5; // Border radius for rounded corners
  
  // Dark gray background with rounded corners
  doc.setFillColor(...colors.grayDark);
  drawRoundedRect(margin, yPos, contentWidth, metadataBarHeight, borderRadius);

  // Report ID
  const reportId = `bpg${String(records.length).padStart(4, '0')}`;
  setFont('Bold', 10);
  doc.setTextColor(...colors.white);
  doc.text('Report ID: ', margin + 7, yPos + 18);
  setFont('Regular', 10); // Changed from Medium to Regular
  doc.text(reportId, margin + 7 + getTextWidth('Report ID: ', 10, 'Bold'), yPos + 18);

  // Patient, Period, Record Count on next line
  yPos += metadataBarHeight + 9;

  // Patient
  setFont('Bold', 10);
  doc.setTextColor(...colors.black);
  doc.text('Patient: ', margin, yPos);
  setFont('Regular', 10); // Changed from Medium to Regular
  const patientText = userName || userEmail || '[User Name/ID]';
  doc.text(patientText, margin + getTextWidth('Patient: ', 10, 'Bold'), yPos);

  // Period
  setFont('Bold', 10);
  const periodX = margin + 155;
  doc.text('Period: ', periodX, yPos);
  setFont('Regular', 10); // Changed from Medium to Regular
  const fromDateStr = formatDateOrdinal(fromDate);
  const toDateStr = formatDateOrdinal(toDate);
  doc.text(`${fromDateStr} to ${toDateStr}`, periodX + getTextWidth('Period: ', 10, 'Bold'), yPos);

  // Record Count
  setFont('Bold', 10);
  const countX = periodX + 210;
  doc.text('Record Count: ', countX, yPos);
  setFont('Regular', 10); // Changed from Medium to Regular
  doc.text(`${records.length} measurements`, countX + getTextWidth('Record Count: ', 10, 'Bold'), yPos);

  // ========== BLOOD PRESSURE TRENDS SECTION ==========
  yPos += 42;

  // Section Title
  setFont('Bold', 14.737); // Changed from Medium to Bold
  doc.setTextColor(...colors.black);
  doc.text('Blood Pressure Trends', margin, yPos);

  // ========== TABLE SECTION ==========
  yPos += 18;

  // Table dimensions (scaled from Figma)
  const tableY = yPos;
  const colWidths = {
    sn: 53.789,
    date: 95.053,
    bpAm: 86.211,
    bpPm: 100.211,
    medications: contentWidth - 53.789 - 95.053 - 86.211 - 100.211, // Remaining width
  };
  
  const headerHeight = 44.211;
  const rowHeight = 47.158;
  const cellPadding = 17.684; // Consistent padding for all cells

  // Table header background
  doc.setFillColor(...colors.grayMedium);
  doc.rect(margin, tableY, contentWidth, headerHeight, 'F');

  // Header border
  doc.setDrawColor(...colors.grayBorder);
  doc.setLineWidth(0.737);
  
  let xPos = margin;

  // S/N Header
  doc.rect(xPos, tableY, colWidths.sn, headerHeight, 'S');
  setFont('Bold', 9.144); // Changed from Medium to Bold
  doc.setTextColor(...colors.black);
  doc.text('S/N', xPos + colWidths.sn / 2, tableY + headerHeight / 2 + 3, { align: 'center' });
  xPos += colWidths.sn;

  // Date Header
  doc.rect(xPos, tableY, colWidths.date, headerHeight, 'S');
  setFont('Bold', 9.144); // Changed from Medium to Bold
  doc.setTextColor(...colors.black);
  doc.text('Date', xPos + cellPadding, tableY + headerHeight / 2 + 3, { align: 'left' });
  xPos += colWidths.date;

  // BP (AM) Header
  doc.rect(xPos, tableY, colWidths.bpAm, headerHeight, 'S');
  setFont('Bold', 9.144); // Changed from Medium to Bold
  doc.setTextColor(...colors.black);
  doc.text('BP (AM)', xPos + cellPadding, tableY + 15);
  setFont('Regular', 9.144);
  doc.text('mmHG', xPos + cellPadding, tableY + 25);
  xPos += colWidths.bpAm;

  // BP (PM) Header
  doc.rect(xPos, tableY, colWidths.bpPm, headerHeight, 'S');
  setFont('Bold', 9.144); // Changed from Medium to Bold
  doc.setTextColor(...colors.black);
  doc.text('BP (PM)', xPos + cellPadding, tableY + 15);
  setFont('Regular', 9.144);
  doc.text('mmHG', xPos + cellPadding, tableY + 25);
  xPos += colWidths.bpPm;

  // Current Medications Header
  doc.rect(xPos, tableY, colWidths.medications, headerHeight, 'S');
  setFont('Bold', 9.14); // Changed from Medium to Bold
  doc.setTextColor(...colors.black);
  doc.text('Current Medications', xPos + cellPadding, tableY + headerHeight / 2 + 3, { align: 'left' });

  // Table rows
  let currentY = tableY + headerHeight;
  
  records.forEach((record, index) => {
    if (currentY + rowHeight > pageHeight - 100) {
      // Add new page if needed
      doc.addPage();
      currentY = margin + 20;
    }

    xPos = margin;
    const rowNumber = index + 1;

    // Row background
    doc.setFillColor(...colors.white);
    doc.rect(xPos, currentY, contentWidth, rowHeight, 'F');

    // S/N
    doc.setDrawColor(...colors.grayLight);
    doc.setLineWidth(0.737);
    doc.rect(xPos, currentY, colWidths.sn, rowHeight, 'S');
    setFont('Bold', 8.842); // Changed from Medium to Bold for consistency
    doc.setTextColor(...colors.black);
    doc.text(String(rowNumber), xPos + colWidths.sn / 2, currentY + rowHeight / 2 + 3, { align: 'center' });
    xPos += colWidths.sn;

    // Date
    doc.rect(xPos, currentY, colWidths.date, rowHeight, 'S');
    setFont('Regular', 10.451);
    doc.setTextColor(...colors.black);
    const recordDate = record.date instanceof Date ? record.date : new Date(record.date);
    const dateStr = formatDateOrdinal(recordDate);
    doc.text(dateStr, xPos + cellPadding, currentY + rowHeight / 2 + 3, { align: 'left' });
    xPos += colWidths.date;

    // BP (AM)
    doc.rect(xPos, currentY, colWidths.bpAm, rowHeight, 'S');
    setFont('Bold', 13.06); // Keep Bold for readings
    doc.setTextColor(...colors.black);
    const amReading = record.am?.systolic && record.am?.diastolic 
      ? `${record.am.systolic}/${record.am.diastolic}`
      : '-';
    doc.text(amReading, xPos + cellPadding, currentY + rowHeight / 2 + 3, { align: 'left' });
    xPos += colWidths.bpAm;

    // BP (PM)
    doc.rect(xPos, currentY, colWidths.bpPm, rowHeight, 'S');
    setFont('Bold', 13.06); // Keep Bold for readings
    doc.setTextColor(...colors.black);
    const pmReading = record.pm?.systolic && record.pm?.diastolic
      ? `${record.pm.systolic}/${record.pm.diastolic}`
      : '-';
    doc.text(pmReading, xPos + cellPadding, currentY + rowHeight / 2 + 3, { align: 'left' });
    xPos += colWidths.bpPm;

    // Current Medications
    doc.rect(xPos, currentY, colWidths.medications, rowHeight, 'S');
    setFont('Italic', 9.797);
    doc.setTextColor(...colors.black);
    
    const medications = record.medications || [];
    if (medications.length > 0) {
      const medText = medications
        .map(med => `-${med}`)
        .join('\n');
      
      const lines = doc.splitTextToSize(medText, colWidths.medications - (cellPadding * 2));
      let medY = currentY + 12; // Better starting position
      const lineSpacing = 7.091; // Better line spacing for readability
      lines.forEach((line: string) => {
        doc.text(line, xPos + cellPadding, medY, { align: 'left' });
        medY += lineSpacing;
      });
    } else {
      doc.text('-', xPos + cellPadding, currentY + rowHeight / 2 + 3, { align: 'left' });
    }

    currentY += rowHeight;
  });

  // ========== FOOTER SECTION ==========
  const footerY = pageHeight - 110;

  // Generated by
  setFont('Bold', 10);
  doc.setTextColor(...colors.grayText);
  doc.text('Generated by: ', margin, footerY);
  setFont('Regular', 10); // Changed from Bold to Regular for "BloodPG Beta"
  doc.text('BloodPG Beta', margin + getTextWidth('Generated by: ', 10, 'Bold'), footerY);

  // Divider line
  doc.setDrawColor(...colors.grayLight);
  doc.setLineWidth(0.5);
  doc.line(margin, footerY + 8, margin + contentWidth, footerY + 8);

  // Important disclaimer
  let disclaimerY = footerY + 18;
  setFont('Bold', 10);
  doc.setTextColor(...colors.black);
  doc.text('IMPORTANT:', margin, disclaimerY);
  
  disclaimerY += 8; // Space after "IMPORTANT:"
  setFont('Regular', 10); // Changed from Medium to Regular
  
  // First paragraph
  const firstParagraph = 'This report is for informational purposes only and should not be considered medical advice. Always consult with a qualified healthcare professional for medical diagnosis and treatment.';
  const firstParaLines = doc.splitTextToSize(firstParagraph, contentWidth);
  firstParaLines.forEach((line: string) => {
    doc.text(line, margin, disclaimerY, { align: 'left' });
    disclaimerY += 7; // Better line height for paragraph text
  });
  
  disclaimerY += 4; // Extra space before bullet points
  
  // Bullet points with better spacing
  const bulletPoints = [
    'This data represents self-measured readings',
    'Individual readings may vary based on measurement conditions',
    'Not a substitute for professional medical monitoring'
  ];
  
  bulletPoints.forEach((point) => {
    doc.text(`- ${point}`, margin, disclaimerY, { align: 'left' });
    disclaimerY += 7; // Better line height for bullet points
  });

  // Generate filename
  const fileName = `BloodPG_Report_${fromDateStr.replace(/[\s,]/g, '_')}_to_${toDateStr.replace(/[\s,]/g, '_')}.pdf`;
  
  // Save PDF
  doc.save(fileName);
}
