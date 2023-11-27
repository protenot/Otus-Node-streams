const fs = require("fs");
const { Transform, pipeline } = require("stream");
//(async () => {
function extractWords(data) {
  return data
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(" ")
    .filter((word) => word !== "");
}

function countWords(words) {
  const wordCounts = {};
  words.forEach((word) => {
    if (wordCounts[word]) {
      wordCounts[word]++;
    } else {
      wordCounts[word] = 1;
    }
  });

  return Object.entries(wordCounts)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map((entry) => entry[1]);
}

function formatResult(sortedWordCounts) {
  return sortedWordCounts.join(" ");
}
const readStream = fs.createReadStream("input-text", {
  encoding: "utf8",
});
const writeStream = fs.createWriteStream("output-text", {
  encoding: "utf8",
});

const transformStream = new Transform({
  transform(chunk, encoding, callback) {
    const words = extractWords(chunk.toString());
    const counts = countWords(words);
    const resultString = formatResult(counts);
    this.push(resultString);
    callback();
  },
});
pipeline(readStream, transformStream, writeStream, (err) => {
  if (err) {
    console.log("Pipeline failed; " + err);
  } else {
    console.log("Success!!!");
  }
});
