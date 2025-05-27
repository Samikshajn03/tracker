'use client';

import { useState, useEffect } from 'react';
import { Country, City, State } from 'country-state-city';
import '../styles/Components/Destination.scss';
import { saveDestination } from '../utils/apiFunctions/DestinationsSaveFunction';
import { toast, ToastContainer } from 'react-toastify';
import ImageUpload from './ImageUpload';

export default function DestinationModal({ onClose }) {
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [states, setStates] = useState([]);

  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  const [loading, setLoading] = useState(false);
  const [memory, setMemory] = useState('');
  const [imageFiles, setImageFiles] = useState([]);

  useEffect(() => {
    setCountries(Country.getAllCountries());
  }, []);

  const handleCountryChange = (e) => {
    const countryIso = e.target.value;
    setSelectedCountry(countryIso);
    setSelectedState('');
    setSelectedCity('');
    setStates(State.getStatesOfCountry(countryIso));
    setCities(City.getCitiesOfCountry(countryIso));
  };

  const handleStateChange = (e) => {
    const stateName = e.target.value;
    setSelectedState(stateName);
    setSelectedCity('');

    const stateObj = states.find((s) => s.name === stateName);
    if (stateObj) {
      setCities(City.getCitiesOfState(selectedCountry, stateObj.isoCode));
    }
  };

  const handleImagesChange = (files) => {
    setImageFiles(files);
  };

  const handleSave = async () => {
    if (!selectedCountry || !selectedState || !selectedCity) {
      toast.error('Please select a country, state, and city');
      return;
    }

    if (!memory.trim()) {
      toast.error('Please enter your best memory');
      return;
    }

    if (imageFiles.length === 0) {
      toast.error('Please upload at least one image');
      return;
    }

    const user = JSON.parse(sessionStorage.getItem('user'));
    if (!user?.id) {
      toast.error('User not found. Please log in again.');
      return;
    }

    const countryObj = countries.find((c) => c.isoCode === selectedCountry);
    const stateObj = states.find((s) => s.name === selectedState);

    try {
      setLoading(true);

      const result = await saveDestination({
        userId: user.id,
        country: countryObj?.name,
        state: stateObj?.name,
        city: selectedCity,
        memory,
        imageFiles,
      });

      toast.success(result.message || 'Destination saved successfully');
      onClose();
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-title">Add New Destination</h2>

        {/* Country Dropdown */}
        <select className="modal-input" value={selectedCountry} onChange={handleCountryChange}>
          <option value="">Select Country</option>
          {countries.map((country) => (
            <option key={country.isoCode} value={country.isoCode}>
              {country.name}
            </option>
          ))}
        </select>

        {/* State Dropdown */}
        {selectedCountry && (
          <select className="modal-input" value={selectedState} onChange={handleStateChange}>
            <option value="">Select State</option>
            {states.map((state) => (
              <option key={state.isoCode} value={state.name}>
                {state.name}
              </option>
            ))}
          </select>
        )}

        {/* City Dropdown */}
        {selectedState && (
          <select
            className="modal-input"
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            disabled={!selectedState}
          >
            <option value="">Select City</option>
            {cities.map((city) => (
              <option key={city.name} value={city.name}>
                {city.name}
              </option>
            ))}
          </select>
        )}

        <textarea
          placeholder="Best Memory"
          className="modal-input"
          value={memory}
          onChange={(e) => setMemory(e.target.value)}
          rows={4}
        />

        <ImageUpload onFilesChange={handleImagesChange} />

        <div className="modal-actions">
          <button className="btn cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="btn save" onClick={handleSave} disabled={loading}>
            {loading ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
