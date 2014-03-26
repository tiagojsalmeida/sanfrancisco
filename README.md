San Francisco
============

Realtime bus map from San Francisco built with D3.js library.


* [Installation](#installation)
* [Usage](#usage)
* [Building and Testing](#building-and-testing)
* [TODO](#todo)

## Installation

1. Download [[NodeJS]](http://nodejs.org) and Install it;
3. Install [[Grunt]](http://gruntjs.com):
```
sudo npm install -g grunt-cli
```
4. Install [[Bower]](http://bower.io):
```
sudo npm install -g bower
```

## Usage

Clone and Enter into the root folder:
```
git clone git@github.com:tiagojsalmeida/sanfrancisco.git sanfrancisco;
cd sanfrancisco;
```

Install all dependencies:
```
npm install;
bower install;
```

## Building and Testing

For running the application and [[Test it Live]](http://localhost:9000/), run:
```
grunt serve;
```

For building the production files:
```
grunt;
```

## TODO
* Improve Stops on the map and add their predictions;
* Improve bus direction and add their angle;
* Add Route schedules;
* Add messages and additional informations;
* Improve performance;

[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/tiagojsalmeida/sanfrancisco/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

