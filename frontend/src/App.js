import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout, ConfigProvider } from 'antd';
import Navbar from './components/Navbar';
import Home from './components/Home';
import DynastyList from './components/DynastyList';
import VietnamTimeline from './components/VietnamTimeline';
import AIChatbot from './components/AIChatbot';
import Search from './components/Search';
import Figures from './components/Figures';
import Generals from './pages/Generals';
import Battles from './components/Battles';
import Videos from './components/Videos';
import Scholars from './components/Scholars';

const { Content, Footer } = Layout;

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1890ff',
          borderRadius: 8,
        },
      }}
    >
      <Router>
        <Layout>
          <Navbar />
          <Content>
            <div style={{ paddingTop: '64px' }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/dynasties" element={<DynastyList />} />
                <Route path="/timeline/vietnam" element={<VietnamTimeline />} />
                <Route path="/figures" element={<Figures />} />
                <Route path="/figures/scholars" element={<Scholars />} />
                <Route path="/chat" element={<AIChatbot />} />
                <Route path="/search" element={<Search />} />
                <Route path="/generals" element={<Generals />} />
                <Route path="/battles" element={<Battles />} />
                <Route path="/videos" element={<Videos />} />
              </Routes>
            </div>
          </Content>
          <Footer style={{ textAlign: 'center', background: '#f0f2f5' }}>
            <div style={{ maxWidth: 800, margin: '0 auto' }}>
              <h3>Về chúng tôi</h3>
              <p>
                Trang web tra cứu lịch sử với sự hỗ trợ của AI, giúp bạn tìm hiểu
                về lịch sử Việt Nam và Thế giới một cách dễ dàng và thú vị.
              </p>
              <p>©{new Date().getFullYear()} Tra cứu Lịch sử. All Rights Reserved.</p>
            </div>
          </Footer>
        </Layout>
      </Router>
    </ConfigProvider>
  );
}

export default App; 