import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Image, Typography, Spin } from 'antd';
import { Link } from 'react-router-dom';
import axios from 'axios';

const { Title, Paragraph } = Typography;
const API_URL = process.env.REACT_APP_API_URL;

const styles = {
  container: {
    padding: '80px 50px 20px',
    maxWidth: 1200,
    margin: '0 auto',
    marginTop: 100
  },
  card: {
    height: '100%',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
  },
  image: {
    height: 300,
    objectFit: 'cover'
  }
};

function Figures() {
  const [figures, setFigures] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFigures = async () => {
      try {
        const response = await axios.get(`${API_URL}/figures`);
        setFigures(response.data);
      } catch (error) {
        console.error('Error fetching figures:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFigures();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="page-container">
      <div style={styles.container}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: 40 }}>
          Nhân vật Lịch sử
        </Title>

        <Row gutter={[24, 24]}>
          {figures.map((figure) => (
            <Col xs={24} sm={12} md={8} lg={6} key={figure.id}>
              <Card
                hoverable
                style={styles.card}
                cover={
                  figure.portrait_url && (
                    <Image
                      alt={figure.name}
                      src={figure.portrait_url}
                      style={styles.image}
                    />
                  )
                }
              >
                <Link to={`/figure/${figure.id}`}>
                  <Title level={4}>{figure.name}</Title>
                </Link>
                <Paragraph ellipsis={{ rows: 3 }}>
                  {figure.biography}
                </Paragraph>
                <p>
                  {figure.birth_date && `${figure.birth_date} - `}
                  {figure.death_date}
                </p>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
}

export default Figures; 