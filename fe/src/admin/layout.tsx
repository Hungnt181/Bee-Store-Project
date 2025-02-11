import { Layout, theme } from "antd";
import Sidebar from "./_components/sidebar";
import { Outlet } from "react-router-dom";
import "../assets/Css/Admin/Layout.css";

const { Header, Content, Footer } = Layout;

const App: React.FC = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar />
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }} />
        <Content style={{ margin: "16px" }}>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
              height: "80vh",
            }}
          >
            <Outlet></Outlet>
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Bee-Store ©{new Date().getFullYear()} Created by WD-25
        </Footer>
      </Layout>
    </Layout>
  );
};

export default App;
