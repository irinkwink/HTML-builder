const fs = require('fs');
const path = require('path');

const projectFolderName = 'project-dist';
const styleFileName = 'style.css';
const assetsFolderName = 'assets';
const templateFileName = 'template.html';
const componentsFolderName = 'components';

const copyStyles = () => {
  const folder = 'styles';

  const outputStream = fs.createWriteStream(path.join(__dirname, projectFolderName, styleFileName), 'utf-8');
  
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
}

const copyAssets = (srcFolder, destFolder) => {
  fs.mkdir(destFolder, { recursive: true }, () => {
    fs.readdir(srcFolder, {withFileTypes: true}, (err, data) => {
      data.forEach(dirent => {
        const name = dirent.name;
        if (dirent.isFile()) {
          fs.copyFile(path.join(srcFolder, name), path.join(destFolder, name), () => {});
        } else if (dirent.isDirectory()) {
          const srcFolderNew = path.join(srcFolder, name);
          const destFolderNew = path.join(destFolder, name);
          copyAssets(srcFolderNew, destFolderNew);
        }
      })
    });
  });
}

const copyHtml = () => {
  const componentsFolder = path.join(__dirname, componentsFolderName);

  fs.readdir(componentsFolder, {withFileTypes: true}, (err, data) => {
    const components = data
      .filter(dirent => dirent.isFile())
      .filter(dirent => path.extname(dirent.name) === '.html')
      .map(dirent => dirent.name.split('.')[0])

    fs.readFile(path.join(__dirname, templateFileName), (err, data) => {
      let template = data.toString();
      components.forEach(component => {
        if (template.includes(`{{${component}}}`)) {
          fs.readFile(path.join(__dirname, componentsFolderName, `${component}.html`), (err, data) => {
            template = template.replace(`{{${component}}}`, data.toString());
            fs.writeFile(path.join(__dirname, projectFolderName, 'index.html'), template, () => {})
          })
        }
      })
    })
  });
}

const createProjectFolder = () => {
  const destFolder = path.join(__dirname, projectFolderName);

  fs.rm(destFolder, { recursive: true, force: true }, () => {
    fs.mkdir(destFolder, { recursive: true }, () => {
      copyStyles();
      const srcFolder = path.join(__dirname, assetsFolderName);
      const destFolder = path.join(__dirname, projectFolderName, assetsFolderName);
      copyAssets(srcFolder, destFolder);
      copyHtml();
    });
  });

  return destFolder;
}



createProjectFolder();
