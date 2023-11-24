import { theme } from "antd";
import Title from "antd/es/typography/Title";

const { useToken } = theme;

type Props = {
  title: string;
};

function AppBar({ title }: Props) {
  const { token } = useToken();

  return (
    <div
      style={{
        minHeight: "52px",
        backgroundColor: token.colorPrimary,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Title level={4} style={{ margin: "0px", color: token.colorWhite }}>
        {title}
      </Title>
    </div>
  );
}
export default AppBar;
