"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = require("node-fetch");
const fs = require("fs");
const BitPaySDK = require("../index");
const readline = require("readline");
const privateKeyPath = __dirname + '/../secure/private_key';
const ConfFilePath = __dirname + '/../secure/BitPay.config.json';
const keyUtils = new BitPaySDK.KeyUtils();
let keyPair;
let ecKey;
let environment;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let storeFile = true;
let apiUrl;
let merchantToken;
let merchantPairCode;
let payoutToken;
let payoutPairCode;
let keyPath = '';
let keyPlain = '';
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
const main = function () {
    selectEnv();
};
const selectEnv = async () => {
    try {
        console.log('Select target environment:');
        rl.question('Press T for testing or P for production: \n', async (answer) => {
            switch (answer.toLowerCase()) {
                case 't':
                    environment = 'Test';
                    await setEnv(environment);
                    selectCreateKey();
                    break;
                case 'p':
                    environment = 'Prod';
                    await setEnv(environment);
                    selectCreateKey();
                    break;
                default:
                    selectEnv();
            }
        });
    }
    catch (e) {
        console.log(e);
    }
};
const setEnv = async (env) => {
    if (env == 'Test') {
        apiUrl = 'https://test.bitpay.com';
        return;
    }
    apiUrl = 'https://bitpay.com';
};
const selectCreateKey = async () => {
    try {
        console.log('Enter your private key or its location');
        rl.question('Or press Enter to generate a brand new key: ', async (answer) => {
            switch (answer.toLowerCase()) {
                case '':
                    await createNewKey();
                    break;
                default:
                    await loadKey(answer);
                    break;
            }
        });
    }
    catch (e) {
        console.log(e);
    }
};
const createNewKey = async () => {
    try {
        console.log('Generating private key... \n');
        keyPair = keyUtils.generate_keypair();
        ecKey = keyUtils.load_keypair(keyPair);
        await sleep(2000);
        console.log('Generated Private Key: ' + ecKey.getPrivate('hex'));
        console.log('With Public Key: ' + ecKey.getPublic('hex') + '\n');
        await storeKey();
    }
    catch (e) {
        console.log(e);
    }
};
const loadKey = async (privateKey) => {
    try {
        if (fs.existsSync(privateKey)) {
            console.log('Loading private key... \n');
            await sleep(2000);
            ecKey = keyUtils.load_keypair(fs.readFileSync(privateKey).toString().trim());
            console.log('Loaded Private Key: ' + ecKey.getPrivate('hex'));
            console.log('With Public Key: ' + keyUtils.getPublicKeyFromPrivateKey(ecKey));
            console.log('From: ' + privateKey);
            console.log('\n');
            selectTokens();
        }
        else {
            ecKey = keyUtils.load_keypair(privateKey);
            console.log('Loading private key... \n');
            await sleep(2000);
            console.log('Loaded Private Key: ' + ecKey.getPrivate('hex'));
            console.log('With Public Key: ' + keyUtils.getPublicKeyFromPrivateKey(ecKey));
            console.log('From: ' + privateKey);
            console.log('\n');
            selectTokens();
        }
    }
    catch (e) {
        console.log(e);
    }
};
const storeKey = async () => {
    try {
        if (!fs.existsSync(__dirname + '/../secure')) {
            fs.mkdirSync(__dirname + '/../secure');
        }
        console.log('Select the way you want to store your private key:');
        rl.question('Press F for storing in a text file or T for plain text in your config file: ', async (answer) => {
            switch (answer.toLowerCase()) {
                case 'f':
                    storeFile = true;
                    keyPath = privateKeyPath + '_' + environment.toLowerCase() + '.key';
                    console.log('Saving private key... \n');
                    sleep(500);
                    fs.writeFile(privateKeyPath + '_' + environment.toLowerCase() + '.key', ecKey.getPrivate('hex'), { mode: 0o755 }, function (err) {
                        if (err)
                            throw err;
                        console.log('Private key saved in file: ' + keyPath + '\n');
                    });
                    await sleep(1000);
                    selectTokens();
                    break;
                case 't':
                    storeFile = false;
                    keyPlain = ecKey.getPrivate('hex');
                    console.log('Saving private key... \n');
                    await sleep(1000);
                    selectTokens();
                    break;
                default:
                    storeKey();
            }
        });
    }
    catch (e) {
        console.log(e);
    }
};
const selectTokens = async () => {
    try {
        console.log('Select the tokens that you would like to request:');
        rl.question('Press M for merchant, P for payout, or B for both: \n', async (answer) => {
            switch (answer.toLowerCase()) {
                case 'm':
                case 'p':
                case 'b':
                    console.log('Requesting tokens... \n');
                    await sleep(500);
                    await requestTokens(answer);
                    break;
                default:
                    selectTokens();
            }
        });
    }
    catch (e) {
        console.log(e);
    }
};
const requestTokens = async (option) => {
    async function requestMerchantToken(options) {
        console.log('Requesting Merchant token... \n');
        options.body['facade'] = 'merchant';
        let result = await (0, node_fetch_1.default)(apiUrl + '/tokens', {
            method: options.method,
            headers: options.headers,
            body: JSON.stringify(options.body)
        })
            .then((response) => {
            return response.json();
        })
            .catch((e) => {
            console.log(e.message);
        });
        result = result.data[0];
        merchantToken = result.token;
        merchantPairCode = result.pairingCode;
        await sleep(2000);
    }
    async function requestPayoutToken(options) {
        console.log('Requesting Payout token... \n');
        options.body['facade'] = 'payout';
        let result = await (0, node_fetch_1.default)(options.url, {
            method: options.method,
            headers: options.headers,
            body: JSON.stringify(options.body)
        })
            .then((response) => {
            return response.json();
        })
            .catch((e) => {
            console.log(e.message);
        });
        result = result.data[0];
        payoutToken = result.token;
        payoutPairCode = result.pairingCode;
        await sleep(2000);
    }
    try {
        let reqMerchant = false;
        let reqPayout = false;
        switch (option.toLowerCase()) {
            case 'm':
                reqMerchant = true;
                reqPayout = false;
                break;
            case 'p':
                reqMerchant = false;
                reqPayout = true;
                break;
            case 'b':
                reqMerchant = true;
                reqPayout = true;
                break;
        }
        const headers = {
            'x-accept-version': '2.0.0',
            'Content-type': 'application/json'
        };
        const options = {
            url: apiUrl + '/tokens',
            method: 'POST',
            body: { id: keyUtils.get_sin_from_key(ecKey) },
            headers: headers
        };
        if (reqMerchant) {
            await requestMerchantToken(options);
        }
        if (reqPayout) {
            await requestPayoutToken(options);
        }
        await updateConfigFile();
    }
    catch (e) {
        console.log(e);
    }
};
const updateConfigFile = async () => {
    const configurationObject = {
        BitPayConfiguration: {
            Environment: environment,
            EnvConfig: {
                [environment]: {
                    PrivateKeyPath: keyPath,
                    PrivateKey: keyPlain,
                    ApiTokens: {
                        merchant: merchantToken,
                        payout: payoutToken
                    }
                }
            }
        }
    };
    fs.writeFile(ConfFilePath, JSON.stringify(configurationObject, null, 4), function (err) {
        if (err)
            throw err;
        console.log('Generated configuration file');
        console.log('And saved in file: ' + ConfFilePath + '\n');
    });
    await sleep(5000);
    console.log('Configuration generated successfully! \n');
    console.log('To complete your setup, Go to ' +
        apiUrl +
        '/dashboard/merchant/api-tokens and pair this client with your merchant account using the pairing codes:');
    if (merchantToken) {
        console.log(merchantPairCode + ' for the Merchant facade.');
    }
    if (payoutToken) {
        console.log(payoutPairCode + ' for the Payout facade ONLY if you have requested access for this role.');
    }
    process.exit();
};
function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}
main();
//# sourceMappingURL=BitPaySetup.js.map