const fetch = require("node-fetch");
const tropicalFruitsApi = `http://api.tropicalfruitandveg.com/tfvjsonapi.php?search=`;

async function checkTreffle(searchTerm) {
  const response = await fetch(
    `https://trefle.io/api/v1/species/search?q=${searchTerm}&token=${TREFLE_KEY}`
  );
  const json = await response.json();
  return json.data;
}

async function checkTropicalFruits(searchTerm) {
  const response = await fetch(`${tropicalFruitsApi}${searchTerm}`);
  const json = await response.json();
  return json.data;
}

module.exports = async searchTerm => {
  // const { TREFLE_KEY } = process.env;
  try {
    // if (TREFLE_KEY) {
    //   const data = await checkTreffle(searchTerm);
    // }
    const data = await checkTropicalFruits(searchTerm);
  } catch (err) {
    return [];
  }
};
