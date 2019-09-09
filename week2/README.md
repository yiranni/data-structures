# Extract addresses in m05.txt file and write it into m05MeetingAddress.txt
For this exercise, I will be analyzing data from [New York Intergroup Meeting List Agenda](https://parsons.nyc/aa/m05.html). <br />
The website contains a list of address/location in the form of a table. <br />
![alt text](https://github.com/yiranni/data-structures/blob/master/week2/data-screenshot.png)
## Data Parser
### `cheerio`- load file
I will be using `cheerio`, a jQuery implementation to load content in the text previously saved in [data/m05.txt](https://github.com/yiranni/data-structures/blob/master/data/m05.txt). <br />

```
var fs = require('fs');
var cheerio = require('cheerio');
var content = fs.readFileSync('/home/ec2-user/environment/data-structures/data/m05.txt');
// load `content` into a cheerio object
var $ = cheerio.load(content);
```
### Find Adresses
According to the html file, addresses are saved in `td` tag. Below is twp sets of sample data.
```
<td style="border-bottom:1px solid #e3e3e3; width:260px" valign="top">
    <h4 style="margin:0;padding:0;">Soldiers, Sailors, Marines & Airmen's Club</h4><br />
    <b>GRAND CENTRAL - Grand Central</b><br />
    283 Lexington Avenue, 2nd Floor, 
    <br />(Betw 36th & 37th Streets) NY 10016
    <br />
    <br />
                        
    <div class="detailsBox"> 
      T=Last Tuesday, Fri=Anniv. 2nd to Last Friday. <br />All meetings are non-smoking. 
    </div>


</td>
}
```
```
<td style="border-bottom:1px solid #e3e3e3; width:260px" valign="top">
  <h4 style="margin:0;padding:0;">St. Peter's Lutheran Church @ CitiCorp Center</h4><br />
  <b>LIFE LINE - Life Line</b><br />
  619 Lexington Avenue, Lower Level 2 in The Studio, 
  <br />(Enter on 54th Street, Betw. Lexington & 3rd Avenues) NY 10022
  <br />
  <br />

  <div class="detailsBox"> 
    All meetings are non-smoking. 
  </div>

  <span style="color:darkblue; font-size:10pt;">
  <img src="../images/wheelchair.jpg" alt="Wheelchair Access" width="20" vspace="5" hspace="10" align="absmiddle"/>Wheelchair access
  </span>
			  							
</td>
```
To extract the table, I will be using 
```
$('td').each(function(i, elem) {
    // remove spacings for address
    if($(elem).attr('style') === "border-bottom:1px solid #e3e3e3; width:260px") {
        m05meetingAddress += ($(elem).text()).trim() + '\n' + '\n';
    };
    // remove elements in 'span' tag ands ' .detailsBox' classes
    
    $('span').remove();
    $(' .detailsBox').remove();
});
```
### Filter out unrelated information
However, there are some other information is saved in a different tag, such as the sample below:
```
<td style="border-bottom:1px solid #e3e3e3;width:350px;" valign="top">                	 	
    <b>Mondays From</b>  5:30 PM <b>to</b> 6:30 PM <br /><b>Meeting Type</b> B = Beginners meeting <br />
    <br />

    <b>Tuesdays From</b>  5:30 PM <b>to</b> 6:30 PM <br /><b>Meeting Type</b> S = Step meeting <br />
    <br />

    <b>Fridays From</b>  5:30 PM <b>to</b> 6:30 PM <br /><b>Meeting Type</b> C = Closed Discussion meeting <br /><b>Special Interest</b> First Step Workshop
    <br />
    <br />

    <b>Wednesdays From</b>  5:30 PM <b>to</b> 6:30 PM <br /><b>Meeting Type</b> BB = Big Book meeting 
    <br />
    <br />

    <b>Thursdays From</b>  5:30 PM <b>to</b> 6:30 PM <br /><b>Meeting Type</b> OD = Open Discussion meeting 
    <br />
    <br />

</td> 
    <td style="border-bottom:1px solid #dedede; width:90px; ">
      <a href="getdirections.cfm?meetingid=168" class="GetDirections">Get Directions</a>
    </td>
```
In order to find the table that only contains address, I will be using 
```
if($(elem).attr('style') === "border-bottom:1px solid #e3e3e3; width:260px") {
   m05meetingAddress += ($(elem).text()).trim() + '\n' + '\n';
};
```
to filter the dataset and remove the extra spacings. <br />
To remove other unnessasary information in the selected table, such as 
```
<span> 
...
</span>
```
and 
```
 <div class="detailsBox"> 
  ...
 </div>
```
I will be doing 
```
$('span').remove();
$(' .detailsBox').remove();
```

### Formatting Output
In order to remove extra spacings in the output, I will be using
```
m05meetingAddress = m05meetingAddress.replace(/\t/g,'');
```

### Write Output Text file into selected folder
`fs.writeFileSync('/home/ec2-user/environment/data-structures/data/m05meetingAddress.txt', m05meetingAddress);`

