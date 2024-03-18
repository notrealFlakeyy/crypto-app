import { NextApiRequest, NextApiResponse } from 'next';
const { Pool } = require('pg');

const db = new Pool({
    host: 'cornelius.db.elephantsql.com',
    user: 'zkbbmxkl',
    password: 'zwtGSZDJkX73dAtuido_6ryQ6XZwmjai',
    database: 'zkbbmxkl',
    port: 5432
});

db.connect();

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        const {
            userId,
            cryptoId,
            name,
            symbol,
            unitsPurchased,
            purchasePriceUsd,
            currentPriceUsd,
            profitLossUsd,
        } = req.body;

        const purchaseTimestamp = new Date();

        const query = `
      INSERT INTO transactions (
        userId,
        cryptoId,
        name,
        symbol,
        unitsPurchased,
        purchasePriceUsd,
        purchaseTimestamp,
        currentPriceUsd,
        profitLossUsd
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `;

        const values = [
            userId,
            cryptoId,
            name,
            symbol,
            unitsPurchased,
            purchasePriceUsd,
            purchaseTimestamp,
            currentPriceUsd,
            profitLossUsd,
        ];

        try {
            await db.query(query, values);
            res.status(201).json({ message: 'Transaction saved successfully' });
        } catch (error) {
            console.error('Error saving transaction:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
};
