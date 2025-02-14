const { insertOrder, getOrderBySessionId } = require('../db/queries');

// Save order after payment
const saveOrder = async (req, res) => {
    const { email, sessionId, amount } = req.body;
    try {
        await insertOrder(email, sessionId, amount);
        res.status(200).json({ message: 'Order saved successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error' });
    }
};

// Fetch order for invoice
const getOrder = async (req, res) => {
    const { sessionId } = req.params;
    try {
        const order = await getOrderBySessionId(sessionId);
        if (!order) return res.status(404).json({ error: 'Order not found' });
        res.json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error' });
    }
};

module.exports = { saveOrder, getOrder };
