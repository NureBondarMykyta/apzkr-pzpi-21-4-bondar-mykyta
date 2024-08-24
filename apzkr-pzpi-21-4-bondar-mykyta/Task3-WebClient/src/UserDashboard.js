import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "./styles/userDashboard.css";
import image from './images/earth.png'
import notificationImage from "./images/notification2.png";
import mail from "./images/mail.png";
import {format} from "date-fns";
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from "./Components/LanguageSwitcher";


function UserDashboard() {
    const [userInfo, setUserInfo] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const accessToken = localStorage.getItem('accessToken');
    const [locations, setLocations] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDelModalOpen, setIsDelModalOpen] = useState(false);
    const [idDelLocation, setIdDelLocation] = useState("");
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);


    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const openDelModal = (id) => {setIsDelModalOpen(true); setIdDelLocation(id);};
    const closeDelModal = () => setIsDelModalOpen(false);

    const openNotificationModal = () => {setIsNotificationOpen(true);};
    const closeNotificationModal = () => {setIsNotificationOpen(false);};


    useEffect(() => {
        if (!accessToken) {
            navigate('/login');
        } else {

            const fetchUserData = async () => {
                try {
                    const userResponse = await axios.get('http://127.0.0.1:8000/api/v1/users/current_user/', {
                        headers: {
                            Authorization: `Bearer ${accessToken}`
                        }
                    });
                    setUserInfo(userResponse.data);
                    if (userResponse.data.is_superuser){
                        navigate("/admin-dashboard")
                    }
                } catch (error) {
                    setError(error.response ? error.response.data : 'Error: Network Error');
                }
            };

            const fetchLocations = async () => {
                try {
                    const locationsResponse = await axios.get('http://127.0.0.1:8000/api/v1/locations/', {
                        headers: {
                            Authorization: `Bearer ${accessToken}`
                        }
                    });
                    setLocations(locationsResponse.data);
                } catch (error) {
                    setError(error.response ? error.response.data : 'Error: Network Error');
                }
            };

            const fetchNotifications = async () => {
                try{
                    const notificationResponse = await axios.get('http://127.0.0.1:8000/api/v1/location-notifications/', {
                        headers:{
                            Authorization: `Bearer ${accessToken}`
                        }
                    });
                    setNotifications(notificationResponse.data);
                } catch (error) {
                    setError(error.response ? error.response.data : 'Error: Network Error');
                }
            }
            fetchUserData();
            fetchLocations();
            fetchNotifications();
        }
    }, [accessToken, navigate]);

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('username');
        navigate('/login');
    };

    const delLocation = async (id) => {
        openDelModal()
        try {
            await axios.delete(`http://127.0.0.1:8000/api/v1/locations/${id}/`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            setLocations(locations.filter(location => location.id !== id));
            closeDelModal();
        } catch (error) {
            setError(error.response ? error.response.data : 'Error: Network Error');
        }
    };

    const delNotification = async (id) => {
        try {
            await axios.delete(`т`, {
                headers:{
                    Authorization: `Bearer ${accessToken}`
                }
            });
            setNotifications(notifications.filter(notification => notification.id !== id));
        } catch (error){
            setError(error.response ? error.response.data : 'Error: Network Error');
        }
    }

    const delAllNotifications = async () => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/v1/location-notifications/delete-all/`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            setNotifications([]);
        } catch (error){
            setError(error.response ? error.response.data : 'Error: Network Error');
        }
    }
    const handleClickOutside = (event) => {
        if (event.target.classList.contains('modal')) {
            closeModal();
            closeDelModal();
        }
    }
    const doPayment = async () => {
        if (!accessToken) {
            navigate('/login');
        } else {
            console.log(accessToken);
            try {
                const responseLink = await axios.post(`http://127.0.0.1:8000/api/v1/payment/`, {}, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });
                window.location.href = responseLink.data.payment_url
            } catch (error) {
                console.log(error);
            }
        }
    }

    const { t } = useTranslation();


    return (
        <div className="dashboard-container">
            <div className="header">

                <div className="header-right">
                    <a className="btn-dashboard btn-outline-danger btn-profile" onClick={() => navigate('/profile')}>{t('profile')}</a>
                    <a className="btn-dashboard btn-outline-danger" onClick={handleLogout}><span>{t('logout')}</span></a>
                    <img className="notification-image" onClick={openNotificationModal} src={notificationImage}
                         style={{width: '40px', height: '40px'}} alt="notification"/>
                    {notifications.length > 0 && (
                        <div className="not">{notifications.length}</div>
                    )}
                </div>
            </div>
            {error && (
                <div>
                    <h3>{t('error')}:</h3>
                    <pre>{JSON.stringify(error, null, 2)}</pre>
                </div>
            )}
            <div className="locations">

                <div className="header-left">
                    {userInfo && <h1>{t('greeting')}, {userInfo.first_name} 👋</h1>}
                </div>
                <div className="location-cards">
                    {locations.map(location => (
                        <div className="card" key={location.id}>
                            <div className="card-body state-normal">
                                <div onClick={() => navigate("/locationInfo", {state: {id: location.id}})}>
                                    <h1 className="card-title">{location.name}</h1>
                                    <p className="card-text">📍 {t('country')}: {location.country}</p>
                                    <p className="card-text">🏙️ {t('city')}: {location.city}</p>
                                    <p className="card-text">📝 {t('description')}: {location.description}</p>
                                    <p className="card-text">{t('stateNormal')} ✅</p>
                                    <div className="card-hint-container">
                                        <p className="card-hint-text">{t('clickMoreInfo')} →</p>
                                    </div>
                                </div>
                                <div className="card-btn-container">
                                    <button className="card-btn card-btn-edit"
                                            onClick={() => navigate("/locationEdit", {state: {id: location.id}})}>Edit
                                    </button>
                                    <button className="card-btn card-btn-del"
                                            onClick={() => openDelModal(location.id)}>Del
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    <div className="add-button-container">
                        <a className="btn-dashboard add-button" onClick={openModal}><span>+</span></a>
                    </div>
                    {isModalOpen && (
                        <div className="modal" onClick={handleClickOutside}>
                            <div className="modal-content modal-center">
                                <span className="close-button" onClick={closeModal}>&times;</span>
                                <img className="modal-img" src={image} alt="Earth"/>
                                <h2>{t('addLocation')}</h2>
                                <p>{t('payInfo')}</p>
                                <h2 className="">$5</h2>
                                <button className="pay-button" onClick={() => doPayment()}>{t('pay')}</button>
                            </div>
                        </div>
                    )}
                    {isDelModalOpen && (
                        <div className="modal">
                            <div className="modal-content modal-center">
                                <h1>🫣</h1>
                                <h2>{t('delLocation')}</h2>
                                <p>{t('sureToDelete')}
                                    {t('someSettings')}</p>
                                <div className="modal-btn-container">
                                    <button className="del-button"
                                            onClick={() => delLocation(idDelLocation)}>{t('yes')}</button>
                                    <button className="del-button no-del" onClick={closeDelModal}>{t('no')}</button>
                                </div>
                            </div>
                        </div>
                    )}
                    {isNotificationOpen ? (
                        notifications.length > 0 ? (
                            <div className="modal" onClick={handleClickOutside}>
                                <div className="modal-notifications modal-content">
                                    <span className="close-button" onClick={closeNotificationModal}>&times;</span>
                                    {notifications.map(not => (
                                        <div className="notification-block" key={not.id}>
                                            <img src={mail} alt="mail"
                                                 style={{width: '30px', height: '30px', margin: '10px', opacity: 0.5}}/>
                                            <div className="notification-text-block">
                                                <p className="notification-text">{not.content}</p>
                                                <p className="notification-text notification-time">{format(new Date(not.created_date), 'MM.dd HH:mm:ss')}</p>
                                            </div>
                                            <button onClick={() => delNotification(not.id)}
                                                    className="notifications-del-button">Del
                                            </button>
                                        </div>
                                    ))}
                                    <div className="remove-button-container">
                                        <button onClick={() => delAllNotifications()}
                                                className="notifications-removeall-button">{t('removeAll')}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="modal" onClick={handleClickOutside}>
                                <div className="modal-notifications modal-content modal-center">
                                    <span className="close-button" onClick={closeNotificationModal}>&times;</span>
                                    <h3 className="no-notifications">{t('noNotifications')}</h3>
                                </div>
                            </div>
                        )
                    ) : null}
                </div>
            </div>
        </div>
    );
}

export default UserDashboard;
