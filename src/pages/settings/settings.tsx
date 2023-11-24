import { Button, Checkbox, Form, Skeleton } from "antd";
import Title from "antd/es/typography/Title";
import AppBar from "../../components/appBar";
import { useEffect, useState } from "react";

function Settings() {
  const [settings, setSettings] = useState<unknown | null>(null);
  useEffect(() => {
    initSettingsData();
  }, []);

  const criteria = {
    store_reputation: "Độ uy tín của cửa hàng",
    product_features: "Tính năng của sản phẩm",
    product_quality: "Chất lượng của sản phẩm",
    product_suitability: "Sự phù hợp của sản phẩm",
    product_price: "Giá thành của sản phẩm",
    delivery_service: "Dịch vụ giao hàng",
    customer_support_service: "Dịch vụ chăm sóc khác hàng",
    warranty_service: "Dịch vụ bảo hành",
  };

  const initSettingsData = async () => {
    const result = await chrome.storage.local.get(["settings"]);
    setSettings(result.settings);
  };

  const onFinish = async (values: unknown) => {
    console.log("Success:", values);
    await chrome.storage.local.set({ settings: values });
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id as number, {
        action: "reset_shoptimizer",
      });
    });
  };
  if (!settings) {
    return <Skeleton />;
  }
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <AppBar title="Settings"></AppBar>
      <Form
        style={{ paddingLeft: "16px", paddingRight: "16px" }}
        initialValues={settings}
        onFinish={onFinish}
      >
        <Title level={5}>Cài đặt</Title>
        <Form.Item
          name="criteria"
          label="Tiêu chí"
          tooltip="Hãy chọn những tiêu chí mà bạn muốn ưu tiên!"
        >
          <Checkbox.Group style={{ marginLeft: "8px" }}>
            {Object.entries(criteria).map(([key, value]) => (
              <Checkbox value={key} style={{ lineHeight: "28px" }} key={key}>
                {value}{" "}
              </Checkbox>
            ))}
          </Checkbox.Group>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Áp dụng
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default Settings;
