import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import "../styles/locationInfo.css";
import { format } from 'date-fns';
import {useTranslation} from "react-i18next";

function LocationInfo() {
    const location = useLocation();
    const { id } = location.state;
    const [error, setError] = useState(null);
    const accessToken = localStorage.getItem('accessToken');
    const navigate = useNavigate();
    const [locationData, setLocationData] = useState(null);
    const { t } = useTranslation();

    useEffect(() => {
        if (!accessToken) {
            navigate('/login');
        } else {
            const fetchLocationData = async () => {
                try {
                    const locationInfoResponse = await axios.get('http://127.0.0.1:8000/api/v1/locations-data/', {
                        headers: {
                            Authorization: `Bearer ${accessToken}`
                        }
                    });


                    const location = locationInfoResponse.data.find(loc => loc.id === id);
                    if (location) {
                        setLocationData(location);
                    } else {
                        setError('Location not found');
                    }
                } catch (error) {
                    console.error('Error fetching data:', error);
                    setError(error.response ? error.response.data : 'Error: Network Error');
                }
            }
            fetchLocationData();
        }
    }, [accessToken, navigate, id]);


    function getClassForValue(value, max_value) {
        if (value > max_value) {
            return 'state-danger';
        } else if (value > max_value * 0.7) {
            return 'state-warning';
        } else {
            return 'state-normal';
        }
    }

    if (error) {
        return <p style={{ color: 'red' }}>{error}</p>;
    }

    if (!locationData) {
        return <p>Loading...</p>;
    }

    return (
        <div className="container mt-5">
            <h1 className="title">{t('locInfo')}</h1>
            <div className="location-info-container">
                {locationData.monitoring_data && locationData.monitoring_data.length > 0 ? (
                    <div className="row">
                        {locationData.monitoring_data.map((data, index) => (
                            <div key={index} className="col-md-4 mb-4">
                                <div className={`card card-info ${getClassForValue(data.value, data.parameter.max_value)}`}>
                                    <div className="card-body">
                                        <h5 className="card-title">{data.parameter.parameter_name}</h5>
                                        <p className="card-text">
                                            {data.value} {data.parameter.unit}
                                        </p>
                                        <p className="card-text-time">{t('updated')}: {format(new Date(data.update_time), 'yyyy.MM.dd HH:mm:ss')}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>{t('emptyInfo')}</p>
                )}
                <h1 className="aqi"><strong>AQI:</strong> {locationData.AQI}</h1>
                <Link to="/dashboard" className="btn-dashboard btn-outline-danger btn-back">{t('dashboard')}</Link>
            </div>
        </div>
    );
}

export default LocationInfo;
