import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import UserDashboard from './UserDashboard';
import Register from "./Components/Register";
import AddLocation from "./Components/AddLocation";
import LocationInfo from "./Components/LocationInfo";
import LocationEdit from "./Components/LocationEdit";
import UserViewProfile from "./Components/UserViewProfile";
import AdminDashboard from "./Components/AdminDashboard";
import Layout from './Components/Layout';
import './i18n';


function App() {
  return (
      <Router>
          <Layout>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/register" element={<Register />} />
            <Route path="/addLocation" element={<AddLocation />} />
            <Route path="/locationInfo" element={<LocationInfo />} />
            <Route path="/locationEdit" element={<LocationEdit />} />
            <Route path="/profile" element={<UserViewProfile />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />

          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
          </Layout>
      </Router>
  );
}

export default App;
