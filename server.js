var express = require('express')
var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.json());

app.post('/register', function(request, response){
   console.log(request.body);      // your JSON
   response.send(request.body);    // echo the result back
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`App started on PORT ${PORT}`);
});
