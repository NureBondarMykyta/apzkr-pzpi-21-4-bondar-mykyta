import React, {useEffect, useState} from 'react';
import {json, Link, useNavigate} from "react-router-dom";
import axios from "axios";
import userIcon from '../images/userIcon2.png';
import "../styles/UserViewProfile.css";
import {useTranslation} from "react-i18next";



function UserViewProfile() {
    const accessToken = localStorage.getItem('accessToken');
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [first_name, setFirstName] = useState('');
    const [last_name, setLastName] = useState('');
    const [id, setId] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [error, setError] = useState(null);
    const [email, setEmail] = useState('');
    const { t } = useTranslation();

    useEffect(() => {
        if (!accessToken) {
            navigate('/login');
        }


        const fetchUserData = async () => {
            try{
                const userData = await axios.get('http://127.0.0.1:8000/api/v1/users/current_user/', { headers: { Authorization: `Bearer ${accessToken}` } });
                setUser(userData.data);
            } catch (err){
                return err;
            }

        }
        fetchUserData();


    }, [accessToken, navigate]);

    useEffect(() => {
        if(user){
            setFirstName(user.first_name);
            setLastName(user.last_name)
            setUsername(user.username);
            setEmail(user.email);
            setId(user.id);

        }
    }, [user]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        if(password) {
            if(password === confirmPassword) {
                setPassword(password);
                try {
                    await axios.patch(`http://127.0.0.1:8000/api/v1/users/${id}/`, {
                        first_name,
                        last_name,
                        email,
                        username,
                        password
                    }, {
                        headers: { Authorization: `Bearer ${accessToken}` }
                    })
                    setIsModalOpen(true);
                } catch (error) {
                    setError("Username already exists!");
                }

            } else {
                setError("Passwords don't match");
            }
        } else {
        try {
            await axios.patch(`http://127.0.0.1:8000/api/v1/users/${id}/`, {
                first_name,
                last_name,
                email,
                username,
            }, {
                headers: { Authorization: `Bearer ${accessToken}` }
            })
            setIsModalOpen(true);
        } catch (error) {
            setError("Username already exists!");
        }
        }
    }

    return (

        <div className="container mt-3">
            <div className="">
                <Link className="back-btn-profile" to="/dashboard">← {t('back')}</Link>
                <div className="body-profile">
                    <div className="text-center">
                        <img src={userIcon} alt="Profile" className="rounded-circle img-thumbnail" style={{ width: '120px', height: '120px' }} />
                        <h2>{first_name} {last_name}</h2>
                        <p>@{username}</p>
                    </div>
                    <form className="edit-user-form" onSubmit={handleSubmit}>
                        <div className="row mb-3 child">
                            <div className="form-group col-md-3">
                                <label htmlFor="first_name" className="input-header">{t('name')}</label>
                                <input type="text"
                                       className="form-control input-profile"
                                       id="first_name"
                                       defaultValue={first_name}
                                       onChange={(e) => setFirstName(e.target.value)}
                                       />
                            </div>
                            <div className="form-group col-md-3">
                                <label htmlFor="last_name" className="input-header">{t('surname')}</label>
                                <input type="text"
                                       defaultValue={last_name}
                                       className="form-control input-profile"
                                       id="last_name"
                                       onChange={(e) => setLastName(e.target.value)}/>
                            </div>
                        </div>

                        <div className="row mb-3 child">
                            <div className="form-group col-md-3">
                                <label htmlFor="username" className="input-header">{t('username')}</label>
                                <input type="text"
                                       className="form-control input-profile"
                                       id="username"
                                       defaultValue={username}
                                       onChange={(e) => setUsername(e.target.value)}/>
                            </div>
                            <div className="form-group col-md-3">
                                <label htmlFor="email" className="input-header">{t('email')}</label>
                                <input type="text"
                                       className="form-control input-profile"
                                       id="email"
                                       defaultValue={email}
                                       onChange={(e) => setEmail(e.target.value)}/>
                            </div>
                        </div>

                        <div className="row mb-3 child">
                            <div className="form-group col-md-3">
                                <label htmlFor="password" className="input-header">{t('newPass')}</label>
                                <input type="password"
                                       className="form-control input-profile"
                                       id="password"
                                       onChange={(e) => setPassword(e.target.value)}/>

                            </div>
                            <div className="form-group col-md-3">
                                <label htmlFor="confirmPassword" className="input-header">{t('confirmPass')}</label>
                                <input type="password"
                                       className="form-control input-profile"
                                       id="confirmPassword"
                                       onChange={(e) => setConfirmPassword(e.target.value)}/>
                            </div>
                        </div>
                        <div className="btn-container">
                        <button type="submit" className="btn btn-primary btn-edit-profile">{t('saveChanges')}</button>
                        </div>
                    </form>
                </div>
            </div>
            {error && (
                <div className="modal">
                    <div className="modal-content modal-center">
                        <h1 className="modal-h1">😬</h1>
                        <h2>Oops!</h2>
                        <p className="modal-text">An error occurred</p>
                        <p>{error}</p>
                        <a className="modal-link" onClick={() => setError(null)}>{t('tryAgain')}</a>
                    </div>
                </div>
            )}

            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content modal-center">
                        <h1 className="modal-h1">🎉</h1>
                        <h2>{t('congrats')}</h2>
                        <p className="modal-text">{t('greetUpdateUser')}</p>
                        <Link className="modal-link" to="/dashboard">{t('great')}</Link>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UserViewProfile;