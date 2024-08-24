import React, { useEffect, useState} from 'react';
import axios from 'axios';
import {Link, useNavigate} from 'react-router-dom';
import "../styles/addLocation.css"
import {useTranslation} from "react-i18next";


function AddLocation() {
    const [name, setName] = useState("");
    const navigate = useNavigate();
    const accessToken = localStorage.getItem('accessToken');
    const[description, setDescription] = useState("");
    const[country, setCountry] = useState("");
    const[city, setCity] = useState("");
    const[choosenLocationType, setChoosenLocationType] = useState([]);
    const[payment_key, setPaymentKey] = useState("");
    const [error, setError] = useState(null);
    const [location_type, setLocationType] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { t } = useTranslation();
    const openModal = () => setIsModalOpen(true);

    useEffect(() => {
        if (!accessToken) {
            navigate('/login');
        } else {
            const url = new URL(window.location.href);
            const key = url.href.split('/addLocation?')[1]

            if (key){
                setPaymentKey(key);
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
        }
    }, [accessToken, navigate]);


    const handleSubmit = async (e) => {
        e.preventDefault();


        try {
            const response = await axios.post('http://127.0.0.1:8000/api/v1/locations/', {
                name,
                description,
                country,
                city,
                location_type,
                payment_key

            }, {headers:{Authorization: `Bearer ${accessToken}`}});
            openModal()
        }catch (error){
            setError(error.response ? error.response.data : 'Error: Network Error');
        }
    }


    return (
        <div className="login-container">
            <div className="login-form">
                <h2 className="text-center mb-4">{t('addLoc')}</h2>
                <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="first_name" className="form-label">{t('name')}</label>
                            <input
                                type="text"
                                className="form-control"
                                id="first_name"
                                value={name}
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
                                value={description}
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
                            value={country}
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
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            required
                        />
                    </div>
                    <div className="row mb-3">
                        <div className="col">
                            <label htmlFor="gender" className="form-label">{t('locType')}</label>
                            <select id="males" className="form-control" onChange={(e) => setLocationType(e.target.value)}>
                                {choosenLocationType.map(type =>(
                                    <option key={type.id} value={type.id}>{type.name}</option>
                                ))}
                            </select>
                        </div>

                    </div>
                    <button type="submit" className="btn btn-success w-100">{t('add')}</button>
                </form>


                {error && (
                    <div className="mt-3 text-danger">
                        <p>{JSON.stringify(error)}</p>
                    </div>
                )}
                {isModalOpen && (
                    <div className="modal modal-center">
                        <div className="modal-content">
                            <h1 className="modal-h1">🎉</h1>
                            <h2>{t('congrats')}</h2>
                            <p className="modal-text">{t('greetingLoc')}</p>
                            <Link className="modal-link" to="/dashboard">{t('great')}</Link>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );

}

export default AddLocation
