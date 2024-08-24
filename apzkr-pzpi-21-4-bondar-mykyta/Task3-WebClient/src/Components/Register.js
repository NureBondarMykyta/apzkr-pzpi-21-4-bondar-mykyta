import React, {lazy, useState} from 'react';
import axios from 'axios';
import {Link, useNavigate} from 'react-router-dom';
import {useTranslation} from "react-i18next";


function Register() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [first_name, setFirstName] = useState('');
    const [last_name, setLastName] = useState('');
    const [gender, setGender] = useState('');
    const [birth_date, setBirthday] = useState('');
    const [error, setError] = useState(null);
    const { t } = useTranslation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(password == confirmPassword) {
            try {
                const response = await axios.post('http://127.0.0.1:8000/api/v1/users/', {
                    first_name,
                    last_name,
                    username,
                    email,
                    password,
                    gender,
                    birth_date
                });
                setError(null);
                navigate('/login')
            } catch (error) {
                setError(error.response ? error.response.data : 'Error: Network Error');
            }
        }else{
            setError('Password dont match');
        }

    }
    return (
        <div className="login-container">
            <div className="login-form">
                <h2 className="text-center mb-4">{t('registartion')}</h2>
                <form onSubmit={handleSubmit}>

                  <div className="row mb-3">
                    <div className="col">
                        <label htmlFor="first_name" className="form-label">{t('firstName')}</label>
                        <input
                            type="text"
                            className="form-control"
                            id="first_name"
                            value={first_name}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="col">
                        <label htmlFor="first_name" className="form-label">{t('surname')}</label>
                        <input
                            type="text"
                            className="form-control"
                            id="last_name"
                            value={last_name}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                        />
                    </div>
                  </div>
                    <div className="mb-3">
                        <label htmlFor="username" className="form-label">{t('username')}</label>
                        <input
                            type="text"
                            className="form-control"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="username" className="form-label">{t('email')}</label>
                        <input
                            type="text"
                            className="form-control"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="row mb-3">
                    <div className="col">
                        <label htmlFor="password" className="form-label">{t('password')}</label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="col">
                        <label htmlFor="username" className="form-label">{t('confirmPass')}</label>
                        <input
                            type="password"
                            className="form-control"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">{t('birthday')}</label>
                        <input
                            type="date"
                            className="form-control"
                            id="birthady"
                            value={birth_date}
                            onChange={(e) => setBirthday(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="gender" className="form-label">{t('gender')}</label>
                        <select id="males" className="form-control" onChange={(e) => setGender(e.target.value)}>
                            <option value="M">{t('male')}</option>
                            <option value="F">{t('female')}</option>
                        </select>
                    </div>

                    <button type="submit" className="btn btn-success w-100">{t('submitRegistr')}</button>
                </form>
                <div className="mt-3 text-center">
                    {t('alreadyHaveAcc')} <Link to="/login">{t('login')}</Link>
                </div>
                {error && (
                    <div className="mt-3 text-danger">
                        <p>{JSON.stringify(error)}</p>
                    </div>
                )}
                {
                    
                }
            </div>
        </div>
    );
}

export default Register;