const sendResponse = (res, data, status = 200) => {
    res.status(status).json(data);
};

const sendError = (res, message, status = 500) => {
    res.status(status).json({ error: message });
};

const sendNotFound = (res, message = "Resource not found") => {
    res.status(404).json({ error: message });
};

const sendUnauthorized = (res, message = "Not authorized") => {
    res.status(403).json({ error: message });
};

module.exports = {
    sendResponse,
    sendError,
    sendNotFound,
    sendUnauthorized
}; 