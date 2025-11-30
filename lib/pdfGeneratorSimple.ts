import html2pdf from 'html2pdf.js';
import type { BloodPressureRecord } from '@/types';
import { formatDateOrdinal } from './dateUtils';

interface PDFGenerationOptions {
  records: BloodPressureRecord[];
  fromDate: Date;
  toDate: Date;
  userName?: string;
  userEmail?: string;
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

  if (records.length === 0) {
    alert('No records available to download.');
    return;
  }

  const reportId = `bpg${String(records.length).padStart(4, '0')}`;
  const fromDateStr = formatDateOrdinal(fromDate);
  const toDateStr = formatDateOrdinal(toDate);
  const patientText = userName || userEmail || '[User Name/ID]';

  // Load logo as base64
  let logoBase64 = '';
  try {
    const logoResponse = await fetch('/Logoicon.svg');
    const logoSvg = await logoResponse.text();
    const logoBlob = new Blob([logoSvg], { type: 'image/svg+xml' });
    logoBase64 = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => resolve('');
      reader.readAsDataURL(logoBlob);
    });
  } catch (error) {
    console.error('Error loading logo:', error);
  }

  // Create HTML content
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: 'Helvetica Neue', Arial, sans-serif;
            width: 595px;
            padding: 28px;
            background: white;
            color: #000;
          }
          .header {
            margin-bottom: 20px;
          }
          .logo {
            width: 76.438px;
            height: 17.174px;
            margin-bottom: 3px;
          }
          .tagline {
            font-size: 10px;
            font-weight: 500;
            color: #000;
          }
          .metadata-bar {
            background-color: #2e2e2e;
            border-radius: 5px;
            padding: 6px 7px;
            margin-bottom: 9px;
          }
          .metadata-bar p {
            font-size: 10px;
            font-weight: 700;
            color: #fff;
          }
          .metadata-info {
            display: flex;
            gap: 55px;
            margin-bottom: 32px;
            font-size: 10px;
          }
          .metadata-info strong {
            font-weight: 700;
          }
          .section-title {
            display: flex;
            align-items: flex-end;
            gap: 3px;
            margin-bottom: 16px;
          }
          .section-title h2 {
            font-size: 14.737px;
            font-weight: 700;
            color: #000;
          }
          .table-container {
            border: 0.737px solid #eaeaea;
            border-radius: 8.842px;
            overflow: hidden;
            background-color: #f9f9f9;
          }
          .table-header {
            display: flex;
            background-color: #ededed;
            border-bottom: 0.737px solid #bcbcbc;
          }
          .table-header-cell {
            border-right: 0.737px solid #bcbcbc;
            padding: 8.842px 17.684px;
            font-size: 9.144px;
            font-weight: 700;
            color: #000;
            height: 44.211px;
            display: flex;
            align-items: center;
          }
          .table-header-cell.sn {
            width: 53.789px;
            justify-content: center;
          }
          .table-header-cell.date {
            width: 95.053px;
          }
          .table-header-cell.bp-am {
            width: 86.211px;
            flex-direction: column;
            justify-content: center;
          }
          .table-header-cell.bp-pm {
            width: 100.211px;
            flex-direction: column;
            justify-content: center;
          }
          .table-header-cell.medications {
            flex: 1;
          }
          .subtitle {
            font-size: 9.144px;
            font-weight: 400;
            margin-top: 2px;
          }
          .table-row {
            display: flex;
            background-color: #fff;
            border-top: 0.737px solid #dadada;
            min-height: 47.158px;
          }
          .table-cell {
            border-right: 0.737px solid #dadada;
            padding: 8.842px 17.684px;
            color: #000;
            display: flex;
            align-items: center;
          }
          .table-cell.sn {
            width: 53.789px;
            justify-content: center;
            font-size: 8.842px;
            font-weight: 700;
          }
          .table-cell.date {
            width: 95.053px;
            font-size: 10.451px;
            font-weight: 400;
          }
          .table-cell.bp-am {
            width: 86.211px;
            font-size: 13.06px;
            font-weight: 700;
            gap: 4px;
          }
          .table-cell.bp-pm {
            width: 100.211px;
            font-size: 13.06px;
            font-weight: 700;
          }
          .table-cell.medications {
            flex: 1;
            font-size: 9.797px;
            font-style: italic;
            flex-direction: column;
            justify-content: center;
            gap: 5.225px;
          }
          .med-item {
            margin: 0;
            line-height: 1.2;
          }
          .footer {
            margin-top: 40px;
            padding-top: 20px;
          }
          .generated-by {
            font-size: 10px;
            font-weight: 700;
            color: #3d3d3d;
            margin-bottom: 8px;
          }
          .divider {
            border-top: 0.5px solid #dadada;
            margin-bottom: 18px;
          }
          .important-label {
            font-size: 10px;
            font-weight: 700;
            color: #000;
            margin-bottom: 8px;
          }
          .disclaimer {
            font-size: 10px;
            font-weight: 400;
            color: #000;
            line-height: 14px;
          }
          .disclaimer p {
            margin: 0 0 7px 0;
          }
        </style>
      </head>
      <body>
        <div class="header">
          ${logoBase64 ? `<img src="${logoBase64}" class="logo" alt="BloodPG" />` : '<div class="logo">BloodPG</div>'}
          <p class="tagline">The Future of Vitals Monitoring</p>
        </div>
        
        <div class="metadata-bar">
          <p><strong>Report ID:</strong> ${reportId}</p>
        </div>
        
        <div class="metadata-info">
          <p><strong>Patient:</strong> ${patientText}</p>
          <p><strong>Period:</strong> ${fromDateStr} to ${toDateStr}</p>
          <p><strong>Record Count:</strong> ${records.length} measurements</p>
        </div>
        
        <div>
          <div class="section-title">
            <h2>Blood Pressure Trends</h2>
          </div>
          
          <div class="table-container">
            <div class="table-header">
              <div class="table-header-cell sn">S/N</div>
              <div class="table-header-cell date">Date</div>
              <div class="table-header-cell bp-am">
                <div>BP (AM)</div>
                <div class="subtitle">mmHG</div>
              </div>
              <div class="table-header-cell bp-pm">
                <div>BP (PM)</div>
                <div class="subtitle">mmHG</div>
              </div>
              <div class="table-header-cell medications">Current Medications</div>
            </div>
            
            ${records.map((record, index) => {
              const recordDate = record.date instanceof Date ? record.date : new Date(record.date);
              const dateStr = formatDateOrdinal(recordDate);
              const amReading = record.am?.systolic && record.am?.diastolic 
                ? `${record.am.systolic}/${record.am.diastolic}`
                : '-';
              const pmReading = record.pm?.systolic && record.pm?.diastolic
                ? `${record.pm.systolic}/${record.pm.diastolic}`
                : '-';
              const hasMedications = record.medications && record.medications.length > 0;
              
              return `
                <div class="table-row">
                  <div class="table-cell sn">${index + 1}</div>
                  <div class="table-cell date">${dateStr}</div>
                  <div class="table-cell bp-am">
                    ${amReading}
                    ${hasMedications ? '<span style="font-size: 8px;">💊</span>' : ''}
                  </div>
                  <div class="table-cell bp-pm">${pmReading}</div>
                  <div class="table-cell medications">
                    ${hasMedications 
                      ? record.medications.map(med => {
                          // Format medication string if needed (ensure "Tabs" prefix)
                          const formattedMed = med.startsWith('Tabs') ? med : `Tabs ${med}`;
                          return `<p class="med-item">-${formattedMed}</p>`;
                        }).join('')
                      : '-'
                    }
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
        
        <div class="footer">
          <p class="generated-by">Generated by: <span style="font-weight: 400;">BloodPG Beta</span></p>
          <div class="divider"></div>
          <p class="important-label">IMPORTANT:</p>
          <div class="disclaimer">
            <p>This report is for informational purposes only and should not be considered medical advice. Always consult with a qualified healthcare professional for medical diagnosis and treatment.</p>
            <p>- This data represents self-measured readings</p>
            <p>- Individual readings may vary based on measurement conditions</p>
            <p>- Not a substitute for professional medical monitoring</p>
          </div>
        </div>
      </body>
    </html>
  `;

  // Create a container and inject HTML - make it visible but off-screen
  const container = document.createElement('div');
  container.innerHTML = htmlContent;
  const bodyEl = container.querySelector('body') || container;
  
  // Style the container
  container.style.position = 'fixed';
  container.style.top = '0';
  container.style.left = '-2000px'; // Off-screen but accessible
  container.style.width = '595px';
  container.style.backgroundColor = '#ffffff';
  container.style.zIndex = '999999';
  
  // Extract body content if exists
  const content = bodyEl instanceof HTMLBodyElement ? bodyEl.innerHTML : htmlContent;
  container.innerHTML = content;
  
  document.body.appendChild(container);
  
  // Wait a bit for rendering
  await new Promise(resolve => setTimeout(resolve, 500));

  try {
    const fileName = `BloodPG_Report_${fromDateStr.replace(/[\s,]/g, '_')}_to_${toDateStr.replace(/[\s,]/g, '_')}.pdf`;

    const opt = {
      margin: [0, 0, 0, 0],
      filename: fileName,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        logging: true,
        backgroundColor: '#ffffff',
        width: 595,
        height: 842,
        allowTaint: true,
      },
      jsPDF: {
        unit: 'px',
        format: [595, 842],
        orientation: 'portrait',
      },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
    };

    await html2pdf()
      .set(opt)
      .from(container)
      .save();

  } catch (error) {
    console.error('Error generating PDF:', error);
    alert(`Failed to generate PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
  } finally {
    if (container.parentNode) {
      container.parentNode.removeChild(container);
    }
  }
}

