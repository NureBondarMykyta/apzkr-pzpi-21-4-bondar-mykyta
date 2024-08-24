import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import {useTranslation} from "react-i18next";

function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const accessToken = localStorage.getItem('accessToken');
    const {t} = useTranslation();

    const [first_name, setName] = useState("");
    const [username, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [last_name, setLastName] = useState("");

    const [idSelectedUser, setIdSelectedUser] = useState("");
    const [isDelModalOpen, setIsDelModalOpen] = useState(false);
    const [isStuffModalOpen, setIsStuffModalOpen] = useState(false);
    const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 10;

    const [searchTerm, setSearchTerm] = useState('');

    const openDelModal = (id) => { setIsDelModalOpen(true); setIdSelectedUser(id); };
    const openAdminModal = (id) => { setIsAdminModalOpen(true); setIdSelectedUser(id); };
    const openStuffModal = (id) => { setIsStuffModalOpen(true); setIdSelectedUser(id); };

    const closeModal = () => { setIsDelModalOpen(false); setIsStuffModalOpen(false); setIsAdminModalOpen(false); };

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/v1/users/', {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });
                setUsers(response.data);
                setLoading(false);
            } catch (error) {
                setError('Failed to fetch users');
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    useEffect(() => {
        users.forEach(user => {
            if (selectedUserId === user.id) {
                setUserName(user.username);
                setEmail(user.email);
                setName(user.first_name);
                setLastName(user.last_name);
            }
        });
    }, [selectedUserId, users]);

    const handleRowClick = (userId) => {
        setSelectedUserId(userId);
    };

    const handleDelete = async (userId) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/v1/users/${userId}/`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            setUsers(users.filter(user => user.id !== userId));
            closeModal();

        } catch (error) {
            setError(error.response ? error.response.data : 'Error: Network Error');
        }
    };

    const handleSetStuff = async (userId) => {
        try {
            await axios.post(`http://127.0.0.1:8000/api/v1/users/${userId}/set_staff/`, {}, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            closeModal();
            window.location.reload();
        } catch (error) {
            console.log('error');
        }
    };

    const handleSetAdmin = async (userId) => {
        try {
            await axios.post(`http://127.0.0.1:8000/api/v1/users/${userId}/set_superuser/`, {}, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            closeModal();
            window.location.reload();
        } catch (error) {
            console.log('error');
        }
    };

    const handleEdit = async (userId) => {
        try {
            await axios.patch(`http://127.0.0.1:8000/api/v1/users/${userId}/`, {
                first_name,
                last_name,
                email,
                username,
            }, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            window.location.reload();
        } catch (error) {
            setError(error.response ? error.response.data : 'Error: Network Error');
        }
    };

    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;

    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.last_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const currentRecords = filteredUsers.slice(indexOfFirstRecord, indexOfLastRecord);
    const totalPages = Math.ceil(filteredUsers.length / recordsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="container mt-2">
            <h2>{t('users')}</h2>

            <input
                type="text"
                placeholder={t('serach')}
                className="admin-search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />

            <div className="table-responsive">
                <table className="table table-striped table-sm tabble-admin">
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>{t('username')}</th>
                        <th>{t('email')}</th>
                        <th>{t('firstName')}</th>
                        <th>{t('surname')}</th>
                        <th>{t('gender')}</th>
                        <th>{t('lastLogin')}</th>
                        <th>{t('isActive')}</th>
                        <th>{t('isStaff')}</th>
                        <th>{t('isAdmin')}</th>
                        <th>{t('wasPaid')}</th>
                    </tr>
                    </thead>
                    <tbody>
                    {currentRecords.map(user => (
                        <React.Fragment key={user.id}>
                            <tr onSubmit={handleEdit} onClick={() => handleRowClick(user.id)} style={{ cursor: 'pointer' }}>
                                <td>{user.id}</td>
                                <td>
                                    {selectedUserId === user.id ? (
                                        <input
                                            className="admin-input"
                                            type="text"
                                            defaultValue={user.username}
                                            id="username"
                                            onChange={(e) => setUserName(e.target.value)}
                                        />
                                    ) : (
                                        user.username
                                    )}
                                </td>
                                <td>
                                    {selectedUserId === user.id ? (
                                        <input
                                            className="admin-input"
                                            type="text"
                                            defaultValue={user.email}
                                            id="email"
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    ) : (
                                        user.email
                                    )}
                                </td>
                                <td>
                                    {selectedUserId === user.id ? (
                                        <input
                                            className="admin-input"
                                            type="text"
                                            defaultValue={user.first_name}
                                            id="first_name"
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                    ) : (
                                        user.first_name
                                    )}
                                </td>
                                <td>
                                    {selectedUserId === user.id ? (
                                        <input
                                            className="admin-input"
                                            type="text"
                                            defaultValue={user.last_name}
                                            id="last_name"
                                            onChange={(e) => setLastName(e.target.value)}
                                        />
                                    ) : (
                                        user.last_name
                                    )}
                                </td>
                                <td>{user.gender}</td>
                                <td>{format(new Date(user.last_login), 'MM.dd HH:mm:ss')}</td>
                                <td>{user.is_active ? (<p style={{ color: 'green' }}>{t('true')}</p>) : (<p style={{ color: 'red' }}>{t('false')}</p>)}</td>
                                <td>{user.is_staff ? (<p style={{ color: 'green' }}>{t('true')}</p>) : (<p style={{ color: 'red' }}>{t('false')}</p>)}</td>
                                <td>{user.is_superuser ? (<p style={{ color: 'green' }}>{t('true')}</p>) : (<p style={{ color: 'red' }}>{t('false')}</p>)}</td>
                                <td>{user.payment_key ? (<p style={{ color: 'green' }}>{t('paid')}</p>) : (<p style={{ color: 'red' }}>{t('false')}</p>)}</td>
                            </tr>
                            {selectedUserId === user.id && (
                                <tr style={{ padding: '10px' }}>
                                    <td colSpan="11" className="fade-in">
                                        <div className="drop-row">
                                            <div>
                                                <button
                                                    className="admin-row-btn edit"
                                                    type="submit"
                                                    onClick={() => handleEdit(user.id)}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => openDelModal(user.id)}
                                                    className="admin-row-btn del"
                                                >
                                                    Del
                                                </button>
                                                <button
                                                    onClick={() => openStuffModal(user.id)}
                                                    className="admin-row-btn set-stuff"
                                                >
                                                    {t('setStuff')}
                                                </button>
                                                <button
                                                    onClick={() => openAdminModal(user.id)}
                                                    className="admin-row-btn set-stuff"
                                                >
                                                    {t('setAdmin')}
                                                </button>
                                            </div>
                                            <div>
                                                <button onClick={setSelectedUserId} className="admin-row-btn del">{t('close')}</button>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
                    ))}
                    </tbody>
                </table>

                {/* Pagination controls */}
                <div className="pagination">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="page-button"
                    >
                        {t('previous')}
                    </button>
                    {[...Array(totalPages)].map((_, index) => (
                        <button
                            key={index + 1}
                            onClick={() => handlePageChange(index + 1)}
                            className={`page-button ${currentPage === index + 1 ? 'active' : ''}`}
                        >
                            {index + 1}
                        </button>
                    ))}
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="page-button"
                    >
                        {t('next')}
                    </button>
                </div>
                {isDelModalOpen && (
                    <div className="modal">
                        <div className="modal-content modal-center">
                            <h1>🫣</h1>
                            <h2>{t('delUser')}</h2>
                            <p>{t('delUserAccept')}<b> {t('user')}</b>? {t('someSettings')}</p>
                            <div className="modal-btn-container">
                                <button className="del-button" onClick={() => handleDelete(idSelectedUser)}>{t('yes')}</button>
                                <button className="del-button no-del" onClick={closeModal}>{t('no')}</button>
                            </div>
                        </div>
                    </div>
                )}
                {isStuffModalOpen && (
                    <div className="modal">
                        <div className="modal-content modal-center">
                            <h1>🤔</h1>
                            <h2>{t('setUserStuff')}</h2>
                            <p>{t('setAccept')} <b>{t('user')}</b> {t('staff')}?</p>
                            <div className="modal-btn-container">
                                <button className="del-button" onClick={() => handleSetStuff(idSelectedUser)}>{t('yes')}</button>
                                <button className="del-button no-del" onClick={closeModal}>{t('no')}</button>
                            </div>
                        </div>
                    </div>
                )}
                {isAdminModalOpen && (
                    <div className="modal">
                        <div className="modal-content modal-center">
                            <h1>🤔</h1>
                            <h2>{t('setUserAdmin')}</h2>
                            <p>{t('setAccept')} <b>{t('user')}</b> {t('admin')}?</p>
                            <div className="modal-btn-container">
                                <button className="del-button" onClick={() => handleSetAdmin(idSelectedUser)}>{t('yes')}</button>
                                <button className="del-button no-del" onClick={closeModal}>{t('no')}</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Users;
