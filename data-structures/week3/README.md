# Week 3
The practice for this week focuses on API Request. <br />
API is provided by [Texas A&M GeoServices](http://geoservices.tamu.edu/Services/Geocode/WebService/). <br />
## Goal
The output from [week2](https://github.com/yiranni/data-structures/blob/master/data/m05meetingAddress.txt]) only includes addresses, state, and zipcode. 
<br />
In this practice, I will add more information such as latitude and longitude that corresponds to the address [here](https://github.com/yiranni/data-structures/blob/master/data/m05meetingAddress.txt]) through API request. Add write a new file(---) with array that contains all the information.<br />
I will use two files in order to limit API requests rate. 
- apiRequest is to request API information and save the output as a JSON file.
- writeFile is to combine information from two files and write all the information into a text file.
