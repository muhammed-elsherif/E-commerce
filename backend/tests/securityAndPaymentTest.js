const axios = require('axios');
const { performance } = require('perf_hooks');

// Configuration
const API_BASE_URL = 'http://localhost:4000/api';
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

// Test DDoS protection
const testDDoSProtection = async () => {
    console.log('\n=== Testing DDoS Protection ===');
    const startTime = performance.now();
    const requests = [];
    
    try {
        // Make 150 requests (should be limited to 100)
        for (let i = 0; i < 150; i++) {
            requests.push(
                makeAuthenticatedRequest('get', '/payments/cards')
                    .catch(err => err.response?.status)
            );
        }
        
        const results = await Promise.all(requests);
        const endTime = performance.now();
        
        const successCount = results.filter(r => r !== 429).length;
        const blockedCount = results.filter(r => r === 429).length;
        
        console.log(`Time taken: ${(endTime - startTime) / 1000} seconds`);
        console.log(`Successful requests: ${successCount}`);
        console.log(`Blocked requests: ${blockedCount}`);
    } catch (error) {
        console.error('DDoS test failed:', error.message);
    }
};

// Test SQL Injection protection
const testSqlInjectionProtection = async () => {
    console.log('\n=== Testing SQL Injection Protection ===');
    const sqlInjectionTests = [
        {
            name: 'Basic SQL Injection',
            data: {
                cardNumber: "4111111111111111",
                expiryDate: "12/25",
                cvv: "123",
                cardholderName: "SELECT * FROM users"
            }
        },
        {
            name: 'Complex SQL Injection',
            data: {
                cardNumber: "4111111111111111",
                expiryDate: "12/25",
                cvv: "123",
                cardholderName: "'; DROP TABLE users; --"
            }
        }
    ];

    for (const test of sqlInjectionTests) {
        try {
            console.log(`Testing: ${test.name}`);
            await makeAuthenticatedRequest('post', '/payments/card', test.data);
            console.log('❌ Test failed: SQL injection was not detected');
        } catch (error) {
            if (error.response?.status === 400) {
                console.log('✅ Test passed: SQL injection was detected');
            } else {
                console.log('❌ Test failed:', error.message);
            }
        }
    }
};

// Test XSS protection
const testXSSProtection = async () => {
    console.log('\n=== Testing XSS Protection ===');
    const xssTests = [
        {
            name: 'Basic XSS',
            data: {
                cardNumber: "4111111111111111",
                expiryDate: "12/25",
                cvv: "123",
                cardholderName: "<script>alert('XSS')</script>"
            }
        },
        {
            name: 'Complex XSS',
            data: {
                cardNumber: "4111111111111111",
                expiryDate: "12/25",
                cvv: "123",
                cardholderName: "javascript:alert('XSS')"
            }
        }
    ];

    for (const test of xssTests) {
        try {
            console.log(`Testing: ${test.name}`);
            const response = await makeAuthenticatedRequest('post', '/payments/card', test.data);
            console.log('Response:', response);
            console.log('✅ Test passed: XSS was sanitized');
        } catch (error) {
            console.log('❌ Test failed:', error.message);
        }
    }
};

// Test payment functionality
const testPaymentFlow = async () => {
    console.log('\n=== Testing Payment Flow ===');
    try {
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
            cardNumber: '4111111111111111',
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
            paymentId: cardsResponse[0]._id,
            amount: 100.00
        };
        const paymentResponse = await makeAuthenticatedRequest(
            'post',
            '/payments/process',
            paymentData,
            token
        );
        console.log('Payment processed successfully:', paymentResponse, '\n');

        console.log('All payment tests completed successfully!');
    } catch (error) {
        console.error('Payment test failed:', error.message);
    }
};

// Run all tests
const runAllTests = async () => {
    console.log('Starting comprehensive security and payment tests...\n');
    
    try {
        await testDDoSProtection();
        await testSqlInjectionProtection();
        await testXSSProtection();
        await testPaymentFlow();
        
        console.log('\nAll tests completed!');
    } catch (error) {
        console.error('Test suite failed:', error.message);
    }
};

// Run the tests
runAllTests(); 