import React, { useState } from 'react';
import { formatDateOrdinal } from '../../utils/dateUtils';
import { getBloodPressureRecords } from '../../services/mockData';
import Button from '../shared/Button';
import './RecordsList.css';

const RecordsList = () => {
  const [expandedCards, setExpandedCards] = useState({});
  const records = getBloodPressureRecords();

  const toggleCard = (id) => {
    setExpandedCards(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleDownload = (record, e) => {
    e.stopPropagation();
    // Placeholder for download functionality
    console.log('Download record:', record);
  };

  const handleDownloadAll = () => {
    // Placeholder for download all functionality
    console.log('Download all records');
  };

  return (
    <div className="records-list">
      <div className="records-content">
        <h3 className="records-list-title">Blood Pressure Records</h3>
        <p className="records-list-subtitle">
          Review your past entries and trends.
        </p>

        <div className="records-cards">
          {records.map(record => (
            <div
              key={record.id}
              className={`records-card ${expandedCards[record.id] ? 'records-card-expanded' : ''}`}
            >
              <div
                className="records-card-header"
                onClick={() => toggleCard(record.id)}
              >
                <span className="records-card-date">
                  {formatDateOrdinal(record.date)}
                </span>
                <button
                  className="records-download-icon"
                  onClick={(e) => handleDownload(record, e)}
                >
                  ⬇️
                </button>
              </div>

              {expandedCards[record.id] && (
                <div className="records-card-content">
                  {record.medications && record.medications.length > 0 && (
                    <div className="records-medications">
                      <div className="records-medications-label">Current Medications</div>
                      <div className="records-medications-list">
                        {record.medications.map((med, idx) => (
                          <div key={idx} className="records-medication-item">
                            {med}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="records-readings">
                    {record.am && (
                      <div className="records-reading">
                        <div className="records-reading-label">
                          <span>AM</span>
                          <span>☀️</span>
                        </div>
                        <div className="records-reading-value">
                          {record.am.systolic}/{record.am.diastolic}mmHg
                        </div>
                      </div>
                    )}

                    {record.pm && (
                      <div className="records-reading">
                        <div className="records-reading-label">
                          <span>PM</span>
                          <span>☀️</span>
                        </div>
                        <div className="records-reading-value">
                          {record.pm.systolic}/{record.pm.diastolic}mmHg
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="records-list-actions">
        <Button
          variant="secondary"
          onClick={handleDownloadAll}
          icon="☁️⬇️"
          className="records-download-all-btn"
        >
          Download All
        </Button>
      </div>
    </div>
  );
};

export default RecordsList;

