import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Input, Button, Card, Typography, Space, Image, Spin, List, Divider, Layout, Tag, Alert, Upload, message } from 'antd';
import { SendOutlined, HistoryOutlined, PictureOutlined, DeleteOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import axios from 'axios';
import { Link } from 'react-router-dom';

const { TextArea } = Input;
const { Title, Paragraph } = Typography;
const { Sider, Content } = Layout;

const HISTORY_SUGGESTIONS = [
  {
    id: 1,
    category: 'Triều đại',
    question: 'Các triều đại nào đã tồn tại trong lịch sử Việt Nam?'
  },
  {
    id: 2,
    category: 'Triều đại',
    question: 'Triều đại nào tồn tại lâu nhất trong lịch sử Việt Nam?'
  },
  {
    id: 3,
    category: 'Chiến tranh',
    question: 'Những trận đánh nào là quan trọng nhất trong lịch sử Việt Nam?'
  },
  {
    id: 4,
    category: 'Chiến tranh',
    question: 'Chiến thắng nào có ý nghĩa nhất trong lịch sử chống ngoại xâm?'
  },
  {
    id: 5,
    category: 'Nhân vật',
    question: 'Ai là những anh hùng dân tộc tiêu biểu nhất?'
  },
  {
    id: 6,
    category: 'Nhân vật',
    question: 'Những danh tướng nào đã có công đánh giặc giữ nước?'
  },
  {
    id: 7,
    category: 'Văn hóa',
    question: 'Những di sản văn hóa nào tiêu biểu nhất của Việt Nam?'
  },
  {
    id: 8,
    category: 'Văn hóa',
    question: 'Phong tục tập quán nào đặc trưng nhất của người Việt?'
  }
];

const HISTORY_KEYWORDS = [
  'lịch sử', 'triều đại', 'vua', 'hoàng đế', 'chiến tranh',
  'chiến thắng', 'độc lập', 'phong kiến', 'dân tộc', 'văn hóa',
  'di sản', 'di tích', 'cách mạng', 'kháng chiến', 'đấu tranh',
  'anh hùng', 'danh nhân', 'tướng lĩnh', 'quân đội', 'nhà nước'
];

const ChatContainer = styled.div`
  position: fixed;
  top: 64px;
  left: 0;
  right: 0;
  bottom: 0;
  background: white;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .chat-layout {
    flex: 1;
    display: flex;
    border-top: 1px solid #f0f0f0;
    height: 100%;
    overflow: hidden;

    .suggestions-sidebar {
      width: 350px !important;
      max-width: 350px !important;
      min-width: 350px !important;
      background: white;
      padding: 16px;
      height: 100%;
      overflow-y: auto;
      border-right: 1px solid #f0f0f0;

      .category-title {
        color: #1a237e;
        margin: 12px 0 8px;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .suggestion-chip {
        cursor: pointer;
        padding: 10px;
        background: #fafafa;
        border-radius: 6px;
        margin-bottom: 6px;
        transition: all 0.2s;
        border: 1px solid #f0f0f0;

        &:hover {
          background: #e6f7ff;
          transform: translateX(5px);
          border-color: #1890ff;
        }
      }
    }

    .chat-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      background: white;
      position: relative;
      overflow: hidden;

      .chat-history {
        flex: 1;
        overflow-y: auto;
        padding: 16px;
        padding-bottom: 115px;
        
        .message {
          margin-bottom: 12px;
          
          &.user {
            text-align: right;
            .message-content {
              background: #e6f7ff;
              border: 1px solid #91d5ff;
              margin-left: auto;
            }
          }
          
          &.ai {
            text-align: left;
            .message-content {
              background: white;
              border: 1px solid #f0f0f0;
            }
          }

          .message-content {
            max-width: 85%;
            padding: 12px;
            border-radius: 6px;
            display: inline-block;
          }

          .image-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 16px;
            margin-top: 16px;

            .image-item {
              border-radius: 8px;
              overflow: hidden;
              border: 1px solid #e8e8e8;
              
              img {
                width: 100%;
                height: 200px;
                object-fit: cover;
              }

              .image-caption {
                padding: 8px;
                background: #fafafa;
                font-size: 13px;
                border-top: 1px solid #e8e8e8;
              }
            }
          }

          .related-content {
            margin-top: 16px;
            padding-top: 16px;
            border-top: 1px solid #e8e8e8;

            .related-title {
              font-weight: 600;
              color: #1a237e;
              margin-bottom: 8px;
            }

            .related-list {
              display: flex;
              flex-wrap: wrap;
              gap: 8px;
            }
          }
        }
      }

      .input-container {
        position: absolute;
        bottom: 75px;
        left: 16px;
        right: 16px;
        z-index: 10;

        .ant-input-textarea {
          position: relative;

          textarea {
            border-radius: 8px;
            resize: none;
            padding: 12px 16px;
            padding-right: 60px;
            font-size: 15px;
            min-height: 50px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          }

          .ant-btn {
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
            height: 40px;
            width: 40px;
            padding: 0;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;

            .anticon {
              font-size: 18px;
            }
          }
        }

        .warning-message {
          color: #ff4d4f;
          margin-top: 8px;
          font-size: 13px;
        }
      }
    }
  }
`;

// Thêm styled component cho preview ảnh
const ImagePreview = styled.div`
  position: absolute;
  bottom: 100%;
  left: 16px;
  padding: 8px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;

  img {
    width: 60px;
    height: 60px;
    object-fit: cover;
    border-radius: 4px;
  }

  .delete-btn {
    color: #ff4d4f;
    cursor: pointer;
    &:hover {
      color: #ff7875;
    }
  }
`;

// Cập nhật CSS cho input container
const InputContainer = styled.div`
  position: absolute;
  bottom: 75px;
  left: 16px;
  right: 16px;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 8px;
  background: white;
  padding: 12px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);

  .ant-upload-button {
    margin-right: 8px;
  }

  .ant-input {
    flex: 1;
  }

  .send-button {
    margin-left: 8px;
  }
`;

// Cập nhật cấu hình API client
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5001',
  timeout: 60000,
  headers: {
    'Content-Type': 'multipart/form-data'
  }
});

// Thêm hàm refreshToken
const refreshToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await axios.post('/api/auth/refresh', {
      refreshToken
    });

    if (response.data?.token) {
      localStorage.setItem('token', response.data.token);
      if (response.data.refreshToken) {
        localStorage.setItem('refreshToken', response.data.refreshToken);
      }
      return response.data.token;
    }

    throw new Error('Failed to refresh token');
  } catch (error) {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    throw error;
  }
};

// Thêm hàm kiểm tra token
const checkAuthToken = () => {
  const token = localStorage.getItem('token');
  if (token) {
    apiClient.defaults.headers.Authorization = `Bearer ${token}`;
  }
};

// Thêm interceptor để xử lý lỗi
apiClient.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error);
    if (error.response?.status === 404) {
      throw new Error('API endpoint không tồn tại. Vui lòng kiểm tra lại URL.');
    }
    throw error;
  }
);

// Cập nhật styled components
const Message = styled.div`
  margin: 12px 0;
  padding: 15px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  
  &.user {
    align-self: flex-end;
    background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
    color: white;
    max-width: fit-content;
    min-width: 60px;
    margin-left: auto;
    position: relative;
    
    &:after {
      content: '';
      position: absolute;
      right: -8px;
      bottom: 15px;
      width: 0;
      height: 0;
      border-left: 10px solid #096dd9;
      border-top: 6px solid transparent;
      border-bottom: 6px solid transparent;
    }
    
    .message-image {
      text-align: right;
      margin-bottom: 8px;
      
      img {
        border-radius: 8px;
        max-width: 200px;
        max-height: 200px;
        object-fit: cover;
      }
    }

    .message-text {
      word-break: break-word;
      padding: 0 5px;
    }
  }
  
  &.bot {
    align-self: flex-start;
    background-color: #f5f5f5;
    max-width: 85%;
    margin-right: auto;
    position: relative;
    box-shadow: 0 1px 2px rgba(0,0,0,0.1);
    
    &:before {
      content: '';
      position: absolute;
      left: -8px;
      bottom: 15px;
      width: 0;
      height: 0;
      border-right: 10px solid #f5f5f5;
      border-top: 6px solid transparent;
      border-bottom: 6px solid transparent;
    }
    
    .message-text {
      font-size: 15px;
      line-height: 1.6;
      white-space: pre-wrap;
      color: #262626;
    }
  }
`;

const ChatHistory = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
  overflow-y: auto;
  margin-bottom: 90px; // Để không bị che bởi input container

  /* Tùy chỉnh thanh cuộn */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 3px;
    
    &:hover {
      background: #555;
    }
  }
`;

const MessageContent = styled.div`
  .message-section {
    margin: 15px 0;
    background: white;
    padding: 12px;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  }

  .section-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 600;
    color: #1890ff;
    margin-bottom: 12px;
    font-size: 15px;
    
    .icon {
      font-size: 18px;
    }
  }

  .section-content {
    margin-left: 28px;
    
    .item {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      margin-bottom: 8px;
      line-height: 1.5;
      
      .bullet {
        color: #1890ff;
        font-size: 18px;
        margin-top: -2px;
      }
      
      .text {
        flex: 1;
        
        strong {
          color: #262626;
        }
      }
    }
  }
`;

function AIChatbot() {
  const [question, setQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [warning, setWarning] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);

  // Thêm ref cho chat container
  const chatHistoryRef = useRef(null);
  
  const isHistoryQuestion = (text) => {
    const normalizedText = text.toLowerCase();
    return HISTORY_KEYWORDS.some(keyword => 
      normalizedText.includes(keyword.toLowerCase())
    );
  };

  // Thêm hàm scroll to bottom
  const scrollToBottom = useCallback(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTo({
        top: chatHistoryRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, []);

  // Thêm useEffect để scroll khi có tin nhắn mới
  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, scrollToBottom]);

  // Cập nhật hàm handleSubmit
  const handleSubmit = async () => {
    try {
      if (!question.trim()) {
        setWarning('Vui lòng nhập câu hỏi');
        return;
      }

      setLoading(true);
      setWarning('');

      // Tạo FormData để gửi cả text và file
      const formData = new FormData();
      formData.append('question', question.trim());
      if (selectedImage) {
        formData.append('image', selectedImage);
      }

      const response = await apiClient.post('/api/chat', formData);

      if (!response.data.success) {
        throw new Error(response.data.message || 'Có lỗi xảy ra');
      }

      // Thêm vào chat history
      setChatHistory(prev => [...prev, {
        type: 'user',
        content: question,
        image: selectedImage ? URL.createObjectURL(selectedImage) : null
      }, {
        type: 'bot',
        content: response.data.answer || response.data.description,
        details: response.data.details || [],
        events: response.data.events || [],
        figures: response.data.figures || []
      }]);

      // Reset form
      setQuestion('');
      setSelectedImage(null);

      // Scroll to bottom sau khi thêm tin nhắn
      setTimeout(scrollToBottom, 100);

    } catch (error) {
      console.error('Chat error:', error);
      setWarning(error.message || 'Có lỗi xảy ra, vui lòng thử lại');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (info) => {
    if (info.file.status === 'done') {
      message.success(`${info.file.name} đã được tải lên thành công`);
      setSelectedImage(info.file.originFileObj);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} tải lên thất bại.`);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
  };

  // Hàm validate dữ liệu images
  const validateImages = (images) => {
    if (!Array.isArray(images)) return [];
    return images.filter(img => 
      img && 
      typeof img === 'object' && 
      typeof img.url === 'string' &&
      img.url.startsWith('http')
    );
  };

  // Hàm validate dữ liệu related
  const validateRelatedData = (data) => {
    if (!Array.isArray(data)) return [];
    return data.filter(item => 
      item && 
      typeof item === 'object' && 
      item.id && 
      (item.title || item.name)
    );
  };

  const handleSuggestionClick = (suggestion) => {
    setQuestion(suggestion.question);
    setWarning('');
  };

  // Kiểm tra token khi component mount
  useEffect(() => {
    checkAuthToken();
  }, []);

  return (
    <ChatContainer>
      <Layout className="chat-layout">
        <Sider width={350} className="suggestions-sidebar">
          <Title level={4} style={{ margin: 0 }}>
            <HistoryOutlined /> Gợi ý câu hỏi
          </Title>
          
          {Object.entries(groupBy(HISTORY_SUGGESTIONS, 'category')).map(([category, suggestions]) => (
            <div key={category}>
              <h4 className="category-title">
                <Tag color="#1a237e">{category}</Tag>
              </h4>
              {suggestions.map(suggestion => (
                <div
                  key={suggestion.id}
                  className="suggestion-chip"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion.question}
                </div>
              ))}
            </div>
          ))}
        </Sider>

        <Content className="chat-content">
          <div className="chat-history" ref={chatHistoryRef}>
            {chatHistory.map((msg, index) => (
              <Message key={index} className={`message ${msg.type}`}>
                {msg.image && (
                  <div className="message-image">
                    <img src={msg.image} alt="Uploaded" />
                  </div>
                )}
                <MessageContent>
                  <div className="message-text">{msg.content}</div>
                  
                  {msg.events?.length > 0 && (
                    <div className="message-section">
                      <div className="section-title">
                        <span className="icon">📅</span>
                        <span>Sự kiện quan trọng</span>
                      </div>
                      <div className="section-content">
                        {msg.events.map(event => (
                          <div key={event.id} className="item">
                            <span className="bullet">▪</span>
                            <span className="text">
                              <strong>{event.title}</strong> ({event.date})
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {msg.figures?.length > 0 && (
                    <div className="message-section">
                      <div className="section-title">
                        <span className="icon">👥</span>
                        <span>Nhân vật liên quan</span>
                      </div>
                      <div className="section-content">
                        {msg.figures.map(figure => (
                          <div key={figure.id} className="item">
                            <span className="bullet">▪</span>
                            <span className="text">
                              <strong>{figure.name}</strong> - {figure.role}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {msg.details?.length > 0 && (
                    <div className="message-section">
                      <div className="section-title">
                        <span className="icon">💎</span>
                        <span>Điểm đáng chú ý</span>
                      </div>
                      <div className="section-content">
                        {msg.details.map((detail, i) => (
                          <div key={i} className="item">
                            <span className="bullet">▪</span>
                            <span className="text">{detail}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </MessageContent>
              </Message>
            ))}
          </div>

          {warning && <Alert message={warning} type="warning" showIcon className="warning-alert" />}

          <InputContainer>
            {selectedImage && (
              <ImagePreview>
                <img 
                  src={URL.createObjectURL(selectedImage)} 
                  alt="Preview" 
                />
                <DeleteOutlined 
                  className="delete-btn" 
                  onClick={removeImage}
                />
              </ImagePreview>
            )}

            <Upload
              accept="image/*"
              showUploadList={false}
              beforeUpload={(file) => {
                const isImage = file.type.startsWith('image/');
                if (!isImage) {
                  message.error('Chỉ chấp nhận file hình ảnh!');
                }
                const isLt5M = file.size / 1024 / 1024 < 5;
                if (!isLt5M) {
                  message.error('Hình ảnh phải nhỏ hơn 5MB!');
                }
                return isImage && isLt5M;
              }}
              onChange={handleImageUpload}
            >
              <Button 
                icon={<PictureOutlined />} 
                type={selectedImage ? "primary" : "default"}
                title="Tải lên hình ảnh"
              />
            </Upload>

            <Input
              placeholder="Nhập câu hỏi của bạn..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onPressEnter={handleSubmit}
              disabled={loading}
            />

            <Button
              className="send-button"
              type="primary"
              icon={<SendOutlined />}
              onClick={handleSubmit}
              loading={loading}
            />
          </InputContainer>
        </Content>
      </Layout>
    </ChatContainer>
  );
}

// Helper function to group suggestions by category
function groupBy(array, key) {
  return array.reduce((result, item) => ({
    ...result,
    [item[key]]: [...(result[item[key]] || []), item],
  }), {});
}

// Thêm interceptor cho axios
apiClient.interceptors.request.use(
  config => {
    // Thêm authorization nếu cần
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const token = await refreshToken();
        if (token) {
          apiClient.defaults.headers.Authorization = `Bearer ${token}`;
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        }
        throw new Error('Token refresh failed');
      } catch (refreshError) {
        // Xử lý khi refresh token thất bại
        console.error('Token refresh failed:', refreshError);
        // Có thể chuyển hướng người dùng đến trang đăng nhập
        // window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default AIChatbot; 