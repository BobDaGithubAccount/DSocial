const express = require('express');
const requestIp = require('request-ip');
const app = express();
const port = 8000;
const { dirname } = require('path');
let appDir = dirname(require.main.filename);

app.get('/', (req, res) => {
    let file = appDir.concat('/index.html');
    let clientIp = requestIp.getClientIp(req);
    console.log("Serving " + file + " to " + clientIp)
    res.sendFile(file);
});
app.get('/index.html', (req, res) => {
    let file = appDir.concat('/index.html');
    let clientIp = requestIp.getClientIp(req);
    console.log("Serving " + file + " to " + clientIp)
    res.sendFile(file);
});
app.get('/src/d.png', (req, res) => {
    let file = appDir.concat('/src/d.png');
    let clientIp = requestIp.getClientIp(req);
    console.log("Serving " + file + " to " + clientIp)
    res.sendFile(file);
});
app.get('/src/client.js', (req, res) => {
    let file = appDir.concat('/src/client.js');
    let clientIp = requestIp.getClientIp(req);
    console.log("Serving " + file + " to " + clientIp)
    res.sendFile(file);
});
app.get('/src/ethers.js', (req, res) => {
    let file = appDir.concat('/src/ethers.js');
    let clientIp = requestIp.getClientIp(req);
    console.log("Serving " + file + " to " + clientIp)
    res.sendFile(file);
});

app.listen(port, () => {
    console.log(`DSocial web server listening on port ${port}`);
}); 