import { Client } from 'bitpay-sdk';

let configFilePath = '/home/betini/Desktop/youTube-server/BitPay/bitpay-sdk/dist/secure/BitPay.config.json';

const bitpayClient = Client.createClientByConfig(
  configFilePath
);

console.log(bitpayClient);
export default bitpayClient