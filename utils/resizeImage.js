const jimp = require("jimp");

const resizeImage = async (file) => {
  const image = await jimp.read(file);
  image.resize(250, 250);
  await image.writeAsync(file);
};
module.exports = resizeImage;
