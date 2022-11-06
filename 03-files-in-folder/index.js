const fs = require('fs');
const path = require('path');

const folder = 'secret-folder';

const sizeToKb = (size) => {
  return `${(size / 1024).toFixed(3)}kb`
}

fs.readdir(path.join(__dirname, folder), {withFileTypes: true}, (err, data) => {
  data.forEach(dirent => {
    if (dirent.isFile()) {

      const fileName = dirent.name;

      const showFileInfo = (size) => {
        process.stdout.write(`${fileName} - ${path.extname(fileName).slice(1)} - ${sizeToKb(+size)}\n`)
      }

      fs.stat(path.join(__dirname, folder, fileName), (err, stats) => {
        showFileInfo(stats.size)
      })
    }
  })
});
