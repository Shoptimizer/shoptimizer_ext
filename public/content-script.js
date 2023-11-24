console.log("XD: Load content script successfully!");

// eslint-disable-next-line no-undef
chrome.runtime.onMessage.addListener(async (message) => {
  if (message.action == "reset_shoptimizer") {
    fetchAIComment();
  }
  return true;
});

setTimeout(injectShoptimizerBlock, 100);

// Load images path
// eslint-disable-next-line no-undef
const logoUrl = chrome.runtime.getURL("logo.png");
const BASE_URL = "http://localhost:8765";
const shoptimizer = document.createElement("div");
shoptimizer.className = "shoptimizer";

/// Call API and update shoptimizer UI
fetchAIComment();

/// Inject shoptimizer block
async function injectShoptimizerBlock() {
  console.log("Trying to inject shoptimizer block");
  var detailSection = document.getElementsByClassName(
    "flex-auto flex-column  swTqJe"
  )[0];

  var ratingSection = document.getElementsByClassName("h-y3ij")[0];
  if (!detailSection || !ratingSection) {
    setTimeout(injectShoptimizerBlock, 100);
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
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url: window.location.href }),
    };
    const apiUrl = `${BASE_URL}/shoptimizer`;
    const response = await fetch(apiUrl, requestOptions).then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    });
    // await new Promise((resolve) => setTimeout(resolve, 3000));
    // const response = {
    //   shoptimizer_rating: 4.5,
    //   online_shop: {
    //     summary:
    //       "Cửa hàng Gấu bông zhakuzu có độ uy tín cao với số sao là 4.916783*. Cửa hàng này có số lượng khách hàng phản hồi tốt là 6634 người và số lượng theo dõi là 14816 người. Tuy nhiên, cửa hàng cũng có một số khách hàng phản hồi tệ là 40 người. Tỷ lệ phản hồi của cửa hàng là 62%.",
    //     rating: 4.5,
    //   },
    //   products: {
    //     summary:
    //       "Sản phẩm Gấu bông Vịt bông trầm cảm Vịt mệt mỏi size 1m8 của cửa hàng có chất lượng sản phẩm tốt. Các khách hàng đánh giá sản phẩm này là dễ thương, mềm và siêu mềm. Sản phẩm được đóng gói chắc chắn và giao hàng nhanh. Tuy nhiên, có một số khách hàng phản hồi rằng kích thước sản phẩm không đúng như mô tả. Đề nghị khách hàng cân nhắc trước khi mua sản phẩm này. Khoảng thời gian gần nhất để mua sản phẩm này là vào tháng 9.",
    //     rating: 4.5,
    //     advice:
    //       "Khách hàng nên cân nhắc kích thước sản phẩm trước khi mua. Đặc biệt, khách hàng nên mua sản phẩm này vào tháng 9 để được hưởng ưu đãi lớn nhất.",
    //   },
    //   services: {
    //     summary:
    //       "Dịch vụ của cửa hàng Gấu bông zhakuzu được đánh giá là chất lượng. Có nhiều khách hàng đánh giá rằng dịch vụ giao hàng nhanh và đóng gói đẹp. Tuy nhiên, không có đánh giá cụ thể về dịch vụ chăm sóc khách hàng và dịch vụ bảo hành. Đề nghị khách hàng cân nhắc trước khi sử dụng dịch vụ của cửa hàng này.",
    //     rating: 4.5,
    //     advice:
    //       "Khách hàng nên cân nhắc trước khi sử dụng dịch vụ của cửa hàng này. Đề nghị liên hệ trực tiếp với cửa hàng để biết thêm thông tin về dịch vụ chăm sóc khách hàng và dịch vụ bảo hành.",
    //   },
    //   summary:
    //     "Cửa hàng Gấu bông zhakuzu có độ uy tín cao với số sao là 4.916783*. Sản phẩm Gấu bông Vịt bông trầm cảm Vịt mệt mỏi size 1m8 của cửa hàng có chất lượng sản phẩm tốt. Dịch vụ của cửa hàng được đánh giá là chất lượng. Tuy nhiên, cần cân nhắc kích thước sản phẩm trước khi mua và liên hệ trực tiếp với cửa hàng để biết thêm thông tin về dịch vụ chăm sóc khách hàng và dịch vụ bảo hành. Đề nghị khách hàng nên mua sản phẩm vào tháng 9 để được hưởng ưu đãi lớn nhất.",
    //   rating: 4.5,
    // };
    console.log(response);
    shoptimizer.innerHTML = `This is the content of the dynamically added child div ${response.body}`;
    const maxShoptimizerPoint = 5;
    const shoptimizerPoint = response.shoptimizer_rating;
    const shoptimizerReview = response.summary;
    const summary = {
      shop: {
        rating: response.online_shop.rating,
        review: response.online_shop.summary,
      },
      product: {
        rating: response.products.rating,
        review: response.products.summary,
      },
      service: {
        rating: response.services.rating,
        review: response.services.summary,
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
        style="width: 48px; height: 48px; margin-right: 16px"
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
          margin-bottom: 10px;
        "
      >
        <div style="font-size: 20px; font-weight: 500">Tổng quan</div>
        <div style="display: flex; align-items: flex-end">
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
      <div class="shoptimizer-summary">
        <span style="font-weight: 600">Tổng kết:</span> ${shoptimizerReview}
      </div>
    `;
  } catch (e) {
    console.log(e);
    shoptimizer.innerHTML = `Error: ${e}`;
  }
}
