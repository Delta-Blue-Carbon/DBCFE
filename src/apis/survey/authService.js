
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import Cookies from 'universal-cookie';
// import jwt from 'jsonwebtoken';
import { apiClient } from '../utilities/apiClient';
const API_URL = "http://localhost:5000/api/user/";
//const API_URL = "http://192.168.225.23:5000/api/user/"

const cookies = new Cookies();

export default   {
 
    isAuthenticated() {
      const token = cookies.get('token');
        if (token) {
          return true
        } else {
          return false
        }
    },

    getGuestUser(){
        return {name: "Guest 123", userId: "guest123", email: "coolboy69@gg.com"}
    },

    authenticate(cb) {
      this.isAuthenticated = true;
      setTimeout(cb, 100); // fake async
    },

    signout(cb) {
      this.isAuthenticated = false;
      setTimeout(cb, 100);
    },


    loginWithGoogle(res) {
      var data = {
        name: res.profileObj.name,
        email : res.profileObj.email,
        image: res.profileObj.imageUrl
      }
      console.log(data)

      return axios
        .post("http://localhost:5000/api/user/login", data)
        .then(response => {
          console.log(response.data); 
          if (response.data.accessToken) {
            cookies.set('token', JSON.stringify(response.data.accessToken), { path: '/' });  
          }
          return response.data;
        });
    },

    loginAsGuest(){
      // var userData = {
      //   name: "Cool Guest", 
      //   id: "y2jsdqakq9rqyvtd4gf6g", 
      //   email: "coolboy69@gg.com"
      // }

      // const accessToken = jwt.sign(userData, "thisisaguesttokenwithsomeshittystring8", {expiresIn: '24h'});
      // localStorage.setItem("token", JSON.stringify(accessToken));   
      // return accessToken;   

    },

    logout() {
      cookies.remove('token');
    },

    getCurrentUser() {
      const tkn = cookies.get('token');
      console.log("getting current user: ",tkn );
      
       return jwtDecode(tkn);
     },
  };