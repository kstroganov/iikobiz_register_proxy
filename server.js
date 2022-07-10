var express = require('express')
var bodyParser = require('body-parser');
var http = require('https');

var options = {
  host: 'graph.facebook.com',
  path: '/v13.0/109844545118491/messages',
  headers: {
	  'Authorization': 'Bearer EAAMyDtny59sBAI6PgS0v3nifjlEnhoJGBBBXSvp7n7ZCxhUN9koaxSZA6gYhkyzwnwIKtL1iqnbuErl5RpxszzkXrXqZCD3Qy47GiWHDZBnhwLmIa4Esim67EtIZALXlzBQslHH1jHXezmTzdyJoUZBZA9YrWZAc98z3gAIIpZAKGc1meeAGaZBMjvirbsEtNQNmyARG7P6aeZBA42qYZAPP64k0',
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
   var req = http.request(options, callback);
   req.write('{ "messaging_product": "whatsapp", "to": "789160378158", "type": "template", "template": { "name": "hello_world", "language": { "code": "en_US" } } }');
   req.end();
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
});
