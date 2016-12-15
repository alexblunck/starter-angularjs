/**
 * server.js
 */

var express = require('express'),
        app = express(),
       port = 2999;

/**
 * Middleware
 */
app.use(express.static(__dirname + '/build'));

/**
 * Route all other requests to angular
 */
app.get('*', function (req, res) {
    res.sendFile(__dirname + '/build/index.html');
});

/**
 * Listen on specified port
 */
app.listen(port, function () {
    console.log('Server can be reached at http://localhost:' + port);
});
