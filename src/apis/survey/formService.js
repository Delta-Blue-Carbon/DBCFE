import axios from 'axios';
import { apiClient } from '../utilities/apiClient';
const API_URL = "http://localhost:5000/api/form/";


export default {
    getForms(userId){
        return apiClient
        .get( "/api/surveys/")
        .then(response =>{
            return response.data;
        })
    },

    createForm(data){
        console.log(data);
        return apiClient
        .post("/api/surveys/", data)
        .then(response =>{
            console.log(response.data); 
            return response.data;
        })
    },
    createFormInstance(data){
        console.log(data);
        return apiClient
        .post("/api/surveyInstances/", data)
        .then(response =>{
            console.log(response.data); 
            return response.data;
        })
    },
    createFormResponses(data, formId){
        console.log(data);
        return apiClient
        .post("/api/responses/survey/"+formId, data)
        .then(response =>{
            console.log(response.data); 
            return response.data;
        })
    },
    getFormResponses(formId){
        return apiClient
        .get("/api/responses/survey/"+formId)
        .then(response =>{
            console.log(response.data); 
            return response.data;
        })
    },

    getForm(formId){
        return apiClient
        .get("/api/surveys/"+formId)
        .then(response =>{
          //  console.log(response.data);
            return response.data;   
        })
    },
    getFormQuestions(formId){
        return apiClient
        .get("/api/questions/survey/"+formId)
        .then(response =>{
          //  console.log(response.data);
            return response.data;   
        })
    },
    deleteForm(formId){
        return apiClient
        .delete("/api/surveys/"+formId)
        .then(response =>{
          //  console.log(response.data);
            return response.data;   
        })
    },

    autoSave(data,formId){
        return apiClient
        .put("/api/questions/many/"+formId, data)
        .then(response =>{
              console.log(response.data);
              return response.data;   
          })
    },
    deleteQuestion(formId){
        return apiClient
        .delete("/api/questions/"+formId)
        .then(response =>{
              console.log(response.data);
              return response.data;   
          })
    },

    submitResponse(data){
        console.log(data);
        return axios
        .post(API_URL + "addresponse", data)
        .then(response =>{
            console.log(response.data); 
            return response.data;
        })
    },

    getResponse(formId){
      //  console.log(formId);
        return axios
        .get(API_URL + "getresponse/" + formId)
        .then(response =>{
           // console.log(response.data); 
            return response.data;
        })
        
    }

    
    
  };

