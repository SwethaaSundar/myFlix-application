// import all modules 
const http = require('http'),
url = require('url')
fs = require('fs');

// create server with request and response
http.createServer((request, response)=>{
    let addr = request.url,
    q = url.parse(addr, true),
    filePath = '';
// file system module appends data from URL to log.txt file
fs.appendFile('log.txt', 'URL: ' + addr + '\nTimestamp: ' + new Date() + '\n\n', (err) => {
if (err) {
   console.log(err);
} else {
   console.log('Added to log.');
}
});  
// defining the filepath based on the condition
if(q.pathname.includes('documentation')){
filePath = (__dirname + '/documentation.html')
}else{
filePath = 'index.html'
}    
// file system function reads file and stops code if error is returned
fs.readFile(filePath, (err, data) => {
if (err) {
   throw err;
}

response.writeHead(200, { 'Content-Type': 'text/html' });
response.write(data);
response.end();
});
// listens to user activity via port 8080
}).listen(8080);

console.log('My test server runs on the port 8080');