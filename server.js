const libphonenumber = require('libphonenumber-js');
const express = require('express')
const bodyParser = require('body-parser');
const http = require('https');
const API_ACCESS_TOKEN = process.env.APIGRAPH_ACCESS_TOKEN;
const SENDER_PHONE_NUMBER_ID = process.env.SENDER_PHONE_NUMBER_ID;
const MSG_TEMPLATE_NAME = process.env.MSG_TEMPLATE_NAME;
const MSG_TEMPLATE_LANG = process.env.MSG_TEMPLATE_LANG || 'RU';
const PORT = process.env.PORT || 3000;

var options = {
  host: 'graph.facebook.com',
  path: `/v13.0/${SENDER_PHONE_NUMBER_ID}/messages`,
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
  console.log(request.body);      // your JSON
  if (request.body.text && (request.body.phone || request.body.sender))
  {
    var code = request.body.text.split(' ').pop();
    const phoneNumber = libphonenumber.parsePhoneNumber(request.body.phone ? request.body.phone : request.body.sender);
    if (phoneNumber && phoneNumber.isValid()) 
    {
      var phone = (phoneNumber.countryCallingCode == 7 ? phoneNumber.countryCallingCode + '8' + phoneNumber.nationalNumber
                                                       : phoneNumber.countryCallingCode + phoneNumber.nationalNumber);
      console.log(`Extracted code: ${code} will be send to: ${phone}`);
      var req = http.request(options, callback);
      req.on('error', (err) => console.log("Couldn't send Whatsapp message:", err));
      req.write(`{ "messaging_product": "whatsapp", "to": "${phone}", "type": "template", "template": { "name": "${MSG_TEMPLATE_NAME}", "language": { "code": "${MSG_TEMPLATE_LANG}" }, "components": [ { "type": "BODY", "parameters": [ { "type": "text", "text": "${code}" } ] } ] } }`);
      req.end();
    }
    else
      console.log('Invalid phone number: ', request.body.phone);
  }
  else
    console.log("Unexpected request. Couldn't find text or phone field(s) in body");
  response.send(request.body);    // echo the result back
});
app.get('/', (req, res) => {
  // Use req.log (a `pino` instance) to log JSON:
  res.send('This message is displayed for testing purposes.');
});


app.listen(PORT, () => {
  console.log(`App started on PORT ${PORT}`);
  console.log(`Api Graph access token: ${API_ACCESS_TOKEN}`);
  console.log(`Sender phone number ID: ${SENDER_PHONE_NUMBER_ID}`);
  console.log(`Message template name: ${MSG_TEMPLATE_NAME}`);
  console.log(`Message template language: ${MSG_TEMPLATE_LANG}`);
});
