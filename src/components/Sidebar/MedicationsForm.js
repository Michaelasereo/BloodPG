import React, { useState, useEffect } from 'react';
import Input from '../shared/Input';
import Button from '../shared/Button';
import { getMedications, addMedication, removeMedication } from '../../services/mockData';
import './MedicationsForm.css';

const MedicationsForm = ({ onSave, onCancel }) => {
  const [medications, setMedications] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    frequency: ''
  });

  useEffect(() => {
    loadMedications();
  }, []);

  const loadMedications = () => {
    const meds = getMedications();
    setMedications(meds);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddMedication = () => {
    if (!formData.name || !formData.dosage || !formData.frequency) {
      alert('Please fill in all medication fields.');
      return;
    }

    addMedication(formData);
    loadMedications();
    
    // Reset form
    setFormData({
      name: '',
      dosage: '',
      frequency: ''
    });
  };

  const handleRemoveMedication = (id) => {
    if (window.confirm('Are you sure you want to remove this medication?')) {
      removeMedication(id);
      loadMedications();
    }
  };

  return (
    <div className="medications-form">
      <div className="medications-content">
        <h3 className="medications-title">Current Medications</h3>
        <p className="medications-subtitle">
          Tracking your medications helps you see the full picture of your health management.
        </p>

        <div className="medications-input-section">
          <div className="medications-input-label">Tabs</div>
          <div className="medications-inputs-row">
            <div className="medications-dropdown">
              <Input
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Drug name e.g Lisonopril"
                className="medications-input"
              />
              <span className="medications-arrow">▼</span>
            </div>
            <div className="medications-dropdown">
              <Input
                value={formData.dosage}
                onChange={(e) => handleChange('dosage', e.target.value)}
                placeholder="Dosage e.g 10mg"
                className="medications-input"
              />
              <span className="medications-arrow">▼</span>
            </div>
            <div className="medications-dropdown">
              <Input
                value={formData.frequency}
                onChange={(e) => handleChange('frequency', e.target.value)}
                placeholder="Frequency"
                className="medications-input"
              />
              <span className="medications-arrow">▼</span>
            </div>
          </div>
          <Button
            variant="secondary"
            onClick={handleAddMedication}
            icon="➕"
            className="medications-add-btn"
          >
            Add medication
          </Button>
        </div>

        {medications.length > 0 && (
          <div className="medications-list">
            {medications.map(med => (
              <div key={med.id} className="medications-item">
                <span className="medications-item-text">
                  Tabs {med.name} {med.dosage} {med.frequency}
                </span>
                <button
                  className="medications-remove-btn"
                  onClick={() => handleRemoveMedication(med.id)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="medications-actions">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="primary" onClick={onSave} icon="☁️">
          Save and complete
        </Button>
      </div>
    </div>
  );
};

export default MedicationsForm;

