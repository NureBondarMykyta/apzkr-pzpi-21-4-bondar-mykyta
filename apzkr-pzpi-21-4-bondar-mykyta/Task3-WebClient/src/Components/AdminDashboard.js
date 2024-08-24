import React, { useState } from 'react';
import { useNavigate} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/adminDashboard.css';
import Users from './Users';
import Locations from './Locations';
import axios from 'axios';
import LanguageSwitcher from "./LanguageSwitcher";
import {useTranslation} from "react-i18next";

function AdminDashboard() {
    const [activeComponent, setActiveComponent] = useState('users');
    const navigate = useNavigate();
    const [backupStatus, setBackupStatus] = useState(null);
    const accessToken = localStorage.getItem('accessToken');
    const { t } = useTranslation();

    const renderComponent = () => {
        switch (activeComponent) {
            case 'users':
                return <Users />;
            case 'locations':
                return <Locations />;
            default:
                return <Users />;
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('username');
        navigate('/login');
    };

    const handleBackup = async () => {
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/v1/backup/', {}, {
                headers:{
                    Authorization: `Bearer ${accessToken}`,
                }
            });
            if (response.data.status === 'success') {
                setBackupStatus(t('backupSuccess'));
            } else {
                setBackupStatus(t('backupNot'));
            }
        } catch (error) {
            setBackupStatus(t('backupError'));
        }
    };



    return (
        <div className="container-fluid admin-dashboard">
            <LanguageSwitcher />
            <div className="row">
                <nav className="col-md-2 d-none d-md-block sidebar">
                    <div className="sidebar-sticky">
                        <ul className="nav flex-column">
                            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                                <h4 className="admin-header">{t('adminDashboard')}</h4>
                            </div>
                            <li className="nav-item">
                                <span
                                    className={`nav-link ${activeComponent === 'users' ? 'active' : ''}`}
                                    onClick={() => setActiveComponent('users')}
                                    style={{cursor: 'pointer'}}
                                >
                                    {t('users')}
                                </span>
                            </li>
                            <li className="nav-item">
                                <span
                                    className={`nav-link ${activeComponent === 'locations' ? 'active' : ''}`}
                                    onClick={() => setActiveComponent('locations')}
                                    style={{cursor: 'pointer'}}
                                >
                                    {t('locations')}
                                </span>
                            </li>
                            <li className="nav-item">
                                <div className="admin-backup-btn-container">
                                <button
                                    className="admin-backup-btn"
                                    onClick={handleBackup}
                                >
                                    {t('createBckup')}
                                </button>
                                </div>
                            </li>
                            <li className="nav-item">
                                <a className="btn-dashboard btn-outline-danger admin-btn" onClick={handleLogout}>
                                    {t('logout')}
                                </a>
                            </li>
                        </ul>
                    </div>
                </nav>

                <main role="main" className="col-md-9 ml-sm-auto col-lg-10 px-4">
                    {renderComponent()}
                    {backupStatus && <div className="alert alert-info mt-3">{backupStatus}</div>}
                </main>
            </div>
        </div>
    );
}

export default AdminDashboard;
