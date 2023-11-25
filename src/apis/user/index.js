import { apiClient } from '../utilities/apiClient';

export const getAllUsers = async () => {
    try {
        const response = await apiClient.get('/api/users/');
        if (response?.status === 200) {
            return { error: false, data: response?.data };
        } else {
            return { error: true, data: `Unexpected status code ${response?.status}` };
        }
    } catch (error) {
        if (error.response) {
            return { error: true, data: `Error: ${error.response?.data?.error}` };
        } else {
            return { error: true, data: `Error logging in: ${error}` };
        }
    }
};
export const createUser = async (userData) => {
    try {
        const response = await apiClient.post('/api/users', userData);
        if (response?.status === 201) {
            return { error: false, data: response?.data };
        } else {
            return { error: true, data: `Unexpected status code ${response?.status}` };
        }
    } catch (error) {
        console.log(error)
        if (error.response) {
            if (error.response.data.errors) {
                return { error: true, data: `Error: ${error.response?.data?.errors[0].msg}` };
            } else {
                return { error: true, data: `Error: ${error.response?.data?.error}` };
            }
        } else {
            return { error: true, data: `Error logging in: ${error}` };
        }
    }
};
export const updateUser = async (applicationUserId, userData) => {
    // console.log("applicationUserId", applicationUserId)
    try {
        const response = await apiClient.put(`/api/users/${applicationUserId}`, userData);
        if (response?.status === 202) {
            return { error: false, data: response?.data };
        } else {
            return { error: true, data: `Unexpected status code ${response?.status}` };
        }
    }
    catch (error) {
        if (error.response) {
            if (error.response.data.errors) {
                return { error: true, data: `Error: ${error.response?.data?.errors[0].msg}` };
            } else {
                return { error: true, data: `Error: ${error.response?.data?.error}` };
            }
        } else {
            return { error: true, data: `Error logging in: ${error}` };
        }
    }
};
export const getUserDetails = async (applicationUserId) => {
    try {
        const response = await apiClient.get(`/api/users/${applicationUserId}`);
        if (response?.status === 200) {
            return { error: false, data: response?.data };
        } else {
            return { error: true, data: `Unexpected status code ${response?.status}` };
        }
    } catch (error) {
        console.log(error)
        if (error.response) {
            return { error: true, data: `Error: ${error.response?.data?.error}` };
        } else {
            return { error: true, data: `Error logging in: ${error}` };
        }
    }
};
export const getUserPermissions = async () => {
    try {
        const response = await apiClient.get('/api/users/Permissions');
        if (response?.status === 200) {
            return { error: false, data: response?.data };
        } else {
            return { error: true, data: `Unexpected status code ${response?.status}` };
        }
    } catch (error) {
        if (error.response) {
            return { error: true, data: `Error: ${error.response?.data?.error}` };
        } else {
            return { error: true, data: `Error logging in: ${error}` };
        }
    }
};

export const deleteUser = async (applicationUserId) => {
    try {
        const response = await apiClient.delete(`/api/users/${applicationUserId}`);
        if (response?.status === 200) {
            return { error: false, data: response?.data };
        } else {
            return { error: true, data: `Unexpected status code ${response?.status}` };
        }
    } catch (error) {
        if (error.response) {
            return { error: true, data: `Error: ${error.response?.data?.error}` };
        } else {
            return { error: true, data: `Error logging in: ${error}` };
        }
    }
};