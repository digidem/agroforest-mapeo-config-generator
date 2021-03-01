const fs = require("fs");
const path = require("path");
const slugify = require("@sindresorhus/slugify");
// const { optimize } = require("svgo");
const util = require("util");
const exec = util.promisify(require("child_process").exec);

async function run() {
  const dirs = fs.readdirSync("pre-icons");
  let processed = {
    done: 0,
    errored: 0
  };
  for await (let dir of dirs) {
    const slugTerm = slugify(dir);
    const icons = fs.readdirSync(`pre-icons/${dir}`);
    if (icons.length > 0) {
      const fileFrom = path.join(process.cwd(), `pre-icons/${dir}/${icons[0]}`);
      const fileTo100 = path.join(process.cwd(), `icons/${slugTerm}-100px.svg`);
      const fileTo24 = `icons/${slugTerm}-24px.svg`;
      await exec(
        `rsvg-convert -f svg -w 100 -h 100 ${fileFrom} -o ${fileTo100}`
      );
      await exec(`rsvg-convert -f svg -w 24 -h 24 ${fileFrom} -o ${fileTo24}`);
      processed.done++;
      // const result100 = optimize(fileTo100, {
      //   path: fileTo100,
      //   multipass: true,
      // });
      // if (result100.error) {
      //   console.log(result100.error);
      //   processed.errored++;
      // } else {
      //   processed.done++;
      //   const optimizedSvgString = result100.data;
      //   console.log(
      //     "🚀 ~ file: updateIcons.js ~ line 25 ~ forawait ~ optimizedSvgString",
      //     optimizedSvgString
      //   );
      // }
    }
  }
  console.log("Done, processed", processed.done);
  console.log("and errored", processed.errored);
}

run();
