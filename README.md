BuildAngular in TypeScript
=======================

This is a work-in-progress to build a simple Angular.js (Angular 1) in TypeScript.
Based on [Tero Parviainen's] (http://teropa.info/) book [Build Your Own Angular] (http://teropa.info/build-your-own-angular/build_your_own_angularjs_sample.pdf)

To Build
------

    npm install -g gulp tsd
    npm install
    tsd reinstall
    gulp compile

Run unit tests
-------

    npm install -g karma
    gulp compile
    karma start


Authored by Shahar Zimmerman