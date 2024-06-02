import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const clients = [
    {clientId: 'client-id-1', clientSecret: 'client-secret-abc', redirectURIs: ['http://localhost:5000/callback']}
];

const authCodes = {};

export const getAuthorized = async (req, res) => {
    try {
        const { response_type, client_id, redirect_uri, scope, state } = req.body;
        const client = clients.find(client => client.clientId === client_id && client.redirectURIs.includes(redirect_uri))
        if(!client){
            res.status(400).json({Error: "Invalid client"});
        }
        res.send(`<form method="post" action="/approve">
            <input type="hidden" name="client_id" value="${client_id}">
            <input type="hidden" name="redirect_uri" value="${redirect_uri}">
            <input type="hidden" name="state" value="${state}" />
            <button type="submit">Approve <button>
        /form>`);
    } catch (error) {
        console.log(error);
        res.status(500).json({Error: "Internal server error"})
    }
}

export const isApproved = async (req, res) => {
    const { client_id, redirect_uri, state } = req.body;
    const code = Math.random().toString(36).substring(2, 15);
    authCodes[code] = { client_id, redirect_uri };
    res.redirect(`${redirect_uri}?code=${code} & state=${state}`);
};

export const codeTokenExchange = async (req, res) => {
    try {
        const { grant_type, code, redirect_uri, client_id, client_secret } = req.body;
        if (grant_type !== 'authorization_code'){
            return res.status(400).json({error: 'Unsupported grant type' });
        }

        const authCode = authCodes[code];
        if (!authCode || authCode.client_id !== client_id || !clients.find(client => client.clientId === client_id && client.clientSecret == client_secret)){
            res.status(400).json({error: 'Invalid code or client'})
        }
        delete authCodes[code];
        const token = jwt.sign(
            { client_id },
            process.env.SECRET_KEY,
            { expiresIn: '24h' }
        ); // code expires in 1 hour time
        res.status(200).json({
            access_token: token,
            token_type: 'Bearer',
            expires_in: 86400
        });
        
    } catch (error) {
        console.log(error);
        throw new Error("Internal server error")
    }
}