import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Typography, Space, Carousel, Image, Modal, Spin, Input, List, Empty } from 'antd';
import { Link } from 'react-router-dom';
import { HistoryOutlined, SearchOutlined, RobotOutlined, TeamOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import axios from 'axios';
import { message } from 'antd';

const { Title, Paragraph } = Typography;

const HeroSection = styled.div`
  position: relative;
  height: 600px;
  overflow: hidden;
  margin-bottom: 48px;
  margin-top: -85px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.2);

  .hero-content {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.2));
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 40px;
    text-align: left;
    transform: translateY(0);
    transition: all 0.5s ease;

    &:hover {
      background: linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0.3));
      transform: translateY(-10px);
    }
  }

  .ant-carousel {
    height: 100%;
    
    .slick-slide {
      height: 600px;
      overflow: hidden;
      
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transform: scale(1);
        transition: transform 8s ease;

        &:hover {
          transform: scale(1.1);
        }
      }
    }

    .slick-arrow {
      z-index: 2;
      width: 45px;
      height: 45px;
      background: rgba(0,0,0,0.3);
      border-radius: 50%;
      transition: all 0.3s ease;
      opacity: 0;
      display: flex !important;
      align-items: center;
      justify-content: center;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);

      &:hover {
        background: rgba(0,0,0,0.5);
        width: 50px;
        height: 50px;
      }

      &::before {
        font-size: 20px;
        opacity: 0.8;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
      }

      &:hover::before {
        opacity: 1;
      }

      &.slick-prev {
        left: 20px;
      }

      &.slick-next {
        right: 20px;
      }
    }

    &:hover {
      .slick-arrow {
        opacity: 1;
      }
    }

    .slick-dots {
      bottom: 20px;
      z-index: 3;

      li {
        margin: 0 6px;
        
        button {
          width: 30px;
          height: 4px;
          border-radius: 2px;
          background: rgba(255,255,255,0.6);
          transition: all 0.3s ease;
        }

        &.slick-active button {
          width: 50px;
          background: #fff;
        }
      }
    }
  }
`;

const styles = {
  container: {
    padding: '40px 50px 20px',
    maxWidth: 1200,
    margin: '0 auto'
  },
  card: {
    height: '100%',
    transition: 'all 0.3s ease',
    cursor: 'pointer'
  },
  icon: {
    fontSize: '32px',
    color: '#1890ff'
  },
  title: {
    textAlign: 'center',
    marginTop: 16
  },
  description: {
    textAlign: 'center',
    color: '#666'
  }
};

// Thêm hàm preloadImage để tải trước hình ảnh
const preloadImage = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = url;
    img.onload = resolve;
    img.onerror = reject;
  });
};

function Home() {
  const [historicalSites, setHistoricalSites] = useState([]);
  const [selectedSite, setSelectedSite] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [wikiData, setWikiData] = useState(null);
  const [imagesLoaded, setImagesLoaded] = useState(0);
  const [totalImages, setTotalImages] = useState(0);

  const features = [
    {
      icon: <HistoryOutlined style={styles.icon} />,
      title: 'Dòng thời gian',
      description: 'Khám phá các sự kiện lịch sử theo trình tự thời gian',
      link: '/timeline'
    },
    {
      icon: <RobotOutlined style={styles.icon} />,
      title: 'Hỏi đáp AI',
      description: 'Tương tác với AI để tìm hiểu về lịch sử',
      link: '/chat'
    },
    {
      icon: <SearchOutlined style={styles.icon} />,
      title: 'Tìm kiếm',
      description: 'Tìm kiếm thông tin về sự kiện và nhân vật lịch sử',
      link: '/search'
    },
    {
      icon: <TeamOutlined style={styles.icon} />,
      title: 'Nhân vật',
      description: 'Tìm hiểu về các nhân vật lịch sử quan trọng',
      link: '/figures'
    }
  ];

  // Danh sách các địa danh lịch sử và từ khóa tìm kiếm Wikipedia
  const historicalSitesList = [
    {
      title: 'Văn Miếu Quốc Tử Giám',
      searchTerm: 'Văn Miếu Quốc Tử Giám',
      description: 'Trường đại học đầu tiên của Việt Nam, biểu tượng của nền giáo dục nước nhà'
    },
    {
      title: 'Kinh thành Huế',
      searchTerm: 'Kinh thành Huế',
      description: 'Di sản văn hóa thế giới, nơi lưu giữ những giá trị lịch sử của triều Nguyễn'
    },
    {
      title: 'Thành cổ Hoa Lư',
      searchTerm: 'Thành cổ Hoa Lư',
      description: 'Kinh đô đầu tiên của nước Đại Cồ Việt, minh chứng cho sự phát triển của dân tộc'
    },
    {
      title: 'Đền Hùng',
      searchTerm: 'Đền Hùng',
      description: 'Nơi thờ các vua Hùng - Tổ tiên của dân tộc Việt, biểu tượng của nguồn cội'
    },
    {
      title: 'Hoàng thành Thăng Long',
      searchTerm: 'Hoàng thành Thăng Long',
      description: 'Di sản văn hóa thế giới, minh chứng cho nền văn minh lúa nước'
    }
  ];

  useEffect(() => {
    fetchHistoricalSitesData();
  }, []);

  useEffect(() => {
    if (totalImages > 0 && imagesLoaded === totalImages) {
      setTimeout(() => setLoading(false), 500);
    }
  }, [imagesLoaded, totalImages]);

  const fetchHistoricalSitesData = async () => {
    try {
      const promises = historicalSitesList.map(site => 
        fetchWikipediaData(site.searchTerm)
      );
      
      const results = await Promise.all(promises);
      
      const sitesWithImages = results
        .map((wikiData, index) => {
          if (!wikiData) return null;
          return {
            ...historicalSitesList[index],
            wikiImage: wikiData.image,
            wikiExtract: wikiData.extract
          };
        })
        .filter(Boolean);

      setTotalImages(sitesWithImages.length);
      setHistoricalSites(sitesWithImages);
      
      sitesWithImages.forEach(site => {
        const img = new Image();
        img.src = site.wikiImage;
        img.onload = () => {
          setImagesLoaded(prev => prev + 1);
        };
        img.onerror = () => {
          console.error(`Failed to load image: ${site.wikiImage}`);
          setImagesLoaded(prev => prev + 1);
        };
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const fetchWikipediaData = async (searchTerm) => {
    try {
      // Tối ưu query Wikipedia để lấy ít dữ liệu hơn
      const searchUrl = 'https://vi.wikipedia.org/w/api.php?' + 
        new URLSearchParams({
          action: 'query',
          list: 'search',
          srsearch: searchTerm,
          format: 'json',
          origin: '*',
          utf8: '1',
          srlimit: '1' // Chỉ lấy kết quả đầu tiên
        }).toString();

      const searchResponse = await axios.get(searchUrl);
      
      if (!searchResponse.data?.query?.search?.[0]) {
        return null;
      }

      const pageId = searchResponse.data.query.search[0].pageid;
      
      // Tối ưu query nội dung
      const contentUrl = 'https://vi.wikipedia.org/w/api.php?' + 
        new URLSearchParams({
          action: 'query',
          pageids: pageId,
          prop: 'extracts|pageimages',
          exintro: '1',
          format: 'json',
          origin: '*',
          piprop: 'original',
          explaintext: '1'
        }).toString();

      const contentResponse = await axios.get(contentUrl);
      const page = contentResponse.data.query.pages[pageId];

      return {
        title: page.title,
        extract: page.extract,
        image: page.original?.source
      };
    } catch (error) {
      console.error('Error fetching Wikipedia data:', error);
      return null;
    }
  };

  const handleSiteClick = async (site) => {
    setSelectedSite(site);
    setModalVisible(true);
    setLoading(true);

    try {
      const data = await fetchWikipediaData(site.searchTerm);
      if (data) {
        setWikiData(data);
      }
    } catch (error) {
      console.error('Error fetching site details:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {loading ? (
        <div style={{ 
          height: '100vh', 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          flexDirection: 'column',
          gap: '20px'
        }}>
          <Spin size="large" />
          <Typography.Text>
            Đang tải dữ liệu... ({imagesLoaded}/{totalImages})
          </Typography.Text>
        </div>
      ) : (
        <>
          <HeroSection>
            <Carousel
              autoplay
              effect="fade"
              dots={true}
              arrows={true}
              autoplaySpeed={5000}
              pauseOnHover={true}
            >
              {historicalSites.map((site, index) => (
                <div key={index} onClick={() => handleSiteClick(site)} style={{ cursor: 'pointer' }}>
                  <Image
                    src={site.wikiImage}
                    alt={site.title}
                    preview={false}
                    style={{ display: 'none' }}
                  />
                  <div style={{
                    backgroundImage: `url(${site.wikiImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    height: '600px'
                  }}>
                    <div className="hero-content">
                      <Title style={{ 
                        color: 'white', 
                        marginBottom: 8,
                        fontSize: '2.5rem',
                        textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
                      }}>
                        {site.title}
                      </Title>
                      <Paragraph style={{ 
                        color: 'white', 
                        fontSize: '18px', 
                        opacity: 0.9,
                        maxWidth: '600px',
                        textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
                      }}>
                        {site.description}
                      </Paragraph>
                    </div>
                  </div>
                </div>
              ))}
            </Carousel>
          </HeroSection>

          <Title level={2} style={{ textAlign: 'center', marginBottom: 40 }}>
            Khám phá Lịch sử
          </Title>

          <Row gutter={[24, 24]}>
            {features.map((feature, index) => (
              <Col xs={24} sm={12} md={6} key={index}>
                <Card
                  hoverable
                  style={styles.card}
                  bodyStyle={{ padding: '24px 16px' }}
                  actions={[
                    <Link to={feature.link}>
                      <Button 
                        type="primary" 
                        block
                        onClick={() => {
                          if (feature.title === 'Tìm kiếm') {
                            // Có thể thêm state vào đây nếu cần
                            localStorage.setItem('fromHome', 'true');
                          }
                        }}
                      >
                        Khám phá
                      </Button>
                    </Link>
                  ]}
                >
                  <Space direction="vertical" align="center" style={{ width: '100%' }}>
                    {feature.icon}
                    <Title level={4} style={styles.title}>
                      {feature.title}
                    </Title>
                    <Paragraph style={styles.description}>
                      {feature.description}
                    </Paragraph>
                  </Space>
                </Card>
              </Col>
            ))}
          </Row>
        </>
      )}

      <Modal
        title={selectedSite?.title}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={800}
      >
        {loading ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <Space direction="vertical">
              Loading...
            </Space>
          </div>
        ) : (
          <div>
            {wikiData?.image && (
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <Image
                  src={wikiData.image}
                  alt={selectedSite?.title}
                  style={{ maxWidth: '100%', maxHeight: '400px', objectFit: 'contain' }}
                />
              </div>
            )}
            {wikiData?.extract && (
              <Paragraph style={{ textAlign: 'justify' }}>
                {wikiData.extract}
              </Paragraph>
            )}
            <div style={{ marginTop: '20px', textAlign: 'right' }}>
              <a
                href={`https://vi.wikipedia.org/wiki/${encodeURIComponent(wikiData?.title || '')}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Xem thêm trên Wikipedia
              </a>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default Home; 