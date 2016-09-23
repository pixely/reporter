import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './index.scss';
import React from 'react';
import Dropbox from 'dropbox';
import localForage from 'localforage';

var ACCESS_TOKEN = 'S9NydbWMmbUAAAAAAACFfM9Ds4sDu_oA-5URQl3fZSKr2ey6e3dcc5bacWoyGEHQ';

function configureLocalForage() {
  localForage.config({
    name        : 'reporter',
    version     : 1.0,
    description : 'Storing data from reports generated with ReporterApp'
  });
}

function saveReport(report) {
  var reader = new FileReader();
  reader.addEventListener("loadend", function(test) {
    localForage.setItem(report.name, JSON.parse(reader.result),function(err, value){
      console.log(err, value);
    });
  });
  reader.readAsText(report.fileBlob);
}

function listFiles() {
  var dbx = new Dropbox({accessToken: ACCESS_TOKEN});
  dbx.filesListFolder({path: '/Apps/Reporter-App'})
      .then(function (response) {
        displayFiles(response.entries);
      })
      .catch(function (error) {
        console.error(error);
      });
  return false;
}
function displayFiles(files) {
  var dbx = new Dropbox({accessToken: ACCESS_TOKEN});
  if (typeof files === 'object') {
    for(let report of files) {
       dbx.filesDownload({path: report.path_lower})
          .then(function (data) {
            saveReport(data);
          })
          .catch(function (error) {
            console.error(error);
          });
    }
  }

}


function generateReport(type) {

  var report = [];

  localForage.iterate(function(value, key, iterationNumber) {
    for(var snapshot of value.snapshots){
      if( typeof snapshot[type] === 'string' || typeof snapshot[type] === 'number') {
        report.push({
          date: snapshot.date,
          value: snapshot[type]
        });
      }
    }
  }, function() {
  });

  return report;

}

configureLocalForage();
listFiles();
var data = generateReport('battery');
console.log(data);

export default class App extends React.Component {
  render() {
    return (
        <div>
          <h1>Dropbox</h1>
        </div>
    )
  }
}