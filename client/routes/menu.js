var express = require('express');
var router = express.Router();

router.get('/menu', function (req, res) {
    var menu = {
        menu: {
            items: [{'name': 'apples'}]
        }
    };
    res.set('Content-Type', 'application/json');
    res.status(200);
    res.send(menu);
});

module.exports = router; 
