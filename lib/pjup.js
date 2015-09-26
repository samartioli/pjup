var fs = require('fs');
var path = require('path');
var inquirer = require('inquirer');
var _ = require('lodash');
var sh = require('shelljs');
var async = require('async');
var util = require('util');
var q = require('q');

var argv = require('./arguments')();

var pathToPj = path.join(process.cwd(), 'package.json');
var pj = require(pathToPj);
var dirty = false;

var _run = _run;
var _runsCb = _runsCb;
var _npmInstall = _npmInstall;

async.series({
    devDependencies: function(cbRuns) {
        _run('devDependencies', cbRuns);
    },
    dependencies: function(cbRuns) {
        _run('dependencies', cbRuns);
    }
}, _runsCb);


function _run(dependencyKey, cbRuns) {

    console.log('### INFO: About to gather latest versions for %j', dependencyKey);

    var asyncObject = {};
    var latestVersions = {};

    _.forEach(pj[dependencyKey], function(value, key) {

        asyncObject[key] = function(cbVersions) {

            sh.exec('npm view ' + key + ' version --loglevel warn', {silent:true}, function(code, output) {

                process.stdout.write('.');

                var current = value.replace(/^\^/, '');

                cbVersions(null, {
                    current: current,
                    latest: output.trim()
                });

            });
        };

    });

    async.parallelLimit(asyncObject, 7, function(err, results) {

        process.stdout.write('\n');

        var questions = [];

        _.forEach(results, function(value, key) {

            if (value.current !== value.latest) {

                latestVersions[key] = value.latest;

                questions.push({
                    type: 'confirm',
                    name: key,
                    message: util.format(
                        '%j - Current: %j, Latest: %j. Upgrade?',
                        key,
                        value.current,
                        value.latest
                    ),
                    default: true

                });

            }

        });

        inquirer.prompt(questions, function(answers) {

            _.forEach(answers, function(value, key) {

                if (value === true) {

                    dirty = true;
                    pj[dependencyKey][key] = argv.p + latestVersions[key];

                }

            });

            cbRuns(null, pj[dependencyKey]);

        });

    });

};

function _runsCb(err, results) {

    if (!dirty) {
        console.log("INFO: Nothing changed, so exiting");
        return true;
    }

    var questions = [{
        type: 'confirm',
        name: 'update',
        message: 'Update package.json with new versions?',
        default: true
    },
    {
        type: 'confirm',
        name: 'npminstall',
        message: 'npm install?',
        default: true,
        when: function (answers) {
            return answers.update;
         }
    }
    ];

    inquirer.prompt(questions, function(answers) {
        if (answers.update === true) {
            fs.writeFile(pathToPj, JSON.stringify(pj, null, 4), function(err) {
                if (err) {throw err;}
                console.log('### INFO: package.json has been updated');
                if (answers.npminstall) {
                    // Have to call npm install exec as a function and return a promise otherwise
                    // it the mian script returns before the exec finishes
                    _npmInstall()
                    .then(function() {
                        console.log('### INFO: npm install finished');
                    })

                };
            });
        }
    });

};


function _npmInstall() {

    var deferred = q.defer();

    sh.exec('npm install', {silent:false}, function(code, output) {
        deferred.resolve(code)
    });

    return deferred.promise;

}
