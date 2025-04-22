import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PaymentForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        cardholderName: ''
    });
    const [storedCards, setStoredCards] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Format card number as user types
    const handleCardNumberChange = (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 16) value = value.slice(0, 16);
        value = value.replace(/(\d{4})/g, '$1 ').trim();
        setFormData(prev => ({
            ...prev,
            cardNumber: value
        }));
    };

    // Format expiry date as user types
    const handleExpiryDateChange = (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 4) value = value.slice(0, 4);
        if (value.length > 2) {
            value = value.slice(0, 2) + '/' + value.slice(2);
        }
        setFormData(prev => ({
            ...prev,
            expiryDate: value
        }));
    };

    // Store new card
    const handleStoreCard = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            await axios.post('/api/payments/card', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Card stored successfully!');
            fetchStoredCards();
            setFormData({
                cardNumber: '',
                expiryDate: '',
                cvv: '',
                cardholderName: ''
            });
        } catch (err) {
            setError(err.response?.data?.message || 'Error storing card');
        } finally {
            setLoading(false);
        }
    };

    // Fetch stored cards
    const fetchStoredCards = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/api/payments/cards', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStoredCards(response.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Error fetching cards');
        }
    };

    // Process payment
    const handlePayment = async (cardId, amount) => {
        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('/api/payments/process', {
                paymentId: cardId,
                amount
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Payment processed successfully!');
            navigate('/order-confirmation');
        } catch (err) {
            setError(err.response?.data?.message || 'Error processing payment');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6">Payment Information</h2>
            
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <form onSubmit={handleStoreCard} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Card Number</label>
                    <input
                        type="text"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleCardNumberChange}
                        placeholder="1234 5678 9012 3456"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
                        <input
                            type="text"
                            name="expiryDate"
                            value={formData.expiryDate}
                            onChange={handleExpiryDateChange}
                            placeholder="MM/YY"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">CVV</label>
                        <input
                            type="text"
                            name="cvv"
                            value={formData.cvv}
                            onChange={handleChange}
                            maxLength="4"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Cardholder Name</label>
                    <input
                        type="text"
                        name="cardholderName"
                        value={formData.cardholderName}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                >
                    {loading ? 'Processing...' : 'Save Card'}
                </button>
            </form>

            <div className="mt-8">
                <h3 className="text-lg font-medium mb-4">Saved Cards</h3>
                {storedCards.length > 0 ? (
                    <div className="space-y-4">
                        {storedCards.map((card) => (
                            <div key={card._id} className="border p-4 rounded-md">
                                <p>Card ending in: {card.lastFourDigits}</p>
                                <p>Name: {card.cardholderName}</p>
                                <button
                                    onClick={() => handlePayment(card._id, 100.00)}
                                    className="mt-2 bg-green-600 text-white py-1 px-3 rounded-md hover:bg-green-700"
                                >
                                    Pay $100.00
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No saved cards</p>
                )}
            </div>
        </div>
    );
};

export default PaymentForm; 