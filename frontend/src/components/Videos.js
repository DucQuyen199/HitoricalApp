import React, { useState } from 'react';
import { Typography, Row, Col, Card, Modal } from 'antd';
import styled from 'styled-components';
import { PlayCircleOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const VideosWrapper = styled.div`
  padding: 20px 20px;
  max-width: 1200px;
  margin: 0 auto;
  margin-top: -85px;

  .video-card {
    margin-bottom: 24px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    border-radius: 12px;
    overflow: hidden;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 20px rgba(0,0,0,0.15);
    }

    .ant-card-cover {
      position: relative;
      
      &:before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.3);
        opacity: 0;
        transition: opacity 0.3s ease;
      }

      .play-icon {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 48px;
        color: white;
        opacity: 0;
        transition: all 0.3s ease;
      }
    }

    &:hover {
      .ant-card-cover {
        &:before {
          opacity: 1;
        }
        .play-icon {
          opacity: 1;
        }
      }
    }
  }

  .video-modal {
    .ant-modal-content {
      background: #000;
      padding: 0;
      overflow: hidden;
      border-radius: 12px;
    }
    
    .ant-modal-close {
      color: white;
      top: -30px;
      right: -30px;
      
      .ant-modal-close-x {
        font-size: 24px;
        width: 24px;
        height: 24px;
        line-height: 24px;
      }
    }

    .ant-modal-body {
      padding: 0;
      line-height: 0;
      height: calc(100vh - 100px);
    }

    iframe {
      width: 100%;
      height: 100%;
      border: none;
    }
  }

  @media (max-width: 768px) {
    .video-modal {
      .ant-modal-body {
        height: calc(100vh - 60px);
      }
      
      .ant-modal-close {
        top: 10px;
        right: 10px;
      }
    }
  }
`;

const videoData = [
  {
    id: 1,
    title: "Tóm tắt 4000 năm lịch sử Việt",
    thumbnail: "https://img.youtube.com/vi/ecaGt5dfxu4/maxresdefault.jpg",
    url: "https://www.youtube.com/watch?v=ecaGt5dfxu4",
    embedId: "ecaGt5dfxu4"
  },
  {
    id: 2,
    title: "Full Lịch Sử Việt Nam",
    thumbnail: "https://img.youtube.com/vi/RjCWU2RDEh4/maxresdefault.jpg",
    url: "https://www.youtube.com/watch?v=RjCWU2RDEh4",
    embedId: "RjCWU2RDEh4"
  },
  {
    id: 3,
    title: "Nhà Lý",
    thumbnail: "https://img.youtube.com/vi/rf21Jh-XDCc/maxresdefault.jpg",
    url: "https://www.youtube.com/watch?v=rf21Jh-XDCc",
    embedId: "rf21Jh-XDCc"
  },
  {
    id: 4,
    title: "Nhà Trần",
    thumbnail: "https://img.youtube.com/vi/t3ID4gc7LVE/maxresdefault.jpg",
    url: "https://www.youtube.com/watch?v=t3ID4gc7LVE",
    embedId: "t3ID4gc7LVE"
  },
  {
    id: 5,
    title: "Nhà Lê Sơ",
    thumbnail: "https://img.youtube.com/vi/nSi2t1RwCn4/maxresdefault.jpg",
    url: "https://www.youtube.com/watch?v=nSi2t1RwCn4",
    embedId: "nSi2t1RwCn4"
  },
  {
    id: 6,
    title: "Nhà Nguyễn",
    thumbnail: "https://img.youtube.com/vi/96SVntYMrPk/maxresdefault.jpg",
    url: "https://www.youtube.com/watch?v=96SVntYMrPk",
    embedId: "96SVntYMrPk"
  },
  {
    id: 7,
    title: "Nhà Mạc",
    thumbnail: "https://img.youtube.com/vi/lLM66rDMpl0/maxresdefault.jpg",
    url: "https://www.youtube.com/watch?v=lLM66rDMpl0",
    embedId: "lLM66rDMpl0"
  },
  {
    id: 8,
    title: "Nhà Ngô - Đinh - Lê",
    thumbnail: "https://img.youtube.com/vi/38EYR_8uoiI/maxresdefault.jpg",
    url: "https://www.youtube.com/watch?v=38EYR_8uoiI",
    embedId: "38EYR_8uoiI"
  }
];

function Videos() {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleVideoClick = (video) => {
    setSelectedVideo(video);
    setModalVisible(true);
  };

  return (
    <VideosWrapper>
      <Title level={1} style={{ textAlign: 'center', marginBottom: 30 }}>
        Video Lịch Sử
      </Title>
      <Paragraph style={{ textAlign: 'center', marginBottom: 40 }}>
        Khám phá lịch sử Việt Nam qua các video tài liệu
      </Paragraph>

      <Row gutter={[24, 24]}>
        {videoData.map(video => (
          <Col xs={24} sm={12} lg={8} key={video.id}>
            <Card
              hoverable
              className="video-card"
              cover={
                <div style={{ position: 'relative' }}>
                  <img
                    alt={video.title}
                    src={video.thumbnail}
                    style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                  />
                  <PlayCircleOutlined className="play-icon" />
                </div>
              }
              onClick={() => handleVideoClick(video)}
            >
              <Card.Meta
                title={video.title}
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Modal
        title={null}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setSelectedVideo(null);
        }}
        footer={null}
        width="90vw"
        style={{ 
          top: 20,
          padding: 0,
          maxWidth: '1400px',
          margin: '0 auto'
        }}
        className="video-modal"
        destroyOnClose
        centered
      >
        {selectedVideo && (
          <iframe
            src={`https://www.youtube.com/embed/${selectedVideo.embedId}?autoplay=1`}
            title={selectedVideo.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{
              width: '100%',
              height: '100%',
              minHeight: '80vh',
            }}
          />
        )}
      </Modal>
    </VideosWrapper>
  );
}

export default Videos; 