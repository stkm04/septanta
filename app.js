'use strict';

process.env.DEBUG = 'actions-on-google:*';
let Assistant = require('actions-on-google').ApiAiAssistant;
let express = require('express');
let bodyParser = require('body-parser');
let request = require('request');

let app = express();
app.use(bodyParser.json({type: 'application/json'}));

// [START ACTIONS]
app.post('/', function (req, res) {
  const assistant = new Assistant({request: req, response: res});
  //console.log('Request headers: ' + JSON.stringify(req.headers));
  //console.log('Request body: ' + JSON.stringify(req.body));
 
 const Prompts = new Array("What else can I do for you?", 
                          "Is there anything else you want me to do?",
                          "Anything else?");
  
 function NextTrain(assistant) {
   console.log('NextTrain');
   console.log(assistant.getRawInput());
   let LocStart = assistant.getArgument('LocStart');
   let LocDest = assistant.getArgument('LocDest');
   
   
   
   // Set the headers
  var headers = {
    'User-Agent':       'Super Agent/0.0.1',
    'Content-Type':     'application/x-www-form-urlencoded'
  }

  // Configure the request
  var options = {
    url: 'http://app.septa.org/nta/result.php',
    method: 'GET',
    headers: headers,
    qs: {'loc_a': 'Whitford', 'loc_z': 'Paoli'}
  }

  // Start the request
  request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
        // Print out the response body
        console.log(body)
    }
  })
   
   
   
   let nextPrompt = Prompts[Math.floor(Math.random() * Prompts.length)];
   assistant.ask('The next train from  '+LocStart+' to '+LocDest+' will be arriving in 10 minutes. '+nextPrompt);
 }
   
  let actionMap = new Map();
  actionMap.set('input.nta', NextTrain);
  assistant.handleRequest(actionMap);

});
// [END ACTIONS]

if (module === require.main) {
  // Start the server
  let server = app.listen(process.env.PORT || 8080, function () {
    let port = server.address().port;
    console.log('App listening on port %s', port);
  });
}

module.exports = app;
