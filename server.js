const libphonenumber = require('libphonenumber-js');
const express = require('express')
const bodyParser = require('body-parser');
const http = require('https');
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
  response.on('error', (err) => {
    console.log(err);
  });

  response.on('end', function () {
    console.log(str);
  });
}

var app = express();

app.use(bodyParser.json());

app.post('/register', function(request, response) {
  if (request.body.text && request.body.phone)
  {
    var code = request.body.text.split(' ').pop();
    const phoneNumber = libphonenumber.parsePhoneNumber(request.body.phone);
    if (phoneNumber && phoneNumber.isValid()) 
    {
      var phone = (phoneNumber.countryCallingCode == 7 ? phoneNumber.countryCallingCode + '8' + phoneNumber.nationalNumber
                                                       : phoneNumber.countryCallingCode + phoneNumber.nationalNumber);
      console.log(`Extracted code: ${code} will be send to: ${phone}`);
      var req = http.request(options, callback);
      req.on('error', (err) => console.log("Couldn't send Whatsapp message:", err));
      req.write(`{ "messaging_product": "whatsapp", "to": "${phone}", "type": "template", "template": { "name": "account_confirmation_code_v2", "language": { "code": "RU" }, "components": [ { "type": "BODY", "parameters": [ { "type": "text", "text": "${code}" } ] } ] } }`);
      req.end();
    }
    else
      console.log('Invalid phone number: ', request.body.phone);
  }
  else
    console.log("Unexpected request. Couldn't find text or phone field(s) in body");
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
