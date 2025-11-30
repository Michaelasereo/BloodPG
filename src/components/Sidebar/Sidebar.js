import React, { useState } from 'react';
import BloodPressureEntry from './BloodPressureEntry';
import MedicationsForm from './MedicationsForm';
import RecordsList from './RecordsList';
import Tab from '../shared/Tab';
import { saveBloodPressureRecord } from '../../services/mockData';
import { navigateDate, isDateToday, formatDateOrdinal } from '../../utils/dateUtils';
import './Sidebar.css';

const Sidebar = ({ activeMainTab, onMainTabChange }) => {
  const [activeTab, setActiveTab] = useState('enter');
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDateNavigation = (direction) => {
    setSelectedDate(navigateDate(selectedDate, direction));
  };

  const handleSaveBP = (record) => {
    saveBloodPressureRecord(record);
    // Show success message or update UI
    alert('Blood pressure record saved successfully!');
  };

  const handleSaveMedications = () => {
    // Medications are already saved when added
    alert('Medications saved successfully!');
  };

  const handleCancel = () => {
    // Reset form or navigate away
    console.log('Cancel action');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'enter':
        return (
          <BloodPressureEntry
            selectedDate={selectedDate}
            onSave={handleSaveBP}
            onCancel={handleCancel}
          />
        );
      case 'medications':
        return (
          <MedicationsForm
            onSave={handleSaveMedications}
            onCancel={handleCancel}
          />
        );
      case 'records':
        return <RecordsList />;
      default:
        return null;
    }
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-content">
        <div className="sidebar-header">
          <h2 className="sidebar-title">
            <img src="/logobloodpressure.png" alt="Blood Pressure" className="sidebar-icon" />
            Blood Pressure
          </h2>
          
          <div className="sidebar-tabs">
            <Tab
              active={activeTab === 'enter'}
              onClick={() => setActiveTab('enter')}
              icon="📋"
            >
              Enter information
            </Tab>
            <Tab
              active={activeTab === 'medications'}
              onClick={() => setActiveTab('medications')}
              icon="💊"
            >
              Medications
            </Tab>
            <Tab
              active={activeTab === 'records'}
              onClick={() => setActiveTab('records')}
              icon="📁"
            >
              Records
            </Tab>
          </div>

          {activeTab !== 'records' && (
            <div className="sidebar-date-nav">
              <button
                className="date-nav-btn"
                onClick={() => handleDateNavigation('prev')}
              >
                ←
              </button>
              <span className="date-nav-text">
                {isDateToday(selectedDate) ? 'Today' : formatDateOrdinal(selectedDate)}
              </span>
              <button
                className="date-nav-btn"
                onClick={() => handleDateNavigation('next')}
              >
                →
              </button>
            </div>
          )}
        </div>

        <div className="sidebar-body">
          {renderContent()}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

