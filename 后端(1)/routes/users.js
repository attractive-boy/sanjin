const express = require('express');
const forge = require('node-forge');
const crypto = require('crypto');

const router = express.Router();

// RSA 加密函数
function rsaEncrypt(plainText, publicKeyPem) {
    try {
        const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);
        const encrypted = publicKey.encrypt(plainText, 'RSAES-PKCS1-v1_5');
        return forge.util.encode64(encrypted);
    } catch (error) {
        console.error("加密错误:", error);
        throw error;
    }
}

// SHA1WithRSA 签名函数
function signWithRSA(privateKeyPem, data) {
    const sign = crypto.createSign('RSA-SHA1'); // 使用 SHA1WithRSA
    sign.update(data);
    return sign.sign(privateKeyPem, 'base64');
}

// AES 加密函数
function generateRandomKey() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let key = '';
    for (let i = 0; i < 16; i++) {
        key += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return key;
}

function aesEncrypt(data) {
    const key = generateRandomKey(); // 生成随机的 16 位密钥
    const cipher = crypto.createCipheriv('aes-128-ecb', Buffer.from(key), null); // 使用 ECB 模式
    let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return { encryptedData: encrypted, aesKey: key }; // 返回加密数据和密钥
}

router.post('/nikanwo', function(req, res, next) {
    const publicKeyPem = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAuLIFe0Hcq4ypQWhFd7iC9Ki1SlN4MxHIsaALnPi4OlKfpnGsMV9oOp7wvtbTnnLK2MreCi/fGEbfKcOprUFJgOYAj/AlZktynxf1XV2HOws+S3t+kBPbM4VZ3ALQLSoOPT/JP9uWqpyHiKCsAwFOYOaMRJmuBlcs/lhFxN3Oz/euCL9TtJeAloI8jesCQXFjWwKw/ha5OLK8jyoLT3dzvbRTm0yA/7vj3Jal1i7roQ3BtEzYO+E03PAklTmQTq2nkFZD7ZmVHjmW+vYCXYMPf6xa0UfUgtclCu0amdYnl+EGKaAgpnry6j5rpVVDInSRRkX1SNY/c88CF+cWbryCswIDAQAB
-----END PUBLIC KEY-----`;
const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);

if (publicKey.n.bitLength() !== 2048) {
    throw new Error("密钥长度必须为 2048 位");
}
    const privateKeyPem = `-----BEGIN PRIVATE KEY-----
MIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQCNysa07BwZgUGkP6qpevp7ISkAyWTx9Me0Er6xP7Rj8z1379VAk6Y8witu+lSWefvZM+D/BStYqwGDayqKVMBeqhihWyAE8V9WRm1rHzyGEb/WLagDlNPtI/dAJuPGHhiyaMbhGzLyUbo3Zwn5Zvz28bjOq391Wb7u8yMyBr7odRhdH7jQo40CXSyeE5vks2qJ+bv6w7hEm4XH4OtBZaeM0fONLBj6++xesvSMEi/tdlS3yd84bDSUJfQujC1kj8yVXxDpPgLyVGt2/nE+27fw+n/5drq9ehYhoAy7D1l1x0mbrghLv2O8T11a5RUe6nufmcE04fsn9PaDXCm3lKQvAgMBAAECggEBAIhjxT/C3kSqULntg/wCj25hN0/KaY9UJcTRQxy8aoi6MSZtTHQRkpZfL+hQY41bSSZlAMhN8KQZ2hrPutvVKjXk6ExNmz8l7s7Ob/Ha2h0cdatPv42yWyiAsBTFU9P+n0L+BlACGb99XeJs+ussZagkW+BwluoKqd6vgetdEcYHYT0wG8msuKLup3Tlm7LPWK6pq489pVGp2ZW3JTrcmzaGrf1S7JMEfy2Hi4hiizqXfkAwHD3Qn7TM/VGeahfkY3bseOiI5DdqmTG0Zg+FZtEAJ4eSOHQ29ByTfITqlgFh/UUjNgPRmxhbXWRqqIiVPvvO66f0g7cnA03OcJ2GQAECgYEA+C6PewVNi50tp4wZz7qiUhvjcFMUGMQ7WoUPA8bKE2ro9UxSs9EGEKDx3qnuYieDVvljfZsykcdJiBE4+QSzt3anwBFl88oHT+/SYLf275tBDyteW0Iw9UI6/VLPdUVyu2F/CAMAb3Gvrt0WBKGjRu2gKCdBQrqH/EYnGevq0YECgYEAkkI+yq87fIYIfisiA671wmlmPN6d/xT52m8x08iR32ziFmhZnWhlinMi1eI2b9Th3fChyFjzFWS4WlExLOBzXL21j+nFCOsqNrPRyITl3IQWg78L5dKtziVGz1+DnZPnZ1fwpSlEaqKCGEVg0Jss7OTbzyYwAc0nm2vqvLWb7a8CgYEAo5YdIRunt4UNGMkyIkiEwdZ8HgfE0WZXMR1Pfk/D1vS7RSTfxoLamo9bnkcoSC5/Vg7gU2S++nP/td6UTR+aTi25+NH+/6iFFV2gr/vSmrEdOyB8+24v0xmqxFuXP1ddfsGO9/ryiILJKFu2LatVcmUjEhR94bwN8m1TTLTCfQECgYBbM+n58+mRTfdPzc/JIjnoAFebj2pQnSDsoDgfC0xDWZ9mP63aJTZkbkWDwCsX81ThU+NejnEOnx8CWuziQhhN9ZKZajnOxO4u7FTdyFmZ99geUWy25HgzOzV7rODiy08aN1E9fI1IPYwIXILxskICevfCpdp71RVkqpfXExxnywKBgQCRzt2gnqreOE1tFwiX6U2ObyvMJYPsf6vyYRk6dRRpA37+4Nj5lQppARZi7glUA4b4vwvhdGq+Rlg+6MwAPz6hnY/TxhsA/Y2Zo+tarjY6tsfGWR8Sj0u07wxwnUF1ys+sBbyb+l+KUVq3SWOkYJzzWkfVoEHNS3UMVRYbu/gBWA==
-----END PRIVATE KEY-----`;

    const aesKey = crypto.randomBytes(16).toString('base64'); // 生成 16 位 AES 密钥

    const dataToEncrypt = {
        merchantNo: "MI76786643366584320",
        totalCount: 1,
        totalAmt: 0.1,
        batchNo: 1,
        payItems: {
            orderNumber: 1,
            payAmount: 0.1,
            payeeName: '张三',
            payeeAcc: '6215340302513709962',
            idCard: '511922333322222344',
            mobile: '15932423534',
            memo: '测试',
            payType: '0',
            paymentType: '0',
            accType: '1'
        }
    };

    try {
        const aesEncryptedData = aesEncrypt(dataToEncrypt, Buffer.from(aesKey, 'base64'));
        const rsaEncryptedKey = rsaEncrypt(aesKey, publicKeyPem);

        // 签名数据
        const signature = signWithRSA(privateKeyPem, JSON.stringify(dataToEncrypt));

        res.json({
            encryptData: aesEncryptedData,
            encryptKey: rsaEncryptedKey,
            sign: signature
        });
    } catch (error) {
        console.error("处理过程中发生错误:", error);
        res.status(500).send('加密失败');
    }
});

module.exports = router;
