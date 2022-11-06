const fs = require('fs');
const path = require('path');

const copyFiles = (srcFolder, destFolder) => {
  fs.mkdir(destFolder, { recursive: true }, () => {
    fs.readdir(srcFolder, {withFileTypes: true}, (err, data) => {
      data.forEach(dirent => {
        const name = dirent.name;
        if (dirent.isFile()) {
          fs.copyFile(path.join(srcFolder, name), path.join(destFolder, name), () => {});
        } else if (dirent.isDirectory()) {
          const srcFolderNew = path.join(srcFolder, name);
          const destFolderNew = path.join(destFolder, name);
          copyFiles(srcFolderNew, destFolderNew);
        }
      })
    });
  });
}

copyFolder = () => {
  const folder = 'files';
  const srcFolder = path.join(__dirname, folder);
  const destFolder = path.join(__dirname, `${folder}-copy`);
  
  fs.rm(destFolder, { recursive: true, force: true }, () => {
    copyFiles(srcFolder, destFolder);
  });
}

copyFolder();
