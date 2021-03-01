const fetch = require("node-fetch");

module.exports = async searchTerm => {
  const { TREFLE_KEY } = process.env;
  if (!TREFLE_KEY) throw Error("TREFLE_KEY is needed");
  try {
    const response = await fetch(
      `https://trefle.io/api/v1/species/search?q=${searchTerm}&token=${TREFLE_KEY}`
    );
    const json = await response.json();
    return json.data;
  } catch (err) {
    return [];
  }
};
