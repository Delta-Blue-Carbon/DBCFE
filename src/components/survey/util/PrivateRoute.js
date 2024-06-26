import React from 'react'
import {
  Route,
  Redirect,
  
} from 'react-router-dom'

import auth from '../../../apis/survey/authService'

const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={(props) => (
      auth.isAuthenticated()
        ? <Component {...props} />
        : <Redirect to={{
            pathname: '/login',
            state: { from: props.location }
          }} />
    )} />
  )

export default PrivateRoute;
