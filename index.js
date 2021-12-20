const fs = require("fs")
const path = require("path")
const FormData = require("form-data")
const axios = require("axios")
const chalk = require("chalk")
const prompt = require("prompt-sync")({
  sigint: false
})
const clui = require('clui')
const fsExtra = require('fs-extra')
const cfonts = require('cfonts')

const {
  Spinner
} = clui
var inputPath = path.resolve("./input");

let input = "./input/"
let output = "./output/"
let filesList;
let filetypes = /jpeg|jpg|png/;
let banner = cfonts.render(('remove.bg'), {
  font: 'tiny',
  color: 'white',
  align: 'center',
  gradient: ["red", "yellow"],
  lineHeight: 2
});

let apikey = 'UwUyBKhHiZ9hrYroXWfNAbPM' //get apikey: https://www.remove.bg/

let listopsi = `${chalk.blue.inverse.bold("Choose one of the options!")}

${chalk.red('[')}${chalk.whiteBright('1')}${chalk.red(']')} ${chalk.greenBright('Start')}
${chalk.red('[')}${chalk.whiteBright('2')}${chalk.red(']')} ${chalk.greenBright('Clear Input/Output')}
${chalk.red('[')}${chalk.whiteBright('00')}${chalk.red(']')} ${chalk.greenBright('Exit')}
`
console.clear()
console.log(banner.string)
console.log(chalk.yellow(`\n                        ${chalk.yellow(' Created By YogiPw')}`), `\n                        `)
console.log(listopsi)


fs.readdir(inputPath, function(err, files) {
  filesList = files.filter(function(e) {
    const extname = filetypes.test(path.extname(e).toLowerCase());
    return extname
  });
  const inputt = prompt(`${chalk.red('[')}${chalk.whiteBright('~')}${chalk.red(']')} ${chalk.greenBright('Which option number : ')}`);
  switch (inputt) {
    case "1":
      filesList.forEach((e) => {
        console.clear()

        const formData = new FormData();
        formData.append('size', 'auto');
        formData.append('image_file', fs.createReadStream(input+e), path.basename(inputPath));
        axios({
          method: 'post',
          url: 'https://api.remove.bg/v1.0/removebg',
          data: formData,
          responseType: 'arraybuffer',
          headers: {
            ...formData.getHeaders(),
            'X-Api-Key': apikey,
          },
          encoding: null
        })
        .then((response) => {
          if (response.status != 200) return console.error('Error:', response.status, response.statusText);
          fs.writeFileSync(output+e, response.data);
          console.log(chalk.green("[ SUCCESS ]"), " filename: "+e)
        })

        .catch((error) => {
          process.exit()
          return console.log(chalk.red('Request failed:', error));
        })

      });
      break
    case "2":
      fsExtra.emptyDirSync(input)
      fsExtra.emptyDirSync(output)
      console.clear()
      console.log(chalk.green("Success!!"))
      break
    case "00":
      console.clear()
      console.log("See you..")
      break
    default:
      console.log("Aborted!")
      process.exit();
    }


  });