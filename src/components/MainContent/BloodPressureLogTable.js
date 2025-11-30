import React, { useState, useMemo } from 'react';
import { formatDate } from '../../utils/dateUtils';
import './BloodPressureLogTable.css';

const BloodPressureLogTable = ({ records }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });

  const sortedRecords = useMemo(() => {
    const sorted = [...records];
    
    sorted.sort((a, b) => {
      if (sortConfig.key === 'date') {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return sortConfig.direction === 'asc' 
          ? dateA - dateB 
          : dateB - dateA;
      }
      return 0;
    });

    return sorted;
  }, [records, sortConfig]);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  const formatBP = (reading) => {
    if (!reading) return '-';
    return `${reading.systolic}/${reading.diastolic}`;
  };

  return (
    <div className="bp-log-table">
      <h3 className="bp-log-table-title">Blood Pressure Log</h3>
      <div className="bp-log-table-wrapper">
        <table className="bp-log-table-content">
          <thead>
            <tr>
              <th>S/N</th>
              <th className="bp-log-sortable" onClick={() => handleSort('date')}>
                Date
                <span className="bp-log-sort-icon">
                  {sortConfig.key === 'date' 
                    ? sortConfig.direction === 'asc' ? '↑' : '↓'
                    : '↕'}
                </span>
              </th>
              <th>BP (AM) mmHg</th>
              <th>BP (PM) mmHg</th>
              <th>Current Medications</th>
            </tr>
          </thead>
          <tbody>
            {sortedRecords.length > 0 ? (
              sortedRecords.map((record, index) => (
                <tr key={record.id}>
                  <td>{index + 1}</td>
                  <td>{formatDate(record.date)}</td>
                  <td>{formatBP(record.am)}</td>
                  <td>{formatBP(record.pm)}</td>
                  <td>
                    {record.medications && record.medications.length > 0 ? (
                      <ul className="bp-log-medications">
                        {record.medications.map((med, idx) => (
                          <li key={idx}>{med}</li>
                        ))}
                      </ul>
                    ) : (
                      '-'
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="bp-log-empty">
                  No records available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BloodPressureLogTable;

