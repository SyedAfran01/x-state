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

  // Fetch countries on component mount
  useEffect(() => {
    setLoading(true);
    axios.get('https://crio-location-selector.onrender.com/countries')
      .then(response => {
        setCountries(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching countries:', error);
        setError('Failed to load countries');
        setLoading(false);
      });
  }, []);

  // Fetch states when a country is selected
  useEffect(() => {
    if (selectedCountry) {
      setLoading(true);
      axios.get(`https://crio-location-selector.onrender.com/country=${selectedCountry}/states`)
        .then(response => {
          setStates(response.data);
          setIsStateEnabled(true);
          setSelectedState(''); 
          setIsCityEnabled(false); 
          setCities([]); // Clear cities when country changes
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching states:', error);
          setError('Failed to load states');
          setLoading(false);
        });
    }
  }, [selectedCountry]);

  // Fetch cities when a state is selected
  useEffect(() => {
    if (selectedCountry && selectedState) {
      setLoading(true);
      axios.get(`https://crio-location-selector.onrender.com/country=${selectedCountry}/state=${selectedState}/cities`)
        .then(response => {
          setCities(response.data);
          setIsCityEnabled(true); 
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching cities:', error);
          setError('Failed to load cities');
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
      {error && <p>{error}</p>}
      <div>
        <label>Country:</label>
        <select onChange={handleCountryChange} value={selectedCountry}>
          <option value="">Select Country</option>
          {countries.map((country) => (
            <option key={country} value={country}>{country}</option>
          ))}
        </select>
      </div>

      <div>
        <label>State:</label>
        <select onChange={handleStateChange} value={selectedState} disabled={!isStateEnabled}>
          <option value="">Select State</option>
          {states.map((state) => (
            <option key={state} value={state}>{state}</option>
          ))}
        </select>
      </div>

      <div>
        <label>City:</label>
        <select onChange={handleCityChange} value={selectedCity} disabled={!isCityEnabled}>
          <option value="">Select City</option>
          {cities.map((city) => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
      </div>

      {selectedCountry && selectedState && selectedCity && (
        <div>
          <h3>You selected: {selectedCity}, {selectedState}, {selectedCountry}</h3>
        </div>
      )}
    </div>
  );
};

export default LocationSelector;
