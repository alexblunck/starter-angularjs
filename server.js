/**
 * server.js
 */

var express = require('express'),
        app = express(),
       port = 8090;

/**
 * Middleware
 */
app.use(express.static(__dirname + '/dist'));

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
