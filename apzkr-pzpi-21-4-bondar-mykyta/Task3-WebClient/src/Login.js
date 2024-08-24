import React, { useState } from 'react';
import axios from 'axios';
import {Link, useNavigate} from 'react-router-dom';
import './styles/login.css';
import {useTranslation} from "react-i18next";


function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { t } = useTranslation();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/v1/token/', {
                username,
                password,
            });
            localStorage.setItem('accessToken', response.data.access);
            localStorage.setItem('username', username);
            setError(null);
            navigate('/dashboard');
        } catch (error) {
            setError(error.response ? error.response.data : 'Error: Network Error');
        }
    };

    return (
        <div className="login-container">
            <div className="login-form">
                <h2 className="text-center mb-4">{t('login')}</h2>
                <form onSubmit={handleSubmit}>
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
                    <button type="submit" className="btn btn-success w-100">{t('submit')}</button>
                </form>
                <div className="mt-3 text-center">
                    {t('logRegistr')} <Link to="/register">{t('register')}</Link>
                </div>
                {error && (
                    <div className="mt-3 text-danger">
                        <p>{JSON.stringify(error)}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Login;
