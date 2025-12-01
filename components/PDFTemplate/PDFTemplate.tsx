'use client';

import LogoIcon from '@/components/LogoIcon/LogoIcon';
import { formatDateOrdinal } from '@/lib/dateUtils';
import type { BloodPressureRecord } from '@/types';

interface PDFTemplateProps {
  records: BloodPressureRecord[];
  fromDate: Date;
  toDate: Date;
  userName?: string;
  userEmail?: string;
  reportId: string;
}

export default function PDFTemplate({
  records,
  fromDate,
  toDate,
  userName,
  userEmail,
  reportId,
}: PDFTemplateProps) {
  const fromDateStr = formatDateOrdinal(fromDate);
  const toDateStr = formatDateOrdinal(toDate);
  const patientText = userName || userEmail || '[User Name/ID]';

  return (
    <div 
      id="pdf-export-content"
      className="pdf-template bg-white" 
      style={{ 
        width: '595px', 
        minHeight: '842px', 
        padding: '28px', 
        fontFamily: 'Helvetica Neue, Arial, sans-serif',
        boxSizing: 'border-box'
      }}
    >
      {/* Header Section */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '3px' }}>
          <div style={{ width: '76.438px', height: '17.174px', display: 'flex', alignItems: 'center' }}>
            <LogoIcon className="text-black" width={76.438} height={17.174} />
          </div>
        </div>
        <p style={{ fontSize: '10px', fontWeight: 500, color: '#000', margin: 0, marginTop: '3px' }}>
          The Future of Vitals Monitoring
        </p>
      </div>

      {/* Report Metadata Bar */}
      <div style={{ 
        backgroundColor: '#2e2e2e', 
        borderRadius: '5px',
        padding: '6px 7px',
        marginBottom: '9px'
      }}>
        <p style={{ fontSize: '10px', fontWeight: 700, color: '#fff', margin: 0 }}>
          <span style={{ fontWeight: 700 }}>Report ID:</span> {reportId}
        </p>
      </div>

      {/* Patient, Period, Record Count */}
      <div style={{ display: 'flex', gap: '55px', marginBottom: '32px', fontSize: '10px' }}>
        <p style={{ margin: 0 }}>
          <span style={{ fontWeight: 700 }}>Patient:</span> {patientText}
        </p>
        <p style={{ margin: 0 }}>
          <span style={{ fontWeight: 700 }}>Period:</span> {fromDateStr} to {toDateStr}
        </p>
        <p style={{ margin: 0 }}>
          <span style={{ fontWeight: 700 }}>Record Count:</span> {records.length} measurements
        </p>
      </div>

      {/* Blood Pressure Trends Section */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '14.737px', fontWeight: 700, color: '#000', margin: 0 }}>
            Blood Pressure Trends
          </h2>
          <img
            src="/gridicons_line-graph.svg"
            alt="Trends"
            width={12.526}
            height={12.526}
            style={{ objectFit: 'contain' }}
          />
        </div>

        {/* Table */}
        <div style={{ 
          border: '0.737px solid #eaeaea',
          borderRadius: '8.842px',
          overflow: 'hidden',
          backgroundColor: '#f9f9f9'
        }}>
          {/* Table Header */}
          <div style={{ display: 'flex', backgroundColor: '#ededed', borderBottom: '0.737px solid #bcbcbc' }}>
            <div style={{ 
              width: '53.789px', 
              borderRight: '0.737px solid #bcbcbc',
              padding: '8.842px 17.684px',
              textAlign: 'center',
              fontSize: '9.144px',
              fontWeight: 700,
              color: '#000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '44.211px',
              boxSizing: 'border-box'
            }}>
              S/N
            </div>
            <div style={{ 
              width: '95.053px', 
              borderRight: '0.737px solid #bcbcbc',
              padding: '8.842px 17.684px',
              fontSize: '9.144px',
              fontWeight: 700,
              color: '#000',
              display: 'flex',
              alignItems: 'center',
              height: '44.211px',
              boxSizing: 'border-box'
            }}>
              Date
            </div>
            <div style={{ 
              width: '86.211px', 
              borderRight: '0.737px solid #bcbcbc',
              padding: '8.842px 17.684px',
              fontSize: '9.144px',
              color: '#000',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              height: '44.211px',
              boxSizing: 'border-box'
            }}>
              <div style={{ fontWeight: 700 }}>BP (AM)</div>
              <div style={{ fontWeight: 400, fontSize: '9.144px' }}>mmHG</div>
            </div>
            <div style={{ 
              width: '100.211px', 
              borderRight: '0.737px solid #bcbcbc',
              padding: '8.842px 17.684px',
              fontSize: '9.144px',
              color: '#000',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              height: '44.211px',
              boxSizing: 'border-box'
            }}>
              <div style={{ fontWeight: 700 }}>BP (PM)</div>
              <div style={{ fontWeight: 400, fontSize: '9.144px' }}>mmHG</div>
            </div>
            <div style={{ 
              flex: 1,
              padding: '8.842px 17.684px',
              fontSize: '9.14px',
              fontWeight: 700,
              color: '#000',
              display: 'flex',
              alignItems: 'center',
              height: '44.211px',
              boxSizing: 'border-box'
            }}>
              Current Medications
            </div>
          </div>

          {/* Table Rows */}
          {records.map((record, index) => {
            const recordDate = record.date instanceof Date ? record.date : new Date(record.date);
            const dateStr = formatDateOrdinal(recordDate);
            const amReading = record.am?.systolic && record.am?.diastolic 
              ? `${record.am.systolic}/${record.am.diastolic}`
              : '-';
            const pmReading = record.pm?.systolic && record.pm?.diastolic
              ? `${record.pm.systolic}/${record.pm.diastolic}`
              : '-';
            const hasMedications = record.medications && record.medications.length > 0;

            return (
              <div 
                key={record.id || index}
                style={{ 
                  display: 'flex', 
                  backgroundColor: '#fff',
                  borderTop: '0.737px solid #dadada',
                  height: '47.158px'
                }}
              >
                <div style={{ 
                  width: '53.789px', 
                  borderRight: '0.737px solid #dadada',
                  padding: '0 17.684px',
                  textAlign: 'center',
                  fontSize: '8.842px',
                  fontWeight: 700,
                  color: '#000',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxSizing: 'border-box',
                  height: '47.158px'
                }}>
                  <span>{index + 1}</span>
                </div>
                <div style={{ 
                  width: '95.053px', 
                  borderRight: '0.737px solid #dadada',
                  padding: '0 17.684px',
                  fontSize: '10.451px',
                  fontWeight: 400,
                  color: '#000',
                  display: 'flex',
                  alignItems: 'center',
                  boxSizing: 'border-box',
                  height: '47.158px'
                }}>
                  <span>{dateStr}</span>
                </div>
                <div style={{ 
                  width: '86.211px', 
                  borderRight: '0.737px solid #dadada',
                  padding: '0 17.684px',
                  fontSize: '13.06px',
                  fontWeight: 700,
                  color: '#000',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  boxSizing: 'border-box',
                  height: '47.158px'
                }}>
                  <span>{amReading}</span>
                  {hasMedications && (
                    <img
                      src="/mdi_drugs.svg"
                      alt="Medication"
                      width={8.842}
                      height={8.842}
                      style={{ objectFit: 'contain', display: 'block' }}
                    />
                  )}
                </div>
                <div style={{ 
                  width: '100.211px', 
                  borderRight: '0.737px solid #dadada',
                  padding: '0 17.684px',
                  fontSize: '13.06px',
                  fontWeight: 700,
                  color: '#000',
                  display: 'flex',
                  alignItems: 'center',
                  boxSizing: 'border-box',
                  height: '47.158px'
                }}>
                  <span>{pmReading}</span>
                </div>
                <div style={{ 
                  flex: 1,
                  padding: '8.842px 17.684px',
                  fontSize: '9.797px',
                  fontStyle: 'italic',
                  color: '#000',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  boxSizing: 'border-box',
                  height: '100%',
                  minHeight: '47.158px'
                }}>
                  {hasMedications ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5.225px' }}>
                      {record.medications.map((med, medIndex) => {
                        // Format medication string if needed (ensure "Tabs" prefix)
                        const formattedMed = med.startsWith('Tabs') ? med : `Tabs ${med}`;
                        return (
                          <div key={medIndex} style={{ display: 'flex', alignItems: 'center', gap: '4px', margin: 0, lineHeight: '1.2' }}>
                            <span style={{ fontSize: '8px', marginRight: '2px' }}>💊</span>
                            <span>-{formattedMed}</span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <span>-</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Section */}
      <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
        <p style={{ fontSize: '10px', fontWeight: 700, color: '#3d3d3d', margin: 0, marginBottom: '8px' }}>
          Generated by: <span style={{ fontWeight: 400 }}>BloodPG Beta</span>
        </p>
        
        <div style={{ borderTop: '0.5px solid #dadada', marginBottom: '18px' }}></div>
        
        <p style={{ fontSize: '10px', fontWeight: 700, color: '#000', margin: 0, marginBottom: '8px' }}>
          IMPORTANT:
        </p>
        
        <div style={{ fontSize: '10px', fontWeight: 400, color: '#000', lineHeight: '14px' }}>
          <p style={{ margin: '0 0 7px 0' }}>
            This report is for informational purposes only and should not be considered medical advice. Always consult with a qualified healthcare professional for medical diagnosis and treatment.
          </p>
          <p style={{ margin: '0 0 4px 0' }}>
            - This data represents self-measured readings
          </p>
          <p style={{ margin: '0 0 4px 0' }}>
            - Individual readings may vary based on measurement conditions
          </p>
          <p style={{ margin: '0' }}>
            - Not a substitute for professional medical monitoring
          </p>
        </div>
      </div>
    </div>
  );
}
