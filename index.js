const fs = require("fs");

(async () => {
  const readStream = fs.createReadStream("input-text", {
    encoding: "utf8",
  });
  const writeStream = fs.createWriteStream("output-text", {
    encoding: "utf8",
  });

  const data = await new Promise((resolve, reject) => {
    let result = "";
    readStream.on("data", (chunk) => {
      result += chunk;
    });
    readStream.on("end", () => {
      resolve(result);
    });
    readStream.on("error", (error) => {
      reject(error);
    });
  });

  const words = data
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(" ")
    .filter((word) => word !== "");
  console.log(words);

  const wordCounts = {};
  words.forEach((word) => {
    if (wordCounts[word]) {
      wordCounts[word]++;
    } else {
      wordCounts[word] = 1;
    }
  });
  const sortedWordCounts = Object.entries(wordCounts)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map((entry) => entry[1]);

  console.log(sortedWordCounts);
  const resultString = sortedWordCounts.join(" ");
  writeStream.write(resultString);
  writeStream.end();
  console.log(`Результат ${resultString} и он записан в файл output-text`);
})();
