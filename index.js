const express = require('express');
const app = express();
const port = 3000;

// Middleware to parse JSON request body
app.use(express.json());

// Store port forwarding information in memory
let forwardingInfo = null; // Store the forwarding address here

// API to receive port forwarding information and store it on the server
app.post('/api/forwarding', (req, res, next) => {
    try {
        const { forwardingAddress } = req.body;
        
        if (forwardingAddress) {
            forwardingInfo = forwardingAddress;  // Store the forwarding address in memory
            return res.status(200).json({
                message: 'Forwarding information has been successfully stored.',
                forwardingAddress: forwardingInfo
            });
        } else {
            throw new Error('No forwardingAddress in the request.');
        }
    } catch (error) {
        next(error);  // Pass the error to the error-handling middleware
    }
});

// API to return the stored port forwarding information
app.get('/api/forwarding', (req, res, next) => {
    try {
        if (forwardingInfo) {
            return res.status(200).json({
                forwardingAddress: forwardingInfo
            });
        } else {
            throw new Error('No forwarding information has been stored.');
        }
    } catch (error) {
        next(error);  // Pass the error to the error-handling middleware
    }
});

// Error-handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);  // Log the error stack trace to the console
    
    // Return an error response to the client
    res.status(500).json({
        message: 'An error occurred on the server!',
        error: err.message || 'Unknown error'
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception: ', err);
    process.exit(1);  // Terminate the server if there's a serious error
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection: ', reason);
    process.exit(1);  // Terminate the server if there's an unhandled rejection
});
