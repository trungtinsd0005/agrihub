import React, { Fragment } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {routes} from './routes'
import DefaultComponent from "./components/DefaultComponent/DefaultComponent";
import { ConfigProvider } from 'antd';
import PrivateRoute from "./routes/PrivateRoute";
import { Protector } from "./helpers";



 
function App() {

  return (
    <div>
      <Router>
        <Routes>
          {routes.map(route => {
            const Page = route.page
            const Layout = route.isShowHeader ? DefaultComponent : Fragment
            return (
              <Route key={route.path} path={route.path} element={
                <ConfigProvider theme={{ token: { colorPrimary: '#0A923C', fontFamily: 'Be Vietnam Pro, sans-serif' } }}>
                  <Layout>
                    {route.isProtected ? (
                      <Protector Component={<Page />} />
                    ) : route.isPrivate ? (
                      <PrivateRoute element={<Page />} isAdminRequired={route.isAdmin} />
                    ) : (
                        <Page />
                    )}
                  </Layout>
                </ConfigProvider>
              }
              />
            )
          })}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
