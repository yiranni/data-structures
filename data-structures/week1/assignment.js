var request = require('request');
var fs = require('fs');
const path = require('path');

var urls = [
    'https://parsons.nyc/aa/m01.html',
    'https://parsons.nyc/aa/m02.html', 
    'https://parsons.nyc/aa/m03.html',  
    'https://parsons.nyc/aa/m04.html',
    'https://parsons.nyc/aa/m05.html',  
    'https://parsons.nyc/aa/m06.html',  
    'https://parsons.nyc/aa/m07.html',  
    'https://parsons.nyc/aa/m08.html',  
    'https://parsons.nyc/aa/m09.html',  
    'https://parsons.nyc/aa/m10.html'
];

const filePath = '/home/ec2-user/environment/data-structures/data/';
const fns = ['m01.txt',
    'm02.txt',
    'm03.txt',
    'm04.txt',
    'm05.txt',
    'm06.txt',
    'm07.txt',
    'm08.txt',
    'm09.txt',
    'm10.txt'
    ];

for (var i = 0; i < 10; i++) {
    let url = urls[i];
    let writePath = filePath + fns[i];
    request(url, function(error, response, body){
        if (!error && response.statusCode == 200) {
            fs.writeFileSync(writePath, body, function (err) {
                if (err) {
                    throw err; 
                }
            }); 
            console.log(writePath + ' file created')
        } else {console.log("Request failed!")}
    });
}
                                                                                                                                                            