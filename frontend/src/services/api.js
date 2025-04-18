const API_BASE_URL = 'http://localhost:4000';

const getAuthHeader = () => {
    const token = JSON.parse(localStorage.getItem('token'));
    return token ? { Authorization: `Bearer ${token}` } : {};
};

// Products API
export const productsApi = {
    getAll: async () => {
        const response = await fetch(`${API_BASE_URL}/products`, {
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeader()
            }
        });
        const data = await response.json();
        if (data.error) throw new Error(data.error);
        return data;
    },

    getById: async (id) => {
        const response = await fetch(`${API_BASE_URL}/products/${id}`, {
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeader()
            }
        });
        const data = await response.json();
        if (data.error) throw new Error(data.error);
        return data;
    },

    search: async (key) => {
        const response = await fetch(`${API_BASE_URL}/products/search/${key}`, {
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeader()
            }
        });
        const data = await response.json();
        if (data.error) throw new Error(data.error);
        return data;
    },

    getCartProducts: async (ids) => {
        const response = await fetch(`${API_BASE_URL}/products/cart-products?ids=${ids.join(',')}`, {
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeader()
            }
        });
        const data = await response.json();
        if (data.error) throw new Error(data.error);
        return data;
    },

    add: async (productData) => {
        const response = await fetch(`${API_BASE_URL}/products`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeader()
            },
            body: JSON.stringify(productData)
        });
        const data = await response.json();
        if (data.error) throw new Error(data.error);
        return data;
    },

    update: async (id, productData) => {
        const response = await fetch(`${API_BASE_URL}/products/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeader()
            },
            body: JSON.stringify(productData)
        });
        const data = await response.json();
        if (data.error) throw new Error(data.error);
        return data;
    },

    delete: async (id) => {
        const response = await fetch(`${API_BASE_URL}/products/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeader()
            }
        });
        const data = await response.json();
        if (data.error) throw new Error(data.error);
        return data;
    }
};

// Orders API
export const ordersApi = {
    create: async (orderData) => {
        const response = await fetch(`${API_BASE_URL}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeader()
            },
            body: JSON.stringify(orderData)
        });
        const data = await response.json();
        if (data.error) throw new Error(data.error);
        return data;
    },

    getUserOrders: async () => {
        const response = await fetch(`${API_BASE_URL}/orders/user`, {
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeader()
            }
        });
        const data = await response.json();
        if (data.error) throw new Error(data.error);
        return data;
    },

    getById: async (id) => {
        const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeader()
            }
        });
        const data = await response.json();
        if (data.error) throw new Error(data.error);
        return data;
    },

    updateStatus: async (id, status) => {
        const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeader()
            },
            body: JSON.stringify({ status })
        });
        const data = await response.json();
        if (data.error) throw new Error(data.error);
        return data;
    }
}; 