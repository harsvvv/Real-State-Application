/* eslint-disable no-unused-vars */
import React from 'react';
import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';

const PrivateRoute = () => {
    // Select currentUser from the Redux store
    const currentUser = useSelector((state) => state.user.currentUser);

    // If currentUser exists, render the nested routes; otherwise, redirect to the sign-in page
    return currentUser!==null ? <Outlet /> : <Navigate to='/sign-in' />;
};

export default PrivateRoute;
