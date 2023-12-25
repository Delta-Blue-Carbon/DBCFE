import { apiClient } from '../utilities/apiClient';
export const getAllInventories = async () => {
    try {
        const response = await apiClient.get('/api/inventories');
        if (response?.status === 200) {
            return { error: false, data: response?.data };
        } else {
            return { error: true, data: `Unexpected status code ${response?.status}` };
        }
    } catch (error) {
        if (error.response) {
            return { error: true, data: `Error: ${error.response?.data?.error}` };
        } else {
            return { error: true, data: `Error fetching items: ${error}` };
        }
    }
};

export const createInventory = async (itemData) => {
    try {
        const response = await apiClient.post('/api/inventories', itemData);
        if (response?.status === 201) {
            return { error: false, data: response?.data };
        } else {
            return { error: true, data: `Unexpected status code ${response?.status}` };
        }
    } catch (error) {
        console.log(error)
        if (error.response) {
            return { error: true, data: `Error: ${error.response?.data?.error}` };
        } else {
            return { error: true, data: `Error creating item: ${error}` };
        }
    }
};

export const updateInventory = async (itemId, itemData) => {
    try {
        const response = await apiClient.put(`/api/inventories/${itemId}`, itemData);
        if (response?.status === 200) {
            return { error: false, data: response?.data };
        } else {
            return { error: true, data: `Unexpected status code ${response?.status}` };
        }
    } catch (error) {
        if (error.response) {
            return { error: true, data: `Error: ${error.response?.data?.error}` };
        } else {
            return { error: true, data: `Error updating item: ${error}` };
        }
    }
};

export const getInventoryDetails = async (itemId) => {
    try {
        const response = await apiClient.get(`/api/inventories/${itemId}`);
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
            return { error: true, data: `Error getting item details: ${error}` };
        }
    }
};

export const deleteInventory = async (itemId) => {
    try {
        const response = await apiClient.delete(`/api/inventories/${itemId}`);
        if (response?.status === 204) {
            return { error: false, data: 'Item successfully deleted' };
        } else {
            return { error: true, data: `Unexpected status code ${response?.status}` };
        }
    } catch (error) {
        if (error.response) {
            return { error: true, data: `Error: ${error.response?.data?.error}` };
        } else {
            return { error: true, data: `Error deleting item: ${error}` };
        }
    }
};
