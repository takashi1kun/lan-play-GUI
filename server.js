var static = require('node-static');
var file = new static.Server(`${__dirname}/public`)

require('http').createServer(function (request, response) {
    request.addListener('end', function () {
        file.serve(request, response)
    }).resume()
}).listen(9990)