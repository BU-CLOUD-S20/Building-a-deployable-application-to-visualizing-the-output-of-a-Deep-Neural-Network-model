
feather.replace()
var fn_array = [];
var ref_array;
var dist_array = [];
var imgList = [0, 0, 0, 0];
var imgListEmpty = 4;  // Number of available lots in the imgList
var b64o = [0, 0, 0, 0];
var tempImg = new Array();
// Create off-screen image elements
tempImg[0] = new Image();
tempImg[1] = new Image();
tempImg[2] = new Image();
tempImg[3] = new Image();
// Grab elements, create settings, etc.
var video = document.getElementById('video');

// Elements for taking the snapshot
var webCamCanvas = document.getElementById('webCamCanvas');
var wCCcontext = webCamCanvas.getContext('2d');

function populateTable(i, tableData) {
  var destDivContent = document.getElementById('resultsDiv'+i+'-content');
  // Clear the destination div children
  var child = destDivContent.lastElementChild;  
  while (child) { 
    destDivContent.removeChild(child); 
    child = destDivContent.lastElementChild; 
  } 
  // Now append the <img> tag to hold the query image
  var div = document.getElementById('queryImg');
  clone = div.cloneNode(true); // true means clone all childNodes and all event handlers
  clone.id = "queryImg"+i;
  destDivContent.appendChild(clone);

  // Now append the <table> tag to hold the matching images
  div = document.getElementById('distTable');
  clone = div.cloneNode(true); // true means clone all childNodes and all event handlers
  clone.id = "distTable"+i;
  destDivContent.appendChild(clone);
  
  tableData.forEach(function(rowData) {
    var row = document.createElement('tr');

    var cell = document.createElement('td');
    var img = document.createElement('img');
    img.src = 'small-150/' + rowData[0];
    cell.appendChild(img);
    row.appendChild(cell);
    rowData.forEach(function(cellData) {
      cell = document.createElement('td');
      cell.appendChild(document.createTextNode(cellData));
      row.appendChild(cell);
    });

    var tbody = document.getElementById("distTable"+i).getElementsByTagName('tbody')[0];
    tbody.appendChild(row);
  });
}

function eucDistance(a, b) {
  return a
  .map((x, i) => Math.abs( x - b[i] ) ** 2) // square the difference
  .reduce((sum, now) => sum + now) // sum
  ** (1/2)
}

function calcSimilar(top, queryFeatures) {
  var rows = ref_array.length;
  var retImg = "-1";
  if (!queryFeatures) {
    var queryRow = Math.floor(Math.random() * (rows - 0 + 1) + 0);
    var queryimg = ref_array[queryRow];
    retImg = 'small-150/' + fn_array[queryRow];
  } else {
    var queryimg = queryFeatures;
  }
    
  for (i = 0; i < rows; i++) {
      let euc = eucDistance(queryimg, ref_array[i]).toFixed(2);
      var arr = [fn_array[i],euc];
      dist_array.push(arr); 
  }
  // console.log(rows);
  // console.log(dist_array.length);
  var topValues = dist_array.sort((a,b) => a[1]-b[1]).slice(0,top);
  // console.log("in calc, values: " + topValues);
  return [topValues, retImg];
}

// Download zip file of filenames and parse into array
async function parseSimFileNames() {
  return new Promise(async function(res,rej) {
    new JSZip.external.Promise(function (resolve, reject) {
      JSZipUtils.getBinaryContent('data/ref_filenames.zip', function(err, data) {
          if (err) {
              reject(err);
          } else {
              resolve(data);
          }
      });
    }).then(function (data) {
      return JSZip.loadAsync(data);
    }).then(function (zip) {
      return zip.file("ref_filenames.txt").async("string");
    }).then(function (text) {
      fn_array = JSON.parse(text);
      res();
    });
  })
  
}

// Download zip file of reference image features and parse into array
async function parseSimFileFeatures() {
  return new Promise(async function(res,rej) {
    new JSZip.external.Promise(function (resolve, reject) {
      JSZipUtils.getBinaryContent('data/ref_features.zip', function(err, data) {
          if (err) {
              reject(err);
          } else {
              resolve(data);
          }
      });
    }).then(function (data) {
      return JSZip.loadAsync(data);
    }).then(function (zip) {
      return zip.file("ref_features.txt").async("string");
    }).then(function (text) {
      ref_array = JSON.parse(text);
      res();
    });
  })
}



// Trigger photo take
document.getElementById("snap").addEventListener("click", function() {
  var width = video.videoWidth;
  var height = video.videoHeight;
  wCCcontext.canvas.width = width;
  wCCcontext.canvas.height = height;
  wCCcontext.drawImage(video, 0, 0, width, height);
});

$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
  var tabId = e.target.id;
  //console.log(tabId);
  if (tabId == "webcam-tab") {
    // console.log("on webcam tab now")
    // Get access to the camera!
    if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        // Not adding `{ audio: true }` since we only want video now
        navigator.mediaDevices.getUserMedia({ video: {width: 640, height: 480} }).then(function(stream) {
            //video.src = window.URL.createObjectURL(stream);
            video.srcObject = stream;
            video.play();
        });
    }
  } else if (video.srcObject != null) {
    var stream = video.srcObject;
    var tracks = stream.getTracks();

    for (var i = 0; i < tracks.length; i++) {
        var track = tracks[i];
        track.stop();
    }

    video.srcObject = null;
  }
})

// Trigger photo save - need this unsual syntax to accomodate the async nature of the "photoSave" process
document.getElementById("useImage").addEventListener("click", () => photoSave(), false);

async function photoSave(saveType, b64i) {
  if (saveType == 0)
    var dataURL = b64i;
  else 
    var dataURL = webCamCanvas.toDataURL();
  //console.log(dataURL);
  var thumbnailURL = await resizeImg(dataURL, 100);
  var fullimgURL = await resizeImg(dataURL, 480);
  //console.log(thumbnailURL);
  for (let i = 0; i < 4; i++) {
    if (imgList[i] == 0) {
      console.log("imgList has empty slot at: " + i); 
      document.getElementById("b64img-" + i).src=thumbnailURL;
      document.getElementById("clear-" + i).classList.remove("hide");
      document.getElementById("b64imgwrap-" + i).classList.remove("img-wrap-ph");
      imgList[i] = 1;
      b64o[i] = fullimgURL;
      imgListEmpty--;
      i = 4;
      }
      if (("b64o"+i) == 0) {
        console.log("b64 object " + i + "is empty (set to 0)");
      }
  }
}

function handleFiles(files) {
  num_file = files.length;
  var j = num_file;
  console.log("num_file: " + num_file);
  if (num_file > 4) 
    num_file = 4;
  
  if (imgListEmpty == 0) {
    displayError(1);
    return 0;
  }
  
  for (let i = 0; i < num_file; i++) {        
    const file = files[i];  
    const reader = new FileReader();
    if (!reader) {
      console.log("sorry, change the browser.");
      return
    }
    // Save the images
    reader.onload = ( function(aImg) { return function(e) { 
      aImg.src = e.target.result;
      console.log("image #" + i + " processed")
      j--;
      if(j == 0)  // After all files have been processed, call fnc to display them
        saveFiles(num_file);
      }; })(tempImg[i]);
    reader.readAsDataURL(file);
  }
}

async function saveFiles(numFiles) {
  //console.log("in savefiles, numFiles: " + numFiles);
  for (let k = 0; k < numFiles; k++) {
    //console.log("k: " + k);
    await photoSave(0, tempImg[k].src);
    tempImg[k].src = "";  // Clear photo from temp storage after saving it
  }
  console.log("imgListEmpty: " + imgListEmpty);
}

// //Sample Image(s) button -> show samples
// function handlesamples() {
  
// }


// Delete image from display and img list
function removeImg(imgNumber) {
  console.log("Remove Image Number: " + imgNumber);
  document.getElementById("b64img-" + imgNumber).src="";
  document.getElementById("clear-" + imgNumber).classList.add("hide");
  document.getElementById("b64imgwrap-" + imgNumber).classList.add("img-wrap-ph");
  imgList[imgNumber] = 0;
  b64o[imgNumber] = 0;
  imgListEmpty++;
  console.log("imgListEmpty in removeImg: " + imgListEmpty);
  loading(0);
}

function resizeImg(b64Orig, newHeight) {
  return new Promise(async function(resolve,reject){
    // Create an off-screen canvas
    var rIcanvas = document.createElement('canvas'),
    rIctx = rIcanvas.getContext('2d');
    // Create an off-screen image element
    var rImage = new Image();
    // WHen the image is loaded, process it
    rImage.onload = function() {
    // Original dimensions of image
    var width = rImage.naturalWidth;
    var height = rImage.naturalHeight;
    var ratio = width / height;
    // Dimensions of resized image (via canvas): rIwidth and newHeight
    var rIwidth = ratio * newHeight;
    //console.log("rImg width: " + rIwidth);
    //console.log("rImg height: " + newHeight);
    // Set canvas dimensions to resized image dimensions
    rIcanvas.width = rIwidth;
    rIcanvas.height = newHeight;
    // Draw the image on teh canvas at the new size
      rIctx.drawImage(rImage, 0, 0, width, height, 0, 0, rIcanvas.width, rIcanvas.height);
      // Export the new image as Base64 and return to calling function
      var rIdu = rIcanvas.toDataURL();
      resolve(rIdu);
    }
    // Load the image from the original Base64 source (passed into this function)
    rImage.src = b64Orig;
  })
}

function displayError(errno) {
  var errtext = "";
  switch (errno) {
    case 1:
      errtext = "Only 4 images can be uploaded at a time. To use different images, delete one of your existing thumbnails.";
      break;
    case 2:
      errtext = "Error during API request.";
      break;
    default:
      errtext = "An error occured.";
      break;
  }
  var progress = document.getElementById("progress");
  progress.innerHTML = errtext;
  progress.classList.remove("text-muted");
  progress.classList.add("text-danger");
  progress.classList.add("font-weight-bold");
}

function loading(status) {
  var progress = document.getElementById("progress");
  switch(status) {
    case 1:
      progress.innerHTML = "Sending images to model...waiting for results";
      progress.classList.remove("text-danger");
      progress.classList.add("text-muted");
      progress.classList.remove("font-weight-bold");
      break;
    case 2:
      progress.innerHTML += "<br/>Results received...parsing and displaying";
      break;
    case 3:
      progress.innerHTML += "<br/>Results complete!";
      break;
    default:
      progress.innerHTML = " ";
  }
}

function renderImage(i) {
  var img = document.getElementById("resultsImg" + i);
  
  // !!!!!!!!!!!!! MCB CHANGES  !!!!!!!!!!!!!!!!!
  // UPDATED TO LOAD DOWN-SAMPLED IMAGE IN <IMG> ELEMENT
  // TAKES A MOMENT TO LOAD, HENCE THE ONLOAD FUNCTION
  img.onload = function(){
    var width = img.naturalWidth;
    var height = img.naturalHeight;

    var c = document.getElementById("resultsCanvas" + i);
    var ctx = c.getContext("2d");

    ctx.canvas.height = height;
    ctx.canvas.width = width; 

    var scale = Math.min(c.width / width, c.height / height);
    // get the top left position of the image
    var imgx = (c.width / 2) - (width / 2) * scale;
    var imgy = (c.height / 2) - (height / 2) * scale;
    ctx.drawImage(img, imgx, imgy, width * scale, height * scale);
    
    // MAY WANT TO HIDE OR CLEAR THE <IMG> TAG AFTER DRAWING THE CANVAS

  };
  img.src = b64o[i];  // ADDITION
  // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
}

function imgdetection(i, x, y, xwidth, xheight, label) {
  var c = document.getElementById("resultsCanvas" + i);
  var ctx = c.getContext("2d");
  
  ctx.lineWidth = 5;
  ctx.strokeStyle = "#FF0000";
  ctx.fillStyle = "#FF0000";
  ctx.font = "20px Verdana";
  ctx.strokeRect(x, y, xwidth, xheight);
  ctx.fillText(label, 10 + parseInt(x), 20 + parseInt(y));
}

function imgclassification(i, label, probability) {
  var c = document.getElementById("resultsCanvas" + i);
  var ctx = c.getContext("2d");

  ctx.lineWidth = 5;
  ctx.strokeStyle = "#FF0000";
  ctx.fillStyle = "#FF0000";
  ctx.font = "20px Verdana";

  ctx.fillText(label, 0, 0);
  ctx.fillText(probability, 0, 10);
}

// "count" indicates the number of similar results to return; use 5 for now
// Call with no "queryFeatures" to use a random image from the existing thumbnails
// So example call without queryFeatures:  imgsimilarity(0,5)
async function imgsimilarity(i, count, queryFeatures) {
  // Do work here
  if (fn_array.length == 0) {
    // The zip files for the similarity comparison have't been processed yet
    await parseSimFileNames();
    await parseSimFileFeatures();
  }
  var results = calcSimilar(count, queryFeatures);
  // results: [topResults from image matching, path to query image if no queryFeatures]
  populateTable(i, results[0]);
  if (results[1] == "-1") {
    document.getElementById("queryImg"+i).src=b64o[i]
  } else {
    document.getElementById("queryImg"+i).src=results[1];
  }
}

function jsonParser(jString) {
  let resp = JSON.parse(jString)
  if (Array.isArray(resp[0])) {
    if (resp[0][0].hasOwnProperty("top")) {
      //will need to target a different feature if another scenario ends up doing rectangle boxes
      for (let i in resp) {
        renderImage(i);
        for (let box of resp[i]) {
          let x = box.left
          let y = box.top
          let width = box.right - box.left
          let height = box.bottom - box.top
          let label = box.label_name
          imgdetection(i, x, y, width, height, label)
        }
      }
      return "detection"
    }
    return "err"
  }

  if(resp.hasOwnProperty("probability")) {
    for (let i in resp) {
      renderImage(i);
      let label = resp[i].label
      let prob = resp[i].probability
      imgclassification(i, label, probability);
    }
    return "classification"
  }

  if(resp.hasOwnProperty("distance")) {
    for (let img of resp) {
      //call function
    }
    return "similarity"
  }
  return "err"
}

//whatever calls this should have a timeout
function APIRequest() {
  let url = document.getElementById("url")
  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  let payload = {}
  //add b64 strings to payload list at key "data"
  xhr.send(JSON.stringify(payload));

  xhr.onload = function() {
    if (xhr.readyState == 4) {
      if (xhr.status == 200) {
        loading(2);
        jsonParser(xhr.responseText);
        loading(3);
      } else {
        displayError(0);  // Display generic error message in bold, red text
        document.getElementById("progress").innerHTML = "Error: " + xhr.status + " response";  // Replace generic error text
      }
    }
  }

  xhr.onerror = function() {
    displayError(2);  // Display generic API error message in bold, red text
    //document.getElementById("progress").innerHTML = "Error during API request."
  }
}

// For development
// Takes Base64 of uploaded images and displays them in resultsImg elements on the page
// NOTE: img dimensions are not available until the Base64 code is loaded in as the src 
// ... of an img element; img element does NOT have to be rendered in the DOM if you just
// ... want the dimensions, though! 
function test() {
  for (let i = 0; i < 4; i++) {
    var img = document.getElementById("resultsImg" + i);
    if (b64o[i].length > 0)
      img.src = b64o[i];
    else 
      img.src = "";
  }
}