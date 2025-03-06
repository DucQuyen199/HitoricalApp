import React, { useState, useEffect } from 'react';
import { Timeline, Card, Image, Spin, Typography, Tag, Space, Button } from 'antd';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ClockCircleOutlined, EnvironmentOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;
const API_URL = process.env.REACT_APP_API_URL;

const styles = {
  container: {
    padding: '80px 50px 20px',
    maxWidth: 1200,
    margin: '0 auto'
  },
  card: {
    maxWidth: 500,
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  image: {
    height: 200,
    objectFit: 'cover'
  },
  title: {
    marginBottom: 16
  },
  meta: {
    color: '#666',
    marginBottom: 8
  },
  description: {
    color: '#333'
  }
};

function HistoricalTimeline() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${API_URL}/events`);
        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: 40 }}>
        Dòng thời gian Lịch sử Việt Nam
      </Title>

      <Timeline mode="alternate">
        {events.map((event) => (
          <Timeline.Item key={event.id}>
            <Card
              hoverable
              style={styles.card}
              cover={
                event.image_url && (
                  <Image
                    alt={event.title}
                    src={event.image_url}
                    style={styles.image}
                  />
                )
              }
            >
              <Link to={`/event/${event.id}`}>
                <Title level={4} style={styles.title}>
                  {event.title}
                </Title>
              </Link>
              
              <Space direction="vertical" size="small" style={{ width: '100%' }}>
                <Space style={styles.meta}>
                  <ClockCircleOutlined />
                  <span>{new Date(event.date).toLocaleDateString('vi-VN')}</span>
                  <EnvironmentOutlined />
                  <span>{event.location}</span>
                </Space>

                <Tag color="blue">{event.period}</Tag>

                <Paragraph ellipsis={{ rows: 3 }} style={styles.description}>
                  {event.description}
                </Paragraph>

                <Link to={`/event/${event.id}`}>
                  <Button type="link" style={{ padding: 0 }}>
                    Xem chi tiết →
                  </Button>
                </Link>
              </Space>
            </Card>
          </Timeline.Item>
        ))}
      </Timeline>
    </div>
  );
}

export default HistoricalTimeline; 