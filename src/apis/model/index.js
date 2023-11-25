import { apiClient } from '../utilities/apiClient';

export const getAllModels = async () => {
    try {
        const response = await apiClient.get('/api/Models');
        if (response?.status === 200) {
            return {error:false, data: response?.data}; 
        } else {
            return {error:true, data:`Unexpected status code ${response?.status}` }; 
        }
    } catch (error) {
        return {error:true, data: `Error logging in: ${error}`}; 
    }
};
export const createModel = async (userData) => {
    try {
        const response = await apiClient.post('/api/Models',userData);
        if (response?.status === 201) {
            return {error:false, data: response?.data}; 
        } else {
            return {error:true, data:`Unexpected status code ${response?.status}` }; 
        }
    }catch(error) {
        if (error.response) {
        return {error:true, data: `Error: ${error.response?.data}`}; 
        } else {
          return {error:true, data: `Error logging in: ${error}`}; 
        }
      }
};
export const updateModel = async (applicationUserId, userData) => {
    try {
        const response = await apiClient.put(`/api/Models/${applicationUserId}`,userData);  
        if (response?.status === 202) {
            return {error:false, data: response?.data}; 
        } else {
            return {error:true, data:`Unexpected status code ${response?.status}` }; 
        }
    } 
    catch(error) {
        if (error.response) {
        return {error:true, data: `Error: ${error.response?.data}`}; 
        } else {
          return {error:true, data: `Error logging in: ${error}`}; 
        }
      }
};
export const getModelDetails = async (applicationUserId) => {
    try {
        const response = await apiClient.get(`/api/Models/${applicationUserId}`);  
        if (response?.status === 200) {
            return {error:false, data: response?.data}; 
        } else {
            return {error:true, data:`Unexpected status code ${response?.status}` }; 
        }
    } catch (error) {
        return {error:true, data: `Error logging in: ${error}`}; 
    }
};
export const DeleteModel = async (makeId, status) => {
    try {
        const response = await apiClient.delete(`/api/Models/${makeId}`);
        if (response?.status === 202) {
            return {error:false, data: response?.data};
        } else {
            return {error:true, data:`Unexpected status code ${response?.status}`};
        }
    } 
    catch(error) {
        if (error.response) {
            return {error:true, data: `Error: ${error.response?.data}`};
        } else {
            return {error:true, data: `Error updating status: ${error}`};
        }
    }
};