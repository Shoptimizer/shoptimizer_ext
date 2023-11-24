import { ConfigProvider, ThemeConfig } from "antd";
import Settings from "../pages/settings/settings";
import "./App.css";

const theme: ThemeConfig = {
  token: {
    colorPrimary: "#F86310",
  },
};

function App() {
  return (
    <ConfigProvider theme={theme}>
      <Settings></Settings>
    </ConfigProvider>
  );
}

export default App;
