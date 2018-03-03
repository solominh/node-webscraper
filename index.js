const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs-extra");

async function main() {
  const ebookName = "Đấu la đại lục 3";
  await fs.ensureDir(ebookName);

  for (let i = 1; i < 1633; i++) {
    const url = `http://truyencv.com/long-vuong-truyen-thuyet/chuong-${i}/`;
    try {
      // Get selected element
      const response = await axios.get(url);
      const $ = cheerio.load(response.data);
      const selector = "#js-truyencv-read-content";
      let result = $(selector);

      // Clean up
      $("#favorite_video", result).remove();
      $(".footer", result).remove();
      const header = $("h2", ".header", result);
      const content = $("#js-truyencv-content", result);
      content.removeAttr("style").removeAttr("id")
      $("div", content).remove();
      $("p:last-child", content).remove();
      $("p:nth-last-child(1)", content).remove();
      result.empty().append(header).append(content)

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
