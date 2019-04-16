
var Module = {
  'print': function(text) {
    message = {'stdout': true, 'text': text};
    postMessage(message);
  },
  'printErr': function(text) {
    message = {'stderr': true, 'text': text};
    postMessage(message);
  },
  CPPCallback: function(str) {
    console.log('(worker) CPPCallback received, forwarding it to main');
    j = JSON.parse(str)
    if (j.fileready === true) {
      // get file content and augment json object with it
      console.log('(worker) fileready ' + j.filename);
      if (j.filename.includes('Error')) {
        console.log(
            '### reading error file: ' +
            '/' + j.filename);
        fileAsString =
            FS.readFile('/' + j.filename, {'encoding': 'utf8', 'flags': 'r'});
        // console.log(fileAsString);
      } else {
        fileAsString =
            FS.readFile(j.filename, {'encoding': 'utf8', 'flags': 'r'});
      }

      console.log('(worker) fileAsString');
      // console.log(fileAsString);
      j['filecontent'] = fileAsString;
      // fileAsArray = FS.readFile(j.filename, {'encoding': 'binary', 'flags':
      // 'r'}); j['filecontent'] = fileAsArray;
      postMessage(j);
    }
    else {postMessage(j)};
  },
  onRuntimeInitialized: function() {
    // copied from
    Module.abort = function(what) {
      if (Module['onAbort']) {
        Module['onAbort'](what)
      }
      if (what !== undefined) {
        out(what);
        err(what);
        what = JSON.stringify(what)
      } else {
        what = ''
      }
      ABORT = true;
      EXITSTATUS = 1;
      throw 'abort(' + what + ')';
    };
    Module.vtswasm.SetCallback(Module.CPPCallback);
    console.log('(worker) onRuntimeInitialized ready');
    message = {'runtimeready': true};
    postMessage(message);
  },
  locateFile: function(url) {
    return '../buildwasm/' + url;
  }

};

importScripts('../buildwasm/viennats.js');

var currentsimdir = '/';

// message from GUI
onmessage =
    function(e) {
  console.log('(worker) message received from main');
  if (e.data.parfilestring !== undefined) {
    console.log('(worker) runsim from parfilestring');
    const syncbody = async () => {
      // get geodata from backend and write to FS
      console.log('(worker) writing geofiles');
      // console.log(e.data.FSfolder);
      try {
        const dir = '/' + e.data.FSfolder;
        currentsimdir = dir;
        // console.log(dir);
        FS.mkdir(dir);
      } catch (err) {
        console.log('(worker) dir already exists');
      }
      for (var i = 0; i != e.data.geomtries.length; ++i)
      // e.data.geomtries.forEach(function(geofile)
      {
        const BEgeofilepath =
            '../simulations/' + e.data.FSfolder + '/' + e.data.geomtries[i];
        const FSgeofilepath = '/' + e.data.FSfolder + '/' + e.data.geomtries[i];
        // console.log(BEgeofilepath);
        // console.log(FSgeofilepath);
        const response = await fetch(BEgeofilepath);
        const fileasstring = await response.text();
        // console.log(fileasstring);
        FS.writeFile(FSgeofilepath, fileasstring);
      };

      // write content of editor to FS
      const parfilepath = '/' + e.data.FSfolder + '/' + e.data.parfile;
      // console.log(parfilepath);

      const newfile =
          e.data.parfilestring.replace(/".\//g, '"/' + e.data.FSfolder + '/');
      console.log(newfile);
      // console.log(e.data.parfilestring);
      FS.writeFile(parfilepath, newfile);

      try {
        Module.runfile(parfilepath);
      } catch (err) {
        console.log(err);
        message = {'runtimeexception': true, 'message': err};
        postMessage(message);
      }
    };
    syncbody();
  } else if (e.data.terminate !== undefined) {
    console.log('(worker) terminating myself');
    self.close();
  } else {
    console.log('(worker) cannot identify message from worker');
  }
}


// post load