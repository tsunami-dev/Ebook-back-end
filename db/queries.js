const db = require('./index');

// Insert a new order
const insertOrder = async (email, sessionId, amount) => {
    return db.none('INSERT INTO orders (email, session_id, amount) VALUES ($1, $2, $3)', [email, sessionId, amount]);
};

// Get order by session ID
const getOrderBySessionId = async (sessionId) => {
    return db.oneOrNone('SELECT * FROM orders WHERE session_id = $1', [sessionId]);
};

module.exports = { insertOrder, getOrderBySessionId };
