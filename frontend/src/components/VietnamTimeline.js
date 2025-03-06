import React, { useState, useEffect } from 'react';
import { Timeline, Card, Typography, Space, Tag, Modal, Spin, Image as AntImage } from 'antd';
import styled from 'styled-components';
import { ClockCircleOutlined, EnvironmentOutlined, RightOutlined } from '@ant-design/icons';
import { vietnamHistoryData } from '../data/vietnamHistory';

const { Title, Paragraph } = Typography;

const TimelineWrapper = styled.div`
  padding: 40px 20px;
  max-width: 1200px;
  margin: 0 auto;
  margin-top: -85px;
  .ant-timeline {
    padding: 40px 0;
  }

  .ant-timeline-item-head {
    width: 20px;
    height: 20px;
    background: #1a237e;
    border-color: #1a237e;
  }

  .ant-timeline-item-tail {
    border-left: 2px solid #e8eaf6;
  }

  .timeline-card {
    width: 100%;
    max-width: 600px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    border-radius: 12px;
    overflow: hidden;
    transition: all 0.3s ease;
    cursor: pointer;

    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 20px rgba(0,0,0,0.15);
    }

    .ant-card-cover img {
      height: 300px;
      object-fit: cover;
    }

    .read-more {
      margin-top: 16px;
      color: #1a237e;
      display: flex;
      align-items: center;
      gap: 8px;
    }
  }

  .period-tag {
    font-size: 16px;
    padding: 4px 12px;
    border-radius: 16px;
  }

  .modal-content {
    max-height: 70vh;
    overflow-y: auto;
    padding: 20px;

    h4 {
      color: #1a237e;
      margin: 20px 0 10px;
    }

    ul {
      margin-left: 20px;
    }

    .sub-event {
      margin: 10px 0;
      padding: 15px;
      background: #f5f5f5;
      border-radius: 8px;
    }
  }
`;

function VietnamTimeline() {
  const [selectedEra, setSelectedEra] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loadedImages, setLoadedImages] = useState({});
  const [loadingModal, setLoadingModal] = useState(false);

  // Chỉ load thumbnail images ban đầu
  useEffect(() => {
    const loadThumbnails = async () => {
      const thumbnailPromises = vietnamHistoryData.map(era => {
        return new Promise((resolve) => {
          const img = new window.Image();
          img.onload = () => {
            setLoadedImages(prev => ({
              ...prev,
              [era.period]: { thumbnail: true }
            }));
            resolve();
          };
          img.src = era.image;
        });
      });

      // Load thumbnails in parallel
      await Promise.all(thumbnailPromises);
    };

    loadThumbnails();
  }, []);

  const loadFullResImage = async (era) => {
    if (!loadedImages[era.period]?.fullRes) {
      setLoadingModal(true);
      
      // Load full resolution image
      await new Promise((resolve) => {
        const img = new window.Image();
        img.onload = () => {
          setLoadedImages(prev => ({
            ...prev,
            [era.period]: { ...prev[era.period], fullRes: true }
          }));
          resolve();
        };
        img.src = era.image;
      });

      setLoadingModal(false);
    }
  };

  const showDetails = async (era) => {
    setSelectedEra(era);
    setModalVisible(true);
    await loadFullResImage(era);
  };

  const renderTimelineItem = (era, index) => (
    <Timeline.Item 
      key={index}
      dot={
        <div 
          style={{ 
            width: '24px', 
            height: '24px', 
            background: '#1a237e',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <ClockCircleOutlined style={{ color: '#fff', fontSize: '12px' }} />
        </div>
      }
    >
      <Tag color="#1a237e" className="period-tag">
        {era.time}
      </Tag>
      <Title level={3} style={{ marginTop: 16 }}>
        {era.period}
      </Title>
      <Card
        className="timeline-card"
        onClick={() => showDetails(era)}
        cover={
          <div style={{ position: 'relative' }}>
            {loadedImages[era.period]?.thumbnail ? (
              <AntImage
                alt={era.period}
                src={era.image}
                preview={false}
              />
            ) : (
              <div style={{ height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Spin />
              </div>
            )}
            <div className="image-overlay">
              <RightOutlined style={{ fontSize: '24px', color: '#fff' }} />
            </div>
          </div>
        }
      >
        <Title level={4}>{era.period}</Title>
        <Paragraph>{era.description}</Paragraph>
        <div className="read-more">
          Xem chi tiết <RightOutlined />
        </div>
      </Card>
    </Timeline.Item>
  );

  return (
    <TimelineWrapper>
      <Title level={1} style={{ textAlign: 'center', marginBottom: 40 }}>
        Dòng thời gian Lịch sử Việt Nam
      </Title>

      <Timeline mode="alternate">
        {vietnamHistoryData.map((era, index) => renderTimelineItem(era, index))}
      </Timeline>

      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span>{selectedEra?.period}</span>
            <Tag color="#1a237e">{selectedEra?.time}</Tag>
          </div>
        }
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedEra && (
          <div className="modal-content">
            {loadingModal ? (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <Spin size="large" />
              </div>
            ) : (
              <>
                <AntImage
                  src={selectedEra.image}
                  alt={selectedEra.period}
                  style={{ width: '100%', marginBottom: '20px', borderRadius: '8px' }}
                />
                <Paragraph>{selectedEra.description}</Paragraph>
                
                <Title level={3} style={{ marginTop: '24px', marginBottom: '16px' }}>
                  Các sự kiện chính
                </Title>
                
                {selectedEra.events.map((event, index) => (
                  <div key={index} className="sub-event">
                    <Title level={4}>{event.title}</Title>
                    <Space style={{ marginBottom: 16 }}>
                      <ClockCircleOutlined />
                      <span>{event.date}</span>
                      <EnvironmentOutlined />
                      <span>{event.location}</span>
                    </Space>
                    <Paragraph>{event.description}</Paragraph>
                    {event.details && (
                      <>
                        <Title level={5}>Chi tiết:</Title>
                        <ul>
                          {event.details.map((detail, i) => (
                            <li key={i}>{detail}</li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </Modal>
    </TimelineWrapper>
  );
}

export default VietnamTimeline; 