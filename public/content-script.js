console.log("XD: Load content script successfully!");

// eslint-disable-next-line no-undef
chrome.runtime.onMessage.addListener(async (message) => {
  if (message.action == "reset_shoptimizer") {
    fetchAIComment();
  }
  return true;
});

setTimeout(injectCommentBlock, 100);

// Load images path
// eslint-disable-next-line no-undef
var logoUrl = chrome.runtime.getURL("logo.png");

var shoptimizer = document.createElement("div");

/// Call API and update shoptimizer UI
fetchAIComment();

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

function showLoading() {
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
}

async function fetchAIComment() {
  try {
    showLoading();
    // eslint-disable-next-line no-undef
    const settings = await chrome.storage.local.get(["settings"]);
    console.log(settings);
    await new Promise((resolve) => setTimeout(resolve, 3000));
    const apiUrl = "https://jsonplaceholder.typicode.com/posts/1";
    var response = await fetch(apiUrl).then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    });
    shoptimizer.innerHTML = `This is the content of the dynamically added child div ${response.body}`;
    const maxShoptimizerPoint = 5;
    const shoptimizerPoint = 4;
    const shoptimizerReview = "ngon bo re";
    const summary = {
      shop: {
        rating: 3,
        review: "Oke em",
      },
      product: {
        rating: 3,
        review: "Oke em 2",
      },
      service: {
        rating: 3,
        review: "Oke em 2",
      },
    };

    // Generate points
    const pointElements = `
    ${Array.from({ length: maxShoptimizerPoint }, (_, i) => i).reduce(
      (s, index) =>
        s +
        `
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M13 2L3 14H12L11 22L21 10H12L13 2Z"
            stroke=${index + 1 <= shoptimizerPoint ? `#F86310` : `#998A83`}
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        `,
      ""
    )}
    `;

    shoptimizer.innerHTML = `
    <!-- Shoptimizer info -->
    <div style="display: flex; align-items: center; margin-bottom: 14px">
      <img
        src="${logoUrl}"
        style="width: 52px; height: 52px; margin-right: 16px"
      />
      <div>
        <div style="font-size: 20px">Shoptimizer</div>
        <div style="font-size: 14px">
          Lựa chọn thông minh, mua sắm hiệu quả
        </div>
      </div>
    </div>
    <!-- General info -->
      <div
        style="
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
        "
      >
        <div style="font-size: 20px; font-weight: 600">Tổng quan</div>
        <div style="display: flex; align-items: flex-end">
          <div style="font-size: 20px; font-weight: 600">Điểm shoptimizer</div>
          <div
            style="color: #f86310; font-size: 16px; margin: 0px 12px 0px 12px"
          >
            ${shoptimizerPoint}/${maxShoptimizerPoint}
          </div>
          ${pointElements}
        </div>
      </div>
      <!-- Shop -->
      <div class="general-icon-label">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
        >
          <path
            d="M4.5 1.5L2.25 4.5V15C2.25 15.3978 2.40804 15.7794 2.68934 16.0607C2.97064 16.342 3.35218 16.5 3.75 16.5H14.25C14.6478 16.5 15.0294 16.342 15.3107 16.0607C15.592 15.7794 15.75 15.3978 15.75 15V4.5L13.5 1.5H4.5Z"
            stroke="#2A464B"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M2.25 4.5H15.75"
            stroke="#2A464B"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M12 7.5C12 8.29565 11.6839 9.05871 11.1213 9.62132C10.5587 10.1839 9.79565 10.5 9 10.5C8.20435 10.5 7.44129 10.1839 6.87868 9.62132C6.31607 9.05871 6 8.29565 6 7.5"
            stroke="#2A464B"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <div class="general-label">Cửa hàng: ${summary.shop.rating}/5</div>
      </div>
      <div class="general-info-content">
        ${summary.shop.review}
      </div>
      <!-- Product -->
      <div class="general-icon-label">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
        >
          <path
            d="M12.375 7.05L5.625 3.1575"
            stroke="#2A464B"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M15.75 12V6C15.7497 5.73696 15.6803 5.47861 15.5487 5.25087C15.417 5.02314 15.2278 4.83402 15 4.7025L9.75 1.7025C9.52197 1.57085 9.2633 1.50154 9 1.50154C8.7367 1.50154 8.47803 1.57085 8.25 1.7025L3 4.7025C2.7722 4.83402 2.58299 5.02314 2.45135 5.25087C2.31971 5.47861 2.25027 5.73696 2.25 6V12C2.25027 12.263 2.31971 12.5214 2.45135 12.7491C2.58299 12.9769 2.7722 13.166 3 13.2975L8.25 16.2975C8.47803 16.4292 8.7367 16.4985 9 16.4985C9.2633 16.4985 9.52197 16.4292 9.75 16.2975L15 13.2975C15.2278 13.166 15.417 12.9769 15.5487 12.7491C15.6803 12.5214 15.7497 12.263 15.75 12Z"
            stroke="#2A464B"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M2.4525 5.22L9 9.0075L15.5475 5.22"
            stroke="#2A464B"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M9 16.56V9"
            stroke="#2A464B"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <div class="general-label">Sản phẩm: ${summary.product.rating}/5</div>
      </div>
      <div class="general-info-content">
        ${summary.product.review}
      </div>
      <!-- Service -->
      <div class="general-icon-label">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
        >
          <g clip-path="url(#clip0_16_10)">
            <path
              d="M12 2.25H0.75V12H12V2.25Z"
              stroke="#2A464B"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M12 6H15L17.25 8.25V12H12V6Z"
              stroke="#2A464B"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M4.125 15.75C5.16053 15.75 6 14.9105 6 13.875C6 12.8395 5.16053 12 4.125 12C3.08947 12 2.25 12.8395 2.25 13.875C2.25 14.9105 3.08947 15.75 4.125 15.75Z"
              stroke="#2A464B"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M13.875 15.75C14.9105 15.75 15.75 14.9105 15.75 13.875C15.75 12.8395 14.9105 12 13.875 12C12.8395 12 12 12.8395 12 13.875C12 14.9105 12.8395 15.75 13.875 15.75Z"
              stroke="#2A464B"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </g>
          <defs>
            <clipPath id="clip0_16_10">
              <rect width="18" height="18" fill="white" />
            </clipPath>
          </defs>
        </svg>
        <div class="general-label">Dịch vụ: ${summary.service.rating}/5</div>
      </div>
      <div class="general-info-content">
        ${summary.service.review}
      </div>
      <!-- Shoptimizer feedbacks -->
      <div style="font-size: 16px; font-weight: 400; margin-bottom: 12px">
        <span style="font-weight: 600">Đánh giả của Shoptimizer:</span> ${shoptimizerReview}
      </div>
      <div
        style="border: 0.5px #d5d3d2 solid; margin: 12px 16px 12px 16px"
      ></div>
      <!-- Advance options -->
      <div style="font-size: 20px; font-weight: 600">Tùy chọn nâng cao</div>
      <div style="margin: 8px 0px 8px 0px">
        Hãy chọn những tiêu chí mà bạn muốn ưu tiên
      </div>
      <div>
        <input type="checkbox" id="1" name="1" value="1" />
        <label for="1">Độ uy tín của cửa hàng</label><br />
        <input type="checkbox" id="1" name="1" value="1" />
        <label for="1">Tính năng của sản phẩm</label><br />
        <input type="checkbox" id="1" name="1" value="1" />
        <label for="1">Chất lượng của sản phẩm</label><br />
        <input type="checkbox" id="1" name="1" value="1" />
        <label for="1">Sự phù hợp của sản phẩm</label><br />
        <input type="checkbox" id="1" name="1" value="1" />
        <label for="1">Giá thành của sản phẩm</label><br />
        <input type="checkbox" id="1" name="1" value="1" />
        <label for="1">Dịch vụ giao hàng</label><br />
        <input type="checkbox" id="1" name="1" value="1" />
        <label for="1">Dịch vụ chăm sóc khác hàng</label><br />
        <input type="checkbox" id="1" name="1" value="1" />
        <label for="1">Dịch vụ bảo hành</label><br />
        <button
          type="button"
          style="
            height: 36px;
            width: 120px;
            background: #f86310;
            border-radius: 12px;
            border: none;
            margin-top: 12px;
          "
        >
          <div style="color: #fff">Shoptimize</div>
        </button>
      </div>
    `;
  } catch (e) {
    shoptimizer.innerHTML = `Error: ${e}`;
  }
}
