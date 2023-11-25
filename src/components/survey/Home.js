import React from 'react'

import Dashboard from './Dashboard'
import LandingPage from './LandingPage'

import auth from '../../apis/survey/authService'


function Home() {
const isAuthenticated = auth.isAuthenticated();
  return (
       isAuthenticated
        ? (
            <Dashboard />
        ) : (
          <>Login pls</> 
        )  
  );
}

export default Home
