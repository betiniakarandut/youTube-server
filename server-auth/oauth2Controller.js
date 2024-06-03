import { clients } from "./clientData.js";
import { generateAuthorizationCode, generateAccessToken } from '../service/tokenService.js';

export const getAuthorize = (req, res) => {
  const { response_type, client_id, redirect_uri, scope, state } = req.query;

  const client = clients.find(client => client.clientId === client_id && client.redirectUris.includes(redirect_uri));

  if (!client) {
    return res.status(400).send({ error: 'Invalid client' });
  }

  res.send(`<form method="post" action="/auth/approve">
    <input type="hidden" name="client_id" value="${client_id}" />
    <input type="hidden" name="redirect_uri" value="${redirect_uri}" />
    <input type="hidden" name="state" value="${state}" />
    <button type="submit">Approve</button>
  </form>`);
};

export const postApprove = (req, res) => {
  const { client_id, redirect_uri, state } = req.body;

  const code = generateAuthorizationCode(client_id, redirect_uri);
  console.log('this is code ', code)

  const redirectUrl = `${redirect_uri}?code=${code}&state=${state}`;
  res.redirect(redirectUrl);
};

export const getToken = (req, res) => {
  const { grant_type, code, redirect_uri, client_id, client_secret } = req.body;

  if (grant_type !== 'authorization_code') {
    return res.status(400).send({ error: 'Unsupported grant type' });
  }

  const accessToken = generateAccessToken(code, client_id, client_secret);

  res.json({ access_token: accessToken, token_type: 'Bearer' });
};
