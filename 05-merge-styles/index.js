const fs = require('fs');
const path = require('path');

const folder = 'styles';

const outputStream = fs.createWriteStream(path.join(__dirname, 'project-dist', 'bundle.css'), 'utf-8');

fs.readdir(path.join(__dirname, folder), {withFileTypes: true}, (err, data) => {
  data.forEach(dirent => {
    if (dirent.isFile()) {
      const name = dirent.name;
      if (path.extname(name) === '.css') {
        const inputStream = fs.createReadStream(path.join(__dirname, folder, name), 'utf-8');
        let text = '';

        inputStream.on('data', chunk => text += chunk);
        inputStream.on('end', () => outputStream.write(`${text}\n`));
      }
    }
  })
})
