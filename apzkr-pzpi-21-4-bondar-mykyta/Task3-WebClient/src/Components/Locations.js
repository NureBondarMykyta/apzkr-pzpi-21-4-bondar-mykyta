import React, {useEffect, useState} from 'react';
import axios from "axios";
import {useTranslation} from "react-i18next";


function Locations() {

    const [locations, setLocations] = useState([]);
    const [error, setError] = useState(null);
    const [choosenLocationType, setChoosenLocationType] = useState([]);
    const accessToken = localStorage.getItem("accessToken");
    const [isDelModalOpen, setIsDelModalOpen] = useState(false);
    const [idSelectedUser, setIdSelectedUser] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 15;

    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;

    const [searchTerm, setSearchTerm] = useState('');

    const {t} = useTranslation();



    const openDelModal = (id) => { setIsDelModalOpen(true); setIdSelectedUser(id); };
    const closeModal = () =>  setIsDelModalOpen(false);

    useEffect(() => {

        const fetchLocation = async () => {
            try {
                const locationInfoResponse = await axios.get(`http://127.0.0.1:8000/api/v1/locations/`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });
                setLocations(locationInfoResponse.data);

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
    }, [accessToken]);



    const filtereLocations = locations.filter(location =>
        location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        location.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        location.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
        location.city.toLowerCase().includes(searchTerm.toLowerCase())
    );


    const currentRecords = filtereLocations.slice(indexOfFirstRecord, indexOfLastRecord);
    const totalPages = Math.ceil(filtereLocations.length / recordsPerPage);

    const handleDelete = async (locationId) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/v1/locations/${locationId}/`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            closeModal()
            setLocations(locations.filter(location => location.id !== locationId));
        } catch (error) {
            setError('Error: Network Error');
        }
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="container mt-3">
            <h2>{t('locations')}</h2>
            <input
                type="text"
                placeholder={t('searchLoc')}
                className="admin-search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="table-responsive">
                <table className="table table-striped table-sm">
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>{t('name')}</th>
                        <th>{t('description')}</th>
                        <th>{t('country')}</th>
                        <th>{t('city')}</th>
                        <th>{t('locType')}</th>
                        <th>{t('action')}</th>
                    </tr>
                    </thead>
                    <tbody>
                    {currentRecords.map(location => (
                        <React.Fragment key={location.id}>
                            <tr style={{cursor: 'pointer'}} key={location.id}>
                                <td>{location.id}</td>
                                <td>{location.name}</td>
                                <td>{location.description}</td>
                                <td>{location.country}</td>
                                <td>{location.city}</td>
                                <td>
                                    {choosenLocationType.find(type => type.id === location.location_type)?.name || 'Unknown'}
                                </td>
                                <td>
                                    <button onClick={() => openDelModal(location.id)}
                                            className="admin-locations-btn">❌
                                    </button>
                                </td>
                            </tr>
                        </React.Fragment>
                    ))}
                    </tbody>
                </table>

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
                            <h2>{t('delUserLocation')}</h2>
                            <p>{t('delLocAccept')} <b>{t('location')}</b>?</p>
                            <div className="modal-btn-container">
                                <button className="del-button" onClick={() => handleDelete(idSelectedUser)}>{t('yes')}</button>
                                <button className="del-button no-del" onClick={closeModal}>{t('no')}</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Locations;
