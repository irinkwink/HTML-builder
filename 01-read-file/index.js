const fs = require('fs');
const path = require('path');

const readableStream = fs.createReadStream(path.join(__dirname, 'text.txt'), 'utf-8');
let text = '';

readableStream.on('data', chunk => text += chunk);
readableStream.on('end', () => process.stdout.write(text));
readableStream.on('error', error => (process.stderr.write(`${error.message}\n`)));
