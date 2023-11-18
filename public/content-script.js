console.log("XD: Load content script successfully!");

setTimeout(injectCommentBlock, 2000);

function injectCommentBlock() {
  console.log("injectCommentBlock");
  var detailSection = document.getElementsByClassName(
    "flex-auto flex-column  swTqJe"
  )[0];
  var ratingSection = document.getElementsByClassName("h-y3ij")[0];
  console.log(detailSection);
  console.log(ratingSection);
  var content = document.createElement("div");
  content.className = "shoptimizer";
  content.innerHTML = "This is the content of the dynamically added child div.";
  console.log(detailSection);
  detailSection.insertBefore(content, ratingSection);
}
