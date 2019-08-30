## Documentation
This assignment mainly focuses on the practice of making http calls with the use of `request`. <br/>
There are 10 websites about *meeting list agenda* at Parsons NYC, each includes data about location, location accessibility, time, etc. <br/> The goal is to save all the information as txt file into [data](https://github.com/yiranni/data-structures/tree/master/data)
In order to get all the information on each website, I will complete the following steps: <br/>
1. Create an array `URLs`, and add all the URLs into this array.
2. Create an array `fns`, which is the path to the folder that stores all the data.
3. Loop through each element in `URLs` using for loop, request from each url, and write data into the folder that stores data.