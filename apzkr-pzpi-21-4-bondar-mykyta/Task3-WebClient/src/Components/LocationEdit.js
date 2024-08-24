import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import "../styles/addLocation.css"
import {useTranslation} from "react-i18next";

function LocationEdit() {
    const location = useLocation();
    const { id } = location.state;
    const [name, setName] = useState("");
    const navigate = useNavigate();
    const accessToken = localStorage.getItem('accessToken');
    const [description, setDescription] = useState("");
    const [country, setCountry] = useState("");
    const [city, setCity] = useState("");
    const [choosenLocationType, setChoosenLocationType] = useState([]);
    const [error, setError] = useState(null);
    const [location_type, setLocationType] = useState("");
    const [locationData, setLocationData] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { t } = useTranslation();


    const openModal = () => setIsModalOpen(true);

    useEffect(() => {
        if (!accessToken) {
            navigate('/login');
        }

        const fetchLocation = async () => {
            try {
                const locationInfoResponse = await axios.get(`http://127.0.0.1:8000/api/v1/locations/`, {
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
            } catch (err) {
                setError(err);
            }
        }
        const fetchLocationTypes = async () => {
            try {
                const locationTypeResponse = await axios.get('http://127.0.0.1:8000/api/v1/locations-types/', {
                    headers:{
                        Authorization: `Bearer ${accessToken}`
                    }
                });
                setChoosenLocationType(locationTypeResponse.data);
            } catch (err){
                setError(err);
            }
        }
        fetchLocationTypes();

        fetchLocation();
    }, [accessToken, navigate, id]);

    useEffect(() => {
        if (locationData) {
            setName(locationData.name);
            setDescription(locationData.description);
            setCountry(locationData.country);
            setCity(locationData.city);
            setLocationType(locationData.location_type);
        }
    }, [locationData]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log(name);

        try {
            await axios.patch(`http://127.0.0.1:8000/api/v1/locations/${id}/`, {
                name,
                description,
                country,
                city,
                location_type,
            }, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            openModal();
        } catch (error) {
            setError(error.response ? error.response.data : 'Error: Network Error');
        }
    }


    return (
        <div className="login-container">
            <div className="login-form">
                <h2 className="text-center mb-4">{t('editLoc')}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="first_name" className="form-label">{t('name')}</label>
                        <input
                            defaultValue={name}
                            type="text"
                            className="form-control"
                            id="first_name"
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="first_name" className="form-label">{t('description')}</label>
                        <input
                            type="text"
                            className="form-control"
                            id="last_name"
                            defaultValue={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="username" className="form-label">{t('country')}</label>
                        <input
                            type="text"
                            className="form-control"
                            id="username"
                            defaultValue={country}
                            onChange={(e) => setCountry(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="username" className="form-label">{t('city')}</label>
                        <input
                            type="text"
                            className="form-control"
                            id="email"
                            defaultValue={city}
                            onChange={(e) => setCity(e.target.value)}
                            required
                        />
                    </div>
                    <div className="row mb-3">
                        <div className="col">
                            <label htmlFor="gender" className="form-label">{t('locType')}</label>
                            <select id="males" className="form-control" value={location_type}
                                    onChange={(e) => setLocationType(e.target.value)}>
                                {choosenLocationType.map(type => (
                                    <option key={type.id} value={type.id}>{type.name}</option>
                                ))}
                            </select>
                        </div>

                    </div>
                    <button type="submit" className="btn btn-success w-100">{t('update')}</button>
                </form>
                <div className="mt-3 text-center">
                    <Link to="/dashboard">{t('backToDash')}</Link>
                </div>


                {error && (
                    <div className="mt-3 text-danger">
                        <p>{JSON.stringify(error)}</p>
                    </div>
                )}

                {isModalOpen && (
                    <div className="modal">
                        <div className="modal-content modal-center">
                            <h1 className="modal-h1">🎉</h1>
                            <h2>{t('congrats')}</h2>
                            <p className="modal-text">{t('greetingEditLoc')}</p>
                            <Link className="modal-link" to="/dashboard">{t('great')}</Link>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );

}

export default LocationEdit
