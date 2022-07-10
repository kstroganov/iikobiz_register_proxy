var express = require('express')
var bodyParser = require('body-parser');
var http = require('https');
const API_ACCESS_TOKEN = process.env.APIGRAPH_ACCESS_TOKEN;

var options = {
  host: 'graph.facebook.com',
  path: '/v13.0/109844545118491/messages',
  headers: {
	  'Authorization': `Bearer ${API_ACCESS_TOKEN}`,
	  'Content-Type': 'application/json' },
  method: 'POST'
};

callback = function(response) {
  var str = '';
  response.on('data', function (chunk) {
    str += chunk;
  });

  response.on('end', function () {
    console.log(str);
  });
}

var app = express();

app.use(bodyParser.json());

app.post('/register', function(request, response) {
  if (request.body.text)
  {
    var req = http.request(options, callback);
    req.write(`{ "messaging_product": "whatsapp", "to": "789160378158", "type": "text", "text": { "preview_url": false, "body": "${request.body.text}" } }`);
    req.end();
  }
  else
    console.log("Unexpected request. Couldn't find text field in body");
  console.log(request.body);      // your JSON
  response.send(request.body);    // echo the result back
});
app.get('/', (req, res) => {
  // Use req.log (a `pino` instance) to log JSON:
  res.send('This message is displayed for testing purposes.');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`App started on PORT ${PORT}`);
  console.log(`Api Graph access token: ${API_ACCESS_TOKEN}`)
});
