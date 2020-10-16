var Jimp = require("jimp");

// open a file called "lenna.png"
// Jimp.read("lenna.png", (err, lenna) => {
//   if (err) throw err;
//   lenna
//     .resize(256, 256) // resize
//     .quality(60) // set JPEG quality
//     .greyscale() // set greyscale
//     .write("lena-small-bw.jpg"); // save
// });

// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener("DOMContentLoaded", () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector);
    if (element) element.innerText = text;
  };

  // console.log(Jimp);

  const drop = document.getElementById("drop");
  const fileElem = document.getElementById("fileElem");
  const images = document.getElementById("images");
  const afterImages = document.getElementById("after-images");

  [("dragenter", "dragover", "dragleave", "drop")].forEach((eventName) => {
    drop.addEventListener(eventName, preventDefaults, false);
  });

  function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  drop.addEventListener("drop", handleDrop, false);

  async function handleDrop(e) {
    let dt = e.dataTransfer;
    let files = dt.files;
    console.log(files);

    // convert FileList to arr
    files = [...files];

    files.forEach((img) => (images.innerHTML += `<img src="${img.path}"/>`));
    // handleFiles(files);

    // for each file, read into Jimp, and append to afterImages
    const promises = files.map((f) =>
      Jimp.read(f.path).then((readImg) => {
        console.log(readImg);
        return readImg
          .resize(200, 200)
          .quality(10) // set JPEG quality
          .greyscale() // set greyscale
          .write(`./temp/${f.name}`); // save
      })
    );

    const finalImages = await Promise.all(promises);
    console.log(finalImages);

    files.forEach(
      (img) => (afterImages.innerHTML += `<img src="./temp/${img.name}"/>`)
    );
  }

  fileElem.addEventListener("change", function (e) {
    console.log(e);
  });

  for (const type of ["chrome", "node", "electron"]) {
    replaceText(`${type}-version`, process.versions[type]);
  }
});
