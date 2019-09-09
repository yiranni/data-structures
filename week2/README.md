# Extract addresses in m05.txt file and write it into m05MeetingAddress.txt
For this exercise, I will be analyzing data from [New York Intergroup Meeting List Agenda](https://parsons.nyc/aa/m05.html). <br />
The website contains a list of address/location in the form of a table. (See example below) <br />
I will be using `cheerio`, a jQuery implementation to load content in the text previously saved in `*****`. <br />

```
var fs = require('fs');
var cheerio = require('cheerio');
var content = fs.readFileSync('/home/ec2-user/environment/data-structures/data/m05.txt');
// load `content` into a cheerio object
var $ = cheerio.load(content);
```

```
$('td').each(function(i, elem) {
```