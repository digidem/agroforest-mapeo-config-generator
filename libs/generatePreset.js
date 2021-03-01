const fs = require("fs");
const path = require("path");
const slugify = require("@sindresorhus/slugify");

module.exports = (term, plants) => {
  const slugTerm = slugify(term);
  const toSave = path.join(process.cwd(), `presets/${slugTerm}.json`);
  const toSaveIcon100 = path.join(process.cwd(), `icons/${slugTerm}-100px.svg`);
  const toSaveIcon24 = path.join(process.cwd(), `icons/${slugTerm}-24px.svg`);
  let terms = [];
  if (plants) {
    plants.forEach(p => {
      const { scientific_name } = p;
      terms.push(scientific_name);
    });
  }
  fs.copyFileSync(
    path.join(process.cwd(), "default-icons/plant-100px.svg"),
    toSaveIcon100
  );
  fs.copyFileSync(
    path.join(process.cwd(), "default-icons/plant-24px.svg"),
    toSaveIcon24
  );
  const result = {
    name: term.charAt(0).toUpperCase() + term.slice(1),
    icon: slugTerm,
    fields: ["manejo", "lua"],
    geometry: ["point", "area"],
    tags: {
      type: "Plant"
    },
    terms
  };

  fs.writeFileSync(toSave, JSON.stringify(result));
};
