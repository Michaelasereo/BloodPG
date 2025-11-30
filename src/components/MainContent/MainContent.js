import React, { useState } from 'react';
import TrendsChart from './TrendsChart';
import BloodPressureLogTable from './BloodPressureLogTable';
import Button from '../shared/Button';
import { getBloodPressureRecords } from '../../services/mockData';
import { navigateDate, formatDateOrdinal } from '../../utils/dateUtils';
import './MainContent.css';

const MainContent = () => {
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(() => {
    const nov22 = new Date('2025-11-22');
    return nov22;
  });
  
  const records = getBloodPressureRecords();

  // Filter records by date range
  const filteredRecords = records.filter(record => {
    const recordDate = new Date(record.date);
    const from = new Date(fromDate);
    const to = new Date(toDate);
    
    from.setHours(0, 0, 0, 0);
    to.setHours(23, 59, 59, 999);
    recordDate.setHours(0, 0, 0, 0);
    
    return recordDate >= from && recordDate <= to;
  });

  const handleFromDateNavigation = (direction) => {
    setFromDate(navigateDate(fromDate, direction));
  };

  const handleToDateNavigation = (direction) => {
    setToDate(navigateDate(toDate, direction));
  };

  const handleDownloadAll = () => {
    // Placeholder for download functionality
    console.log('Download all records');
    alert('Download functionality coming soon!');
  };

  return (
    <main className="main-content">
      <div className="main-content-header">
        <h1 className="main-content-title">
          Records
          <span className="main-content-icon">📦</span>
        </h1>
      </div>

      <div className="main-content-date-range">
        <div className="date-range-item">
          <span className="date-range-label">From:</span>
          <div className="date-range-controls">
            <button
              className="date-range-btn"
              onClick={() => handleFromDateNavigation('prev')}
            >
              ←
            </button>
            <span className="date-range-text">Today</span>
            <button
              className="date-range-btn"
              onClick={() => handleFromDateNavigation('next')}
            >
              →
            </button>
          </div>
        </div>
        <div className="date-range-separator"></div>
        <div className="date-range-item">
          <div className="date-range-controls">
            <button
              className="date-range-btn"
              onClick={() => handleToDateNavigation('prev')}
            >
              ←
            </button>
            <span className="date-range-text">{formatDateOrdinal(toDate)}</span>
            <button
              className="date-range-btn"
              onClick={() => handleToDateNavigation('next')}
            >
              →
            </button>
          </div>
        </div>
      </div>

      <div className="main-content-body">
        <div className="trends-section">
          <TrendsChart records={filteredRecords} />
          <div className="trends-download">
            <Button
              variant="secondary"
              onClick={handleDownloadAll}
              icon="☁️⬇️"
            >
              Download All
            </Button>
          </div>
        </div>

        <BloodPressureLogTable records={filteredRecords} />
      </div>
    </main>
  );
};

export default MainContent;

