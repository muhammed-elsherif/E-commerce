const axios = require('axios');

// Configuration
const API_BASE_URL = 'http://localhost:3000/api';
const TEST_USER = {
    email: 'test@example.com',
    password: 'testpassword123'
};

// Helper function to make authenticated requests
const makeAuthenticatedRequest = async (method, endpoint, data = null, token = null) => {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    try {
        const response = await axios({
            method,
            url: `${API_BASE_URL}${endpoint}`,
            data,
            headers
        });
        return response.data;
    } catch (error) {
        console.error('Request failed:', error.response?.data || error.message);
        throw error;
    }
};

// Test scenarios
const testPaymentFlow = async () => {
    try {
        console.log('Starting payment test flow...\n');

        // 1. Login to get token
        console.log('1. Logging in...');
        const loginResponse = await makeAuthenticatedRequest('post', '/auth/login', {
            email: TEST_USER.email,
            password: TEST_USER.password
        });
        const token = loginResponse.accessToken;
        console.log('Login successful!\n');

        // 2. Store a new card
        console.log('2. Storing new card...');
        const cardData = {
            cardNumber: '4111111111111111', // Test card number
            expiryDate: '12/25',
            cvv: '123',
            cardholderName: 'Test User'
        };
        const storeCardResponse = await makeAuthenticatedRequest(
            'post',
            '/payments/card',
            cardData,
            token
        );
        console.log('Card stored successfully:', storeCardResponse, '\n');

        // 3. Get stored cards
        console.log('3. Retrieving stored cards...');
        const cardsResponse = await makeAuthenticatedRequest(
            'get',
            '/payments/cards',
            null,
            token
        );
        console.log('Stored cards:', cardsResponse, '\n');

        // 4. Process a payment
        console.log('4. Processing payment...');
        const paymentData = {
            paymentId: cardsResponse[0]._id, // Use the first stored card
            amount: 100.00
        };
        const paymentResponse = await makeAuthenticatedRequest(
            'post',
            '/payments/process',
            paymentData,
            token
        );
        console.log('Payment processed successfully:', paymentResponse, '\n');

        console.log('All tests completed successfully!');
    } catch (error) {
        console.error('Test failed:', error.message);
    }
};

// Run the test
testPaymentFlow(); 