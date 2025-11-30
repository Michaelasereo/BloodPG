import React, { useState } from 'react';
import Input from '../shared/Input';
import Button from '../shared/Button';
import './BloodPressureEntry.css';

const BloodPressureEntry = ({ selectedDate, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    am: {
      systolic: '',
      diastolic: '',
      preMedication: true,
      postMedication: false
    },
    pm: {
      systolic: '',
      diastolic: '',
      preMedication: true,
      postMedication: false
    }
  });

  const handleChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleRadioChange = (section, type) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        preMedication: type === 'pre',
        postMedication: type === 'post'
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    const amValid = (!formData.am.systolic && !formData.am.diastolic) || 
                    (formData.am.systolic && formData.am.diastolic);
    const pmValid = (!formData.pm.systolic && !formData.pm.diastolic) || 
                    (formData.pm.systolic && formData.pm.diastolic);

    if (!amValid || !pmValid) {
      alert('Please enter both systolic and diastolic values for AM and PM readings.');
      return;
    }

    const record = {
      date: selectedDate,
      am: formData.am.systolic && formData.am.diastolic ? {
        systolic: parseInt(formData.am.systolic),
        diastolic: parseInt(formData.am.diastolic),
        preMedication: formData.am.preMedication,
        postMedication: formData.am.postMedication
      } : null,
      pm: formData.pm.systolic && formData.pm.diastolic ? {
        systolic: parseInt(formData.pm.systolic),
        diastolic: parseInt(formData.pm.diastolic),
        preMedication: formData.pm.preMedication,
        postMedication: formData.pm.postMedication
      } : null
    };

    onSave(record);
    
    // Reset form
    setFormData({
      am: {
        systolic: '',
        diastolic: '',
        preMedication: true,
        postMedication: false
      },
      pm: {
        systolic: '',
        diastolic: '',
        preMedication: true,
        postMedication: false
      }
    });
  };

  return (
    <form className="bp-entry-form" onSubmit={handleSubmit}>
      <div className="bp-entry-section">
        <h3 className="bp-entry-title">Blood Pressure Parameters</h3>
        <p className="bp-entry-subtitle">
          Track your readings over time to understand your heart health.
        </p>

        <div className="bp-time-section">
          <div className="bp-time-label">
            <span>AM</span>
            <span>☀️</span>
          </div>
          <div className="bp-inputs-row">
            <Input
              label="Systolic (mm/Hg)"
              type="number"
              value={formData.am.systolic}
              onChange={(e) => handleChange('am', 'systolic', e.target.value)}
              placeholder=""
              className="bp-input"
            />
            <span className="bp-separator">/</span>
            <Input
              label="Diastolic (mm/Hg)"
              type="number"
              value={formData.am.diastolic}
              onChange={(e) => handleChange('am', 'diastolic', e.target.value)}
              placeholder=""
              className="bp-input"
            />
          </div>
          <div className="bp-radio-group">
            <label className="bp-radio-label">
              <input
                type="radio"
                name="am-medication"
                checked={formData.am.preMedication}
                onChange={() => handleRadioChange('am', 'pre')}
              />
              <span>Pre Medication</span>
            </label>
            <label className="bp-radio-label">
              <input
                type="radio"
                name="am-medication"
                checked={formData.am.postMedication}
                onChange={() => handleRadioChange('am', 'post')}
              />
              <span>Post Medication</span>
            </label>
          </div>
        </div>

        <div className="bp-divider"></div>

        <div className="bp-time-section">
          <div className="bp-time-label">
            <span>PM</span>
            <span>☀️</span>
          </div>
          <div className="bp-inputs-row">
            <Input
              label="Systolic (mm/Hg)"
              type="number"
              value={formData.pm.systolic}
              onChange={(e) => handleChange('pm', 'systolic', e.target.value)}
              placeholder=""
              className="bp-input"
            />
            <span className="bp-separator">/</span>
            <Input
              label="Diastolic (mm/Hg)"
              type="number"
              value={formData.pm.diastolic}
              onChange={(e) => handleChange('pm', 'diastolic', e.target.value)}
              placeholder=""
              className="bp-input"
            />
          </div>
          <div className="bp-radio-group">
            <label className="bp-radio-label">
              <input
                type="radio"
                name="pm-medication"
                checked={formData.pm.preMedication}
                onChange={() => handleRadioChange('pm', 'pre')}
              />
              <span>Pre Medication</span>
            </label>
            <label className="bp-radio-label">
              <input
                type="radio"
                name="pm-medication"
                checked={formData.pm.postMedication}
                onChange={() => handleRadioChange('pm', 'post')}
              />
              <span>Post Medication</span>
            </label>
          </div>
        </div>
      </div>

      <div className="bp-entry-actions">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="primary" type="submit" icon="☁️">
          Save and complete
        </Button>
      </div>
    </form>
  );
};

export default BloodPressureEntry;

