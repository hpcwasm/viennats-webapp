

importScripts('../buildwasm/viennats.js');

var currentsimdir = '/';


var vts = VTS().then(function() { 

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
      vts.FS.mkdir(dir);
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
      vts.FS.writeFile(FSgeofilepath, fileasstring);
    };

    // write content of editor to FS
    const parfilepath = '/' + e.data.FSfolder + '/' + e.data.parfile;
    // console.log(parfilepath);

    const newfile =
        e.data.parfilestring.replace(/".\//g, '"/' + e.data.FSfolder + '/');
    console.log(newfile);
    // console.log(e.data.parfilestring);
    vts.FS.writeFile(parfilepath, newfile);

    try {
      vts.runfile(parfilepath,4);
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


});


// post load