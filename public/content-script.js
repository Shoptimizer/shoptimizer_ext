console.log("XD: Load content script successfully!");

setTimeout(injectCommentBlock, 100);

// Load images path
// eslint-disable-next-line no-undef
var logoUrl = chrome.runtime.getURL("logo.png");

var shoptimizer = document.createElement("div");
shoptimizer.className = "shoptimizer";
shoptimizer.innerHTML = `
<div class="shoptimizer-loading">
  <img src=${logoUrl} style="width:56px; height:56px; padding-right: 12px">
  <div style="font-size:20px">
    Loading
    <span class="dot-one"> .</span>
    <span class="dot-two"> .</span>
    <span class="dot-three"> .</span>
  </div>
</div>
`;

/// Call API and update shoptimizer UI
fetchAIComment();
async function fetchAIComment() {
  try {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    const apiUrl = "https://jsonplaceholder.typicode.com/posts/1";
    var response = await fetch(apiUrl).then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    });
    shoptimizer.innerHTML = `This is the content of the dynamically added child div ${response.body}`;
  } catch (e) {
    shoptimizer.innerHTML = `Error: ${e}`;
  }
}

/// Inject shoptimizer block
async function injectCommentBlock() {
  console.log("Trying to inject shoptimizer block");
  var detailSection = document.getElementsByClassName(
    "flex-auto flex-column  swTqJe"
  )[0];

  var ratingSection = document.getElementsByClassName("h-y3ij")[0];
  if (!detailSection || !ratingSection) {
    setTimeout(injectCommentBlock, 100);
    return;
  }

  console.log(detailSection);
  console.log(ratingSection);

  detailSection.insertBefore(shoptimizer, ratingSection);
}
