var express = require('express')
var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.json());

app.post('/register', function(request, response){
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
