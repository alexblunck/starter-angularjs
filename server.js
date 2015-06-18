/**
 * server.js
 */

var express = require('express'),
        app = express(),
       port = 8000;

/**
 * Middleware
 */
app.use(express.static(__dirname + '/dist'));

/**
 * Return 404 for accidental api requests
 */
 app.all('/api/*', function (req, res) {
     res.status(404).end();
 });

/**
 * Route all other requests to angular
 */
app.get('*', function (req, res) {
    res.sendFile(__dirname + '/dist/index.html');
});

/**
 * Listen on specified port
 */
app.listen(port, function () {
    console.log('Server can be reached at http://localhost:' + port);
});