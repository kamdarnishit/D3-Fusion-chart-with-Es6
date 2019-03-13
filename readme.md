# Marfeel Senior Javascript Developer Test

Javascript test for Marfeel

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. 

### Prerequisites

Download Zip and copy extracted files to any server.

### Installing

Install npm

```
npm install
```

## Running files

Open ``` index.html ``` 

## Running the tests

I have included Jasmine for unit testing. To run jasmine specs

Open ``` SpecRunner.html ```

## Additional things

data is stored as json on ``` https://jsonstub.com ```

three api's called 

* http://jsonstub.com/api/marfeel/statistics/revenue
* http://jsonstub.com/api/marfeel/statistics/impressions
* http://jsonstub.com/api/marfeel/statistics/visits

Note: calling this Api on browser wont work as it will requires JsonStub API Keys which I have included in http request callback in  src/js/chartElement.js
