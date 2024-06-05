import crypto from 'crypto';

const authorizationCodes = new Map(); 
const accessTokens = new Map(); 

export const generateAuthorizationCode = (clientId, redirectUri) => {
  const code = crypto.randomBytes(20).toString('hex');
  authorizationCodes.set(code, { clientId, redirectUri });
  return code;
};

export const generateAccessToken = (code, clientId, clientSecret) => {
  const authCode = authorizationCodes.get(code);
  if (!authCode || authCode.clientId !== clientId) {
    throw new Error('Invalid authorization code or client credentials');
  }
  
  const token = crypto.randomBytes(20).toString('hex');
  accessTokens.set(token, { clientId });
  authorizationCodes.delete(code);
  return token;
};
