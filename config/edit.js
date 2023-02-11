var Jimp = require("jimp");

const editorPic = (path, newPath) => {

  Jimp.read(path)
  .then((pic) => {
    return pic
      .resize(250, 250) // resize
      .quality(60) // set JPEG quality
      .write(newPath); // save
  })
  .catch((err) => {
    console.error(err);
  }); 
}


  module.exports = { editorPic };