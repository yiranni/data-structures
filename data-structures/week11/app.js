var express = require('express');
var app = express();
var path = require('path');
var moment = require('moment');
const dotenv = require('dotenv');
dotenv.config();



app.use(express.static('public'));


////////////////////////////////////////////////////////////////////////////////
// Landing Page

app.get('', function(req, res) {
    var output = "<head> " +
        `<link rel="stylesheet" type="text/css"   href="/style.css">` +
        `<link href="https://fonts.googleapis.com/css?family=Noto+Sans+JP:100,300,400,500,700,900&display=swap" rel="stylesheet">` +
        `  </head> \
                <body> \
                    <header> \
                        <span>D/S</span> \
                        <nav>
                        <ul> \
                          <li><a href="/">Home</a></li> \
                          <li><a href="/blog">Diary</a></li> \
                          <li><a href="/meeting">Meeting</a></li> \
                          <li><a href="/sensor">Sensor</a></li> \
                        </ul> \
                        </nav> \
                    </header> \
                </body> \
                  `;
    res.send(output);

});


app.listen(8080, function() {
    console.log('listen on 8080')
});
