Commando Cordova
================

_It almost works._

### Installation:

Global dependencies:

* `npm install -g bower gulp`

Local dependencies:

* `npm install`

Building app files into phonegap/www:

* `gulp build`
or
* `gulp watch` (autobuild)

---
### To generate a release artifact:

* `npm run release [android|ios]`


---
### Other ways to run the code:

Cordova serve:

* `npm start`
or
* `gulp develop` (autobuild, autorestart)

Using the phonegap previewer:

* `npm install -g phonegap`
* `cd phonegap && phonegap serve`

Emulation:

* `npm install -g ios-sim`
* `npm run emulator [android|ios]`

Side loading:

* `npm install -g ios-deploy`
* `npm run device [android|ios]`
