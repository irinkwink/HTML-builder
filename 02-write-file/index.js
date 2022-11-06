const fs = require('fs');
const path = require('path');
const readline = require('readline');

const file = 'text.txt';
const outputFile = fs.createWriteStream(path.join(__dirname, file), 'utf-8');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.write('Write text: \n');

rl.on('line', data => {
  data.toString().trim().toLowerCase() === 'exit' ? 
    printExitMessage() :
    outputFile.write(`${data}\n`);
});

const printExitMessage = () => {
  outputFile.end();
  rl.write(`All your data saved in ${file}\n`);
  rl.close();
  process.exit(0);
}

rl.on('SIGINT', printExitMessage);
