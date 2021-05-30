require("dotenv").config();
const fs = require("fs");
const iconDownloader = require("../libs/iconDownloader");
const plantCheck = require("../libs/plantCheck");
const translate = require("../libs/translate");
const generatePreset = require("../libs/generatePreset");
const stringToBool = require("../libs/stringToBool");
const open = require("open");
const csv = require("csv-parser");
const mkdirp = require("mkdirp");
const gsjson = require("google-spreadsheet-to-json");
const slugify = require("@sindresorhus/slugify");

const argument = process.argv.slice(2)[0];
let isCsv = false;
let isGoogleSpreadsheet = false;
if (argument.split(".")[argument.split(".").length - 1] === "csv") {
  isCsv = true;
} else if (argument.split("https://").length > 1) {
  isGoogleSpreadsheet = true;
}
const {
  SHOW_IMAGE,
  NAME_IN_TABLE,
  COLOR_IN_TABLE,
  ICON_DIR,
  MAPEO_AGROFORESTRY_KEY
} = process.env;
const iconDir = ICON_DIR || "./pre-icons";

async function getTermIcons(name, color, stratum, use, cycle) {
  /* Get plant information */
  const showImage = stringToBool(SHOW_IMAGE);
  // const plants = await plantCheck(term);
  // plants.forEach((p) => {
  //   const { common_name, scientific_name, image_url } = p;
  //   console.log(`${common_name} (${scientific_name}): ${image_url}`);
  //   if (showImage) {
  //     open(image_url);
  //   }
  // });
  /* Generate Mapeo presets */
  await generatePreset(name, stratum, use, cycle);
  console.log("Generated preset for", name);
  /* Download plant icons */
  let total = {
    downloads: 0
  };
  /* Download from common and scitinfic names */
  // for await (let plant of plants) {
  //   if (plant.common_name) {
  //     const iconDlCommon = await iconDownloader(
  //       plant.common_name,
  //       term,
  //       iconDir
  //     );
  //     if (iconDlCommon) {
  //       total.downloads = total.downloads + iconDlCommon.total;
  //     }
  //   }
  //   console.log("Downloading: ", plant.scientific_name);
  //   const iconDlScientific = await iconDownloader(
  //     plant.scientific_name,
  //     term,
  //     iconDir
  //   );
  //   if (iconDlScientific) {
  //     total.downloads = total.downloads + iconDlScientific.total;
  //   }
  // }
  let translateColor = "black";
  if (color) {
    translateColor = await translate(color);
  }
  const translation = await translate(name);
  console.log("Downloading translated: ", translation);
  const iconDlTranslations = await iconDownloader(
    translation,
    name,
    translateColor,
    iconDir
  );
  console.log("Total download", iconDlTranslations);
}

async function run() {
  await mkdirp(iconDir);
  await mkdirp("./icons");
  if (isCsv) {
    console.log("Opening CSV");
    let table = [];
    fs.createReadStream(argument)
      .pipe(csv())
      .on("data", data => table.push(data))
      .on("end", async () => {
        for await (let plant of table) {
          const name = plant[NAME_IN_TABLE].toLowerCase();
          const color = plant[COLOR_IN_TABLE].toLowerCase();
          console.log("Downloading for", name);
          await getTermIcons(name, color);
        }
      });
  } else if (isGoogleSpreadsheet) {
    console.log("Reading Google Spreadsheet");
    const spreadsheetId = argument.split("spreadsheets")[1].split("/")[2];
    const json = await gsjson({
      spreadsheetId
    });
    for await (let plant of json) {
      if (plant[NAME_IN_TABLE] && plant[COLOR_IN_TABLE]) {
        const name = plant[NAME_IN_TABLE].toLowerCase();
        const color = plant[COLOR_IN_TABLE].toLowerCase();
        const tags = Object.entries(plant).reduce(
          (prev, [key, value]) => {
            if (key !== NAME_IN_TABLE && key !== COLOR_IN_TABLE) {
              return Object.assign(prev, {
                [key]: value
              });
            } else return prev;
          },
          { type: MAPEO_AGROFORESTRY_KEY || "agroforest" }
        );
        console.log("Downloading for", name);
        await getTermIcons(name, color, tags);
      }
    }
  } else {
    getTermIcons(argument);
  }
}

run();
