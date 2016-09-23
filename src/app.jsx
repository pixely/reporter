import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './index.scss';
import React from 'react';
import Dropbox from 'dropbox';

var ACCESS_TOKEN = 'S9NydbWMmbUAAAAAAACFfM9Ds4sDu_oA-5URQl3fZSKr2ey6e3dcc5bacWoyGEHQ';

function listFiles() {
  var dbx = new Dropbox({accessToken: ACCESS_TOKEN});
  dbx.filesListFolder({path: '/Apps/Reporter-App'})
      .then(function (response) {
        displayFiles(response.entries);
        console.log(response);
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
            console.log(data.fileBlob);
            var reader = new FileReader();
            reader.addEventListener("loadend", function() {
              console.log(JSON.parse(reader.result));
              // reader.result contains the contents of blob as a typed array
            });
            reader.readAsText(data.fileBlob);
          })
          .catch(function (error) {
            console.error(error);
          });
    }
  }
}

listFiles();

export default class App extends React.Component {
  render() {
    return (
        <div>
          <h1>Dropbox</h1>
        </div>
    )
  }
}