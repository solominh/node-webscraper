const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs-extra");

async function main() {
  const ebookName = "Đấu la đại lục 3";
  await fs.ensureDir(ebookName);

  for (let i = 1; i < 10; i++) {
    const url = `http://truyencv.com/long-vuong-truyen-thuyet/chuong-${i}/`;
    try {
      // Get selected element
      const response = await axios.get(url);
      const $ = cheerio.load(response.data);
      const selector = "#js-truyencv-content";
      let result = $(selector);

      // Clean up
      $("div", result).remove();
      $("p:last-child", result).remove();
      $("p:nth-last-child(1)", result).remove();

      // Save file
      const fileName = `${ebookName}/chương-${i}.html`;
      await fs.writeFile(fileName, result.html());

      console.log(`${fileName} completed`);
    } catch (err) {
      console.log(`${fileName} error`);
      console.log(err);
    }
  }

  console.log("Finished!");
}

main();
