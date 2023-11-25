console.log("XD: Load content script successfully!");

// Listen UI change
const observer = new MutationObserver(function (mutations) {
  mutations.forEach(function (mutation) {
    console.log(`Xduck ${injectLoop} ${mutation.type}`);
    console.log(mutation.target);
    // loop = 0;
    if (fnInjectShoptimizerBlock == null) {
      setTimeout(injectShoptimizerBlock, 100);
    }
  });
});
observer.observe(document.body, {
  attributes: true, //configure it to listen to attribute changes
});

// eslint-disable-next-line no-undef
chrome.runtime.onMessage.addListener(async (message) => {
  if (message.action == "reset_shoptimizer") {
    fetchAIComment();
  }
  return true;
});

// Load images path
// eslint-disable-next-line no-undef
const logoUrl = chrome.runtime.getURL("logo.png");
const BASE_URL = "http://localhost:8765";
const shoptimizer = document.createElement("div");
shoptimizer.className = "shoptimizer";

/// Inject shoptimizer block
var injectLoop = 0;
var fnInjectShoptimizerBlock = injectShoptimizerBlock;
fnInjectShoptimizerBlock();
async function injectShoptimizerBlock() {
  if (injectLoop >= 100) {
    console.log("Inject shoptimizer failed");
    injectLoop = 0;
    return;
  }
  console.log("Trying to inject shoptimizer block");
  var detailSection = document.evaluate(
    `/html/body/div[1]/div/div[2]/div[1]/div[1]/div/div[2]/section[1]/section[2]/div`,
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  ).singleNodeValue;

  var ratingSection = document.evaluate(
    `/html/body/div[1]/div/div[2]/div[1]/div[1]/div/div[2]/section[1]/section[2]/div/div[4]`,
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  ).singleNodeValue;

  if (!detailSection || !ratingSection) {
    injectLoop += 1;
    setTimeout(injectShoptimizerBlock, 100);
    return;
  }
  injectLoop = 0;
  fnInjectShoptimizerBlock = null;

  console.log(detailSection);
  console.log(ratingSection);

  detailSection.insertBefore(shoptimizer, ratingSection);
  /// Call API and update shoptimizer UI
  fetchAIComment();
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
    // await new Promise((resolve) => setTimeout(resolve, 1000));
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
    // console.log(response);
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

    const flashFillIcon = `
    <svg width="16" height="22" viewBox="0 0 16 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7.11004 22C6.99409 21.9999 6.87904 21.9796 6.77004 21.94C6.55979 21.863 6.38146 21.7177 6.2636 21.5273C6.14575 21.3369 6.0952 21.1125 6.12004 20.89L6.89004 13.8H1.00004C0.818374 13.8003 0.640062 13.7511 0.484258 13.6576C0.328454 13.5642 0.201044 13.4301 0.115713 13.2697C0.0303813 13.1093 -0.00964765 12.9287 -7.55173e-05 12.7473C0.00949662 12.5659 0.0683084 12.3905 0.170044 12.24L8.06004 0.440006C8.18483 0.255344 8.36773 0.11766 8.5797 0.0488147C8.79167 -0.0200307 9.02057 -0.0160921 9.23004 0.0600055C9.43142 0.134769 9.60338 0.27239 9.72044 0.452496C9.83751 0.632601 9.89347 0.845616 9.88004 1.06001L9.11004 8.20001H15C15.1817 8.19973 15.36 8.24895 15.5158 8.34238C15.6716 8.43581 15.799 8.56992 15.8844 8.7303C15.9697 8.89068 16.0097 9.07128 16.0002 9.25269C15.9906 9.43411 15.9318 9.60949 15.83 9.76001L7.94004 21.56C7.84831 21.6957 7.72465 21.8068 7.57993 21.8835C7.4352 21.9603 7.27385 22.0003 7.11004 22Z" fill="#F86310"/>
    </svg>
    `;
    const flashHalfFillIcon = `
    <svg width="16" height="22" viewBox="0 0 16 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7.11004 22C6.99409 21.9999 6.87904 21.9796 6.77004 21.94C6.55979 21.863 6.38146 21.7177 6.2636 21.5273C6.14575 21.3369 6.0952 21.1125 6.12004 20.89L6.89004 13.8H1.00004C0.818374 13.8003 0.640062 13.7511 0.484258 13.6576C0.328454 13.5642 0.201044 13.4301 0.115713 13.2697C0.0303813 13.1093 -0.00964765 12.9287 -7.55173e-05 12.7473C0.00949662 12.5659 0.0683084 12.3905 0.170044 12.24L8.06004 0.440006C8.18483 0.255344 8.36773 0.11766 8.5797 0.0488147C8.79167 -0.0200307 9.02057 -0.0160921 9.23004 0.0600055C9.43142 0.134769 9.60338 0.27239 9.72044 0.452496C9.83751 0.632601 9.89347 0.845616 9.88004 1.06001L9.11004 8.20001H15C15.1817 8.19973 15.36 8.24895 15.5158 8.34238C15.6716 8.43581 15.799 8.56992 15.8844 8.7303C15.9697 8.89068 16.0097 9.07128 16.0002 9.25269C15.9906 9.43411 15.9318 9.60949 15.83 9.76001L7.94004 21.56C7.84831 21.6957 7.72465 21.8068 7.57993 21.8835C7.4352 21.9603 7.27385 22.0003 7.11004 22ZM2.87004 11.8H8.00004C8.13959 11.8003 8.27752 11.8299 8.40496 11.8867C8.53241 11.9435 8.64655 12.0264 8.74004 12.13C8.83441 12.235 8.90548 12.3588 8.94857 12.4932C8.99166 12.6277 9.00579 12.7697 8.99004 12.91L8.54004 17.06L13.13 10.2H8.00004C7.85893 10.2009 7.71923 10.1718 7.59014 10.1149C7.46104 10.0579 7.34547 9.9742 7.25101 9.86936C7.15656 9.76452 7.08536 9.64087 7.04211 9.50655C6.99885 9.37222 6.98452 9.23026 7.00004 9.09001L7.45004 4.94001L2.87004 11.8Z" fill="#F86310"/>
      <path d="M9.20609 1.47343L8.73775 14.0033L1.98624 11.7248L9.20609 1.47343Z" fill="#F86310"/>
      <path d="M9.36239 9.21214L8.91117 13.6254L5.73743 11.7695L9.36239 9.21214Z" fill="#F86310"/>
    </svg>
    `;
    const flashIcon = `
    <svg width="16" height="22" viewBox="0 0 16 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7.10998 22C6.99403 21.9999 6.87898 21.9796 6.76998 21.94C6.55973 21.863 6.38139 21.7177 6.26354 21.5273C6.14569 21.3369 6.09514 21.1125 6.11998 20.89L6.88998 13.8H0.999982C0.818313 13.8003 0.640001 13.7511 0.484197 13.6576C0.328393 13.5642 0.200983 13.4301 0.115652 13.2697C0.0303203 13.1093 -0.00970869 12.9287 -0.000136552 12.7473C0.00943558 12.5659 0.0682474 12.3905 0.169982 12.24L8.05998 0.44C8.18477 0.255338 8.36767 0.117654 8.57964 0.048809C8.79161 -0.0200364 9.02051 -0.0160978 9.22998 0.0599998C9.43136 0.134763 9.60331 0.272384 9.72038 0.45249C9.83745 0.632595 9.89341 0.845611 9.87998 1.06L9.10998 8.2H15C15.1817 8.19973 15.36 8.24895 15.5158 8.34237C15.6716 8.4358 15.799 8.56991 15.8843 8.73029C15.9696 8.89067 16.0097 9.07127 16.0001 9.25269C15.9905 9.43411 15.9317 9.60949 15.83 9.76L7.93998 21.56C7.84825 21.6957 7.72459 21.8068 7.57987 21.8835C7.43514 21.9603 7.27378 22.0002 7.10998 22ZM2.86998 11.8H7.99998C8.13953 11.8003 8.27746 11.8299 8.4049 11.8867C8.53235 11.9435 8.64649 12.0264 8.73998 12.13C8.83435 12.235 8.90542 12.3588 8.94851 12.4932C8.9916 12.6277 9.00573 12.7697 8.98998 12.91L8.53998 17.06L13.13 10.2H7.99998C7.85887 10.2009 7.71917 10.1718 7.59008 10.1149C7.46098 10.0579 7.3454 9.9742 7.25095 9.86935C7.1565 9.76451 7.0853 9.64086 7.04205 9.50654C6.99879 9.37222 6.98446 9.23026 6.99998 9.09L7.44998 4.94L2.86998 11.8Z" fill="#969696"/>
    </svg>
    
    `;

    // Generate points
    const pointElements = `
    ${Array.from({ length: maxShoptimizerPoint }, (_, i) => i).reduce(
      (s, index) =>
        s +
        (shoptimizerPoint >= index + 0.75
          ? flashFillIcon
          : shoptimizerPoint > index + 0.25
          ? flashHalfFillIcon
          : flashIcon),
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
