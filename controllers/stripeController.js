const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { insertOrder, getOrderBySessionId } = require('../db/queries');
const nodemailer = require('nodemailer');
const PDFDocument = require('pdfkit');
const fs = require('fs');
require('dotenv').config();

// Stripe checkout session
const createCheckoutSession = async (req, res) => {
    const { email } = req.body;

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            customer_email: email,
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: { name: 'Ebook: Learn to Code' },
                        unit_amount: 999,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: process.env.SUCCESS_URL,
            cancel_url: process.env.CANCEL_URL,
        });

        await insertOrder(email, session.id, 999);
        res.json({ url: session.url });
    } catch (error) {
        console.error(error);
        res.status(500).send('Something went wrong');
    }
};

// Stripe webhook to handle successful payments
const handleStripeWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];

    try {
        const event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);

        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;
            const email = session.customer_email;
            const sessionId = session.id;

            const order = await getOrderBySessionId(sessionId);
            if (order) {
                await sendInvoice(email, sessionId, order.amount);
            }
        }

        res.json({ received: true });
    } catch (err) {
        console.error('Webhook Error:', err.message);
        res.status(400).send(`Webhook Error: ${err.message}`);
    }
};

// Generate and send invoice
const sendInvoice = async (email, sessionId, amount) => {
    const invoicePath = `./invoices/${sessionId}.pdf`;
    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream(invoicePath));
    doc.text(`Invoice for Order`);
    doc.text(`Customer Email: ${email}`);
    doc.text(`Amount Paid: $${amount / 100}`);
    doc.end();

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your Ebook Purchase Invoice',
        text: 'Thank you for your purchase. Find your invoice attached.',
        attachments: [{ filename: 'invoice.pdf', path: invoicePath }],
    };

    await transporter.sendMail(mailOptions);
};

module.exports = { createCheckoutSession, handleStripeWebhook };
