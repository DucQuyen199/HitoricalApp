import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Card, Image, Descriptions, List } from 'antd';

const API_URL = process.env.REACT_APP_API_URL;

function EventDetail() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEventDetail = async () => {
      try {
        const response = await axios.get(`${API_URL}/events/${id}`);
        setEvent(response.data);
      } catch (error) {
        console.error('Error fetching event details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetail();
  }, [id]);

  if (loading) {
    return <div>Đang tải...</div>;
  }

  if (!event) {
    return <div>Không tìm thấy sự kiện</div>;
  }

  return (
    <div style={{ padding: '20px', maxWidth: 1200, margin: '0 auto' }}>
      <Card title={event.title} loading={loading}>
        {event.image_url && (
          <Image
            src={event.image_url}
            alt={event.title}
            style={{ maxWidth: '100%', marginBottom: 20 }}
          />
        )}
        
        <Descriptions bordered>
          <Descriptions.Item label="Thời gian">{event.date}</Descriptions.Item>
          <Descriptions.Item label="Địa điểm">{event.location}</Descriptions.Item>
          <Descriptions.Item label="Thời kỳ">{event.period}</Descriptions.Item>
        </Descriptions>

        <div style={{ margin: '20px 0' }}>
          <h3>Mô tả</h3>
          <p>{event.description}</p>
        </div>

        {event.related_figures && event.related_figures.length > 0 && (
          <div>
            <h3>Nhân vật liên quan</h3>
            <List
              itemLayout="horizontal"
              dataSource={event.related_figures}
              renderItem={figure => (
                <List.Item>
                  <List.Item.Meta
                    avatar={figure.portrait && <Image src={figure.portrait} width={100} />}
                    title={figure.name}
                    description={figure.relationship_type}
                  />
                </List.Item>
              )}
            />
          </div>
        )}

        {event.additional_images && event.additional_images.length > 0 && (
          <div style={{ marginTop: 20 }}>
            <h3>Hình ảnh bổ sung</h3>
            <Image.PreviewGroup>
              {event.additional_images.map((img, index) => (
                <Image
                  key={index}
                  src={img.url}
                  alt={img.caption}
                  width={200}
                  style={{ marginRight: 10, marginBottom: 10 }}
                />
              ))}
            </Image.PreviewGroup>
          </div>
        )}
      </Card>
    </div>
  );
}

export default EventDetail; 