import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';

const LocationSelector = () => {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  const [isStateEnabled, setIsStateEnabled] = useState(false);
  const [isCityEnabled, setIsCityEnabled] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null); 
    axios.get('https://crio-location-selector.onrender.com/countries')
      .then(response => {
        setCountries(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching countries:', error);
        setError('Failed to load countries. Please try again later.');
        setCountries([]); 
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      setLoading(true);
      setError(null); 
      axios.get(`https://crio-location-selector.onrender.com/country=${selectedCountry}/states`)
        .then(response => {
          setStates(response.data);
          setIsStateEnabled(true);
          setSelectedState(''); 
          setIsCityEnabled(false); 
          setCities([]); 
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching states:', error);
          setError('Failed to load states. Please try again later.');
          setStates([]); 
          setLoading(false);
        });
    }
  }, [selectedCountry]);

  useEffect(() => {
    if (selectedCountry && selectedState) {
      setLoading(true);
      setError(null); 
      axios.get(`https://crio-location-selector.onrender.com/country=${selectedCountry}/state=${selectedState}/cities`)
        .then(response => {
          setCities(response.data);
          setIsCityEnabled(true); 
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching cities:', error);
          setError('Failed to load cities. Please try again later.');
          setCities([]); 
          setLoading(false);
        });
    }
  }, [selectedState]);

  const handleCountryChange = (e) => {
    setSelectedCountry(e.target.value);
  };

  const handleStateChange = (e) => {
    setSelectedState(e.target.value);
  };

  const handleCityChange = (e) => {
    setSelectedCity(e.target.value);
  };

  return (
    <div>
      <h1>Select Location</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="error-message">{error}</p>}
      
      <div>
        <label>Country:</label>
        <select onChange={handleCountryChange} value={selectedCountry} disabled={error !== null}>
          <option value="">Select Country</option>
          {countries.length > 0 && countries.map((country) => (
            <option key={country} value={country}>{country}</option>
          ))}
        </select>
      </div>

      <div>
        <label>State:</label>
        <select onChange={handleStateChange} value={selectedState} disabled={!isStateEnabled || error !== null}>
          <option value="">Select State</option>
          {states.length > 0 && states.map((state) => (
            <option key={state} value={state}>{state}</option>
          ))}
        </select>
      </div>

      <div>
        <label>City:</label>
        <select onChange={handleCityChange} value={selectedCity} disabled={!isCityEnabled || error !== null}>
          <option value="">Select City</option>
          {cities.length > 0 && cities.map((city) => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
      </div>

      {selectedCountry && selectedState && selectedCity && (
        <div>
          <h3>You selected {selectedCity}, {selectedState}, {selectedCountry}</h3>
        </div>
      )}
    </div>
  );
};

export default LocationSelector;
