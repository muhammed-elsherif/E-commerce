const express = require('express');
const router = express.Router();
const { encrypt, decrypt } = require('../cryptoUtils');
const { verifyToken } = require('../middleware/auth');
const { sendResponse, sendError } = require('../utils/response');
const Payment = require('../db/Payment');

const paymentSecurity = (req, res, next) => {
    if (req.body.cardNumber) {
        const cardNumber = req.body.cardNumber.replace(/\D/g, '');
        if (!/^\d{13,19}$/.test(cardNumber)) {
            return sendError(res, 'Invalid card number format', 400);
        }
    }

    if (req.body.expiryDate) {
        if (!/^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(req.body.expiryDate)) {
            return sendError(res, 'Invalid expiry date format', 400);
        }
    }

    if (req.body.cvv) {
        if (!/^\d{3,4}$/.test(req.body.cvv)) {
            return sendError(res, 'Invalid CVV format', 400);
        }
    }

    next();
};

// Store encrypted card information
router.post("/card", verifyToken, paymentSecurity, async (req, res) => {
    try {
        const { cardNumber, expiryDate, cvv, cardholderName } = req.body;

        // Check for duplicate cards
        const existingCard = await Payment.findOne({
            userId: req.user._id,
            lastFourDigits: cardNumber.slice(-4)
        });

        if (existingCard) {
            return sendError(res, 'This card is already saved', 400);
        }

        const encryptedCardData = {
            cardNumber: encrypt(cardNumber),
            expiryDate: encrypt(expiryDate),
            cvv: encrypt(cvv),
            cardholderName: encrypt(cardholderName),
            userId: req.user._id,
            lastFourDigits: cardNumber.slice(-4)
        };

        // Create new payment record
        const payment = new Payment(encryptedCardData);
        await payment.save();

        sendResponse(res, {
            message: 'Card information stored securely',
            lastFourDigits: encryptedCardData.lastFourDigits
        }, 201);
    } catch (error) {
        console.error('Payment error:', error);
        sendError(res, 'Error processing payment information');
    }
});

router.get("/cards", verifyToken, async (req, res) => {
    try {
        const cards = await Payment.find({ userId: req.user._id })
            .select('lastFourDigits cardholderName createdAt')
            .sort({ createdAt: -1 });

        // Decrypt only the cardholder name
        const decryptedCards = cards.map(card => ({
            ...card.toJSON(),
            cardholderName: decrypt(card.cardholderName)
        }));

        sendResponse(res, decryptedCards);
    } catch (error) {
        console.error('Error fetching cards:', error);
        sendError(res, 'Error fetching card information');
    }
});

router.post("/process", verifyToken, async (req, res) => {
    try {
        const { paymentId, amount } = req.body;

        // Validate amount
        if (!amount || isNaN(amount) || amount <= 0) {
            return sendError(res, 'Invalid amount', 400);
        }

        // Find the payment record
        const payment = await Payment.findOne({
            _id: paymentId,
            userId: req.user._id
        });

        if (!payment) {
            return sendError(res, 'Payment method not found', 404);
        }

        const decryptedCardData = {
            cardNumber: decrypt(payment.cardNumber),
            expiryDate: decrypt(payment.expiryDate),
            cvv: decrypt(payment.cvv),
            cardholderName: decrypt(payment.cardholderName)
        };

        const paymentResult = {
            success: true,
            amount,
            lastFourDigits: payment.lastFourDigits,
            transactionId: `txn_${Date.now()}`
        };

        sendResponse(res, paymentResult);
    } catch (error) {
        console.error('Payment processing error:', error);
        sendError(res, 'Error processing payment');
    }
});

module.exports = router; 