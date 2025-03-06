import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Typography, Card, Modal, Spin, Image, Button, message, Dropdown, List } from 'antd';
import { CloseOutlined, RobotOutlined, HistoryOutlined, ReloadOutlined, LoadingOutlined, SearchOutlined, CalendarOutlined, CrownOutlined, CaretRightOutlined } from '@ant-design/icons';
import { dynastyData } from '../data/dynasties';
import './DynastyList.css';

const { Title, Paragraph } = Typography;

function DynastyList() {
  const [dynasties, setDynasties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDynasty, setSelectedDynasty] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [dynastyDetail, setDynastyDetail] = useState(null);
  const [kings, setKings] = useState([]);
  const [detailLoading, setDetailLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [contentLoaded, setContentLoaded] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [wikiImages, setWikiImages] = useState({});
  const [kingModalVisible, setKingModalVisible] = useState(false);
  const [selectedKing, setSelectedKing] = useState(null);
  const [kingDetail, setKingDetail] = useState(null);
  const [kingLoading, setKingLoading] = useState(false);
  const [kingImageLoading, setKingImageLoading] = useState(false);
  const [analysisExpanded, setAnalysisExpanded] = useState(false);
  
  // Cache để lưu dữ liệu đã tải
  const dynastyCacheRef = useRef({});
  const wikiImageCacheRef = useRef({});
  const kingsCacheRef = useRef({});

  useEffect(() => {
    loadDynasties();
  }, []);

  useEffect(() => {
    if (!detailLoading && dynastyDetail) {
      setTimeout(() => {
        setContentLoaded(true);
      }, 100);
    } else {
      setContentLoaded(false);
    }
  }, [detailLoading, dynastyDetail]);

  const loadDynasties = () => {
    setLoading(true);
    try {
      // Chuyển đổi object dynastyData thành array
      const dynastiesArray = Object.entries(dynastyData).map(([name, data]) => ({
        id: name.replace(/\s+/g, '-').toLowerCase(),
        name: name,
        period: data.period || 'Không rõ',
        description: data.description?.substring(0, 120) + '...' || 'Chưa có thông tin',
        capital: data.capital || 'Không rõ',
        founder: data.kings?.[0]?.name || data.founder || 'Không rõ',
        image: data.image || `/images/dynasties/${name.replace(/\s+/g, '-').toLowerCase()}.jpg`
      }));

      // Sắp xếp theo thứ tự thời gian
      const sortedData = dynastiesArray.sort((a, b) => {
        const startYearA = parseInt(a.period.split('-')[0].trim()) || 0;
        const startYearB = parseInt(b.period.split('-')[0].trim()) || 0;
        return startYearA - startYearB;
      });

      setDynasties(sortedData);
    } catch (error) {
      console.error('Error loading dynasties:', error);
      message.error('Không thể tải danh sách triều đại');
    } finally {
      setLoading(false);
    }
  };

  // Cập nhật hàm fetchWikiData
  const fetchWikiData = async (dynastyName) => {
    try {
      // Định nghĩa chính xác search terms cho từng triều đại
      const searchTerms = {
        "Nhà Ngô": "Nhà Ngô",
        "Nhà Đinh": "Nhà Đinh",
        "Nhà Tiền Lê": "Nhà Tiền Lê",
        "Nhà Lý": "Nhà Lý",
        "Nhà Trần": "Nhà Trần",
        "Nhà Hồ": "Nhà Hồ",
        "Nhà Hậu Trần": "Nhà Hậu Trần",
        "Nhà Lê sơ": "Nhà Lê sơ",
        "Nhà Mạc": "Nhà Mạc",
        "Nhà Hậu Lê": "Nhà Hậu Lê",
        "Nhà Tây Sơn": "Nhà Tây Sơn",
        "Nhà Nguyễn": "Nhà Nguyễn",
        "1945 - Nay": "Việt Nam Dân chủ Cộng hòa"
      };

      const searchTerm = searchTerms[dynastyName];
      if (!searchTerm) return null;

      // Tìm bài viết Wikipedia với điều kiện chính xác
      const searchUrl = `https://vi.wikipedia.org/w/api.php?action=query&format=json&list=search&srsearch=intitle:${encodeURIComponent(searchTerm)}&origin=*`;
      const searchResponse = await fetch(searchUrl);
      const searchData = await searchResponse.json();

      if (searchData?.query?.search && searchData.query.search.length > 0) {
        // Tìm kết quả phù hợp nhất
        const exactMatch = searchData.query.search.find(result => 
          result.title.toLowerCase() === searchTerm.toLowerCase()
        );
        
        const pageId = exactMatch ? exactMatch.pageid : searchData.query.search[0].pageid;

        // Lấy nội dung đầy đủ
        const contentUrl = `https://vi.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&pageids=${pageId}&explaintext=1&origin=*`;
        const contentResponse = await fetch(contentUrl);
        const contentData = await contentResponse.json();

        if (contentData.query?.pages[pageId]?.extract) {
          let content = contentData.query.pages[pageId].extract;

          // Xử lý nội dung
          content = content
            // Loại bỏ các phần không cần thiết
            .replace(/== Chú thích ==[\s\S]*$/, '')
            .replace(/== Tham khảo ==[\s\S]*$/, '')
            .replace(/== Xem thêm ==[\s\S]*$/, '')
            .replace(/== Liên kết ngoài ==[\s\S]*$/, '')
            .replace(/\[\d+\]/g, '')
            .replace(/\{\{.*?\}\}/g, '');

          // Tách và lọc các phần quan trọng
          const sections = content.split(/={2,3}[^=]+={2,3}/);
          const relevantContent = sections
            .filter(section => {
              const lowerSection = section.toLowerCase();
              return (
                lowerSection.includes('lịch sử') ||
                lowerSection.includes('tổng quan') ||
                lowerSection.includes('thời kỳ') ||
                lowerSection.includes('triều đại') ||
                lowerSection.includes('chính trị') ||
                lowerSection.includes('văn hóa') ||
                !section.includes('==') // Giữ lại phần mở đầu
              );
            })
            .join('\n\n')
            .trim();

          // Định dạng nội dung cuối cùng
          return relevantContent
            .replace(/\n{3,}/g, '\n\n') // Chuẩn hóa khoảng trống
            .replace(/^[\s\n]+|[\s\n]+$/g, '') // Xóa khoảng trống thừa đầu/cuối
            .trim();
        }
      }
      return null;
    } catch (error) {
      console.error('Error fetching Wikipedia data:', error);
      return null;
    }
  };

  // Cập nhật hàm fetchKingData
  const fetchKingData = async (king, dynastyName) => {
    try {
      // Map chính xác tên tìm kiếm cho từng vua theo triều đại
      const kingSearchMap = {
        // Nhà Ngô (939-965)
        "Ngô Quyền": "Ngô Quyền vua",
        "Dương Tam Kha": "Dương Tam Kha",
        "Nam Tấn Vương": "Nam Tấn Vương",

        // Nhà Đinh (968-980)
        "Đinh Bộ Lĩnh": "Đinh Tiên Hoàng Đế",
        "Đinh Phế Đế": "Đinh Phế Đế",

        // Nhà Tiền Lê (980-1009)
        "Lê Hoàn": "Lê Đại Hành",
        "Lê Long Đĩnh": "Lê Long Đĩnh",

        // Nhà Lý (1009-1225)
        "Lý Công Uẩn": "Lý Thái Tổ",
        "Lý Phật Mã": "Lý Thái Tông",
        "Lý Nhật Tôn": "Lý Thánh Tông",
        "Lý Càn Đức": "Lý Nhân Tông",
        "Lý Thiên Tộ": "Lý Thần Tông",
        "Lý Anh Tông": "Lý Anh Tông",
        "Lý Cao Tông": "Lý Cao Tông",
        "Lý Huệ Tông": "Lý Huệ Tông",
        "Lý Chiêu Hoàng": "Lý Chiêu Hoàng",

        // Nhà Trần (1225-1400)
        "Trần Cảnh": "Trần Thái Tông",
        "Trần Hoảng": "Trần Thánh Tông",
        "Trần Khâm": "Trần Nhân Tông",
        "Trần Thuyên": "Trần Anh Tông",
        "Trần Mạnh": "Trần Minh Tông",
        "Trần Hiến": "Trần Hiến Tông",
        "Trần Dụ Tông": "Trần Dụ Tông",
        "Trần Nghệ Tông": "Trần Nghệ Tông",
        "Trần Phế Đế": "Trần Phế Đế",
        "Trần Thuận Tông": "Trần Thuận Tông",
        "Trần Thiếu Đế": "Trần Thiếu Đế",

        // Nhà Hồ (1400-1407)
        "Hồ Quý Ly": "Hồ Quý Ly",
        "Hồ Hán Thương": "Hồ Hán Thương",

        // Nhà Lê sơ (1428-1527)
        "Lê Lợi": "Lê Lợi",
        "Lê Thái Tông": "Lê Thái Tông",
        "Lê Nhân Tông": "Lê Nhân Tông nhà Lê sơ",
        "Lê Thánh Tông": "Lê Thánh Tông",
        "Lê Hiến Tông": "Lê Hiến Tông",
        "Lê Túc Tông": "Lê Túc Tông",
        "Lê Uy Mục": "Lê Uy Mục",
        "Lê Tương Dực": "Lê Tương Dực",
        "Lê Chiêu Tông": "Lê Chiêu Tông",
        "Lê Cung Hoàng": "Lê Cung Hoàng",

        // Nhà Mạc (1527-1677)
        "Mạc Đăng Dung": "Mạc Đăng Dung",
        "Mạc Đăng Doanh": "Mạc Đăng Doanh",
        "Mạc Phúc Hải": "Mạc Phúc Hải",

        // Nhà Tây Sơn (1778-1802)
        "Nguyễn Nhạc": "Nguyễn Nhạc",
        "Nguyễn Huệ": "Quang Trung Hoàng đế",
        "Nguyễn Quang Toản": "Cảnh Thịnh",

        // Nhà Nguyễn (1802-1945)
        "Nguyễn Phúc Ánh": "Gia Long",
        "Nguyễn Phúc Đảm": "Minh Mạng",
        "Nguyễn Phúc Miên Tông": "Thiệu Trị",
        "Nguyễn Phúc Hồng Nhậm": "Tự Đức",
        "Nguyễn Phúc Ưng Chân": "Dục Đức",
        "Nguyễn Phúc Hồng Dật": "Hiệp Hoà",
        "Nguyễn Phúc Ưng Đăng": "Kiến Phúc",
        "Nguyễn Phúc Ưng Lịch": "Hàm Nghi",
        "Nguyễn Phúc Ưng Kỷ": "Đồng Khánh",
        "Nguyễn Phúc Bửu Lân": "Thành Thái",
        "Nguyễn Phúc Vĩnh San": "Duy Tân",
        "Nguyễn Phúc Bửu Đảo": "Khải Định",
        "Nguyễn Phúc Vĩnh Thụy": "Bảo Đại"
      };

      // Tạo search term chính xác
      const searchTerm = kingSearchMap[king.name] || king.title || king.name;

      // Lọc các phần quan trọng cần hiển thị
      const relevantSections = [
        'tiểu sử',
        'thân thế',
        'cuộc đời',
        'lên ngôi',
        'trị vì',
        'sự nghiệp',
        'chiến tích',
        'cải cách',
        'di sản',
        'đánh giá'
      ];

      // Lấy nội dung từ Wikipedia
      const searchUrl = `https://vi.wikipedia.org/w/api.php?action=query&format=json&list=search&srsearch=${encodeURIComponent(searchTerm)}&origin=*`;
      const searchResponse = await fetch(searchUrl);
      const searchData = await searchResponse.json();

      if (searchData?.query?.search && searchData.query.search.length > 0) {
        const pageId = searchData.query.search[0].pageid;

        // Lấy cả nội dung và hình ảnh
        const [contentResponse, imagesResponse] = await Promise.all([
          fetch(`https://vi.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&pageids=${pageId}&explaintext=1&origin=*`),
          fetch(`https://vi.wikipedia.org/w/api.php?action=query&format=json&prop=pageimages|images&pageids=${pageId}&piprop=original&imlimit=50&origin=*`)
        ]);

        const [contentData, imagesData] = await Promise.all([
          contentResponse.json(),
          imagesResponse.json()
        ]);

        let content = contentData.query?.pages[pageId]?.extract;
        
        // Xử lý hình ảnh
        let imageUrl = null;
        
        // Kiểm tra hình ảnh chính của trang
        if (imagesData.query?.pages[pageId]?.original?.source) {
          imageUrl = imagesData.query.pages[pageId].original.source;
        } else if (imagesData.query?.pages[pageId]?.images) {
          // Tìm trong danh sách hình ảnh của trang
          const images = imagesData.query.pages[pageId].images;
          const kingImage = images.find(img => {
            const imgName = img.title.toLowerCase();
            return (
              imgName.includes(king.name.toLowerCase()) ||
              (king.reignName && imgName.includes(king.reignName.toLowerCase())) ||
              imgName.includes('portrait') ||
              imgName.includes('statue')
            );
          });
          
          if (kingImage) {
            // Lấy URL của hình ảnh tìm thấy
            const imageInfoUrl = `https://vi.wikipedia.org/w/api.php?action=query&format=json&prop=imageinfo&titles=${encodeURIComponent(kingImage.title)}&iiprop=url&origin=*`;
            const imageInfoResponse = await fetch(imageInfoUrl);
            const imageInfoData = await imageInfoResponse.json();
            const pages = imageInfoData.query?.pages || {};
            const pageId = Object.keys(pages)[0];
            imageUrl = pages[pageId]?.imageinfo?.[0]?.url;
          }
        }

        // Fallback về ảnh từ local data hoặc ảnh triều đại
        if (!imageUrl) {
          imageUrl = king.image || dynastyDetail?.image || `/images/dynasties/${dynastyName.toLowerCase().replace(/\s+/g, '-')}.jpg`;
        }

        if (content) {
          // Xử lý nội dung
          content = content
            .split(/={2,3}[^=]+={2,3}/)
            .filter(section => {
              const lowerSection = section.toLowerCase();
              return (
                !section.includes('==') ||
                relevantSections.some(term => lowerSection.includes(term))
              );
            })
            .join('\n\n')
            .replace(/\[\d+\]/g, '')
            .replace(/\{\{.*?\}\}/g, '')
            .replace(/\n{3,}/g, '\n\n') // Giới hạn số dòng trống tối đa là 2
            .replace(/\s{2,}/g, ' ') // Gộp khoảng trắng liên tiếp
            .trim();

          // Format nội dung thành các đoạn văn
          content = content
            .split('\n\n')
            .map(paragraph => paragraph.trim())
            .filter(paragraph => paragraph)
            .join('\n\n');

          // Thêm thông tin từ local data
          if (king.achievements?.length > 0) {
            content += '\n\nThành tựu nổi bật:\n' + 
              king.achievements.map(a => `• ${a}`).join('\n');
          }

          if (king.events?.length > 0) {
            content += '\n\nSự kiện quan trọng:\n' + 
              king.events.map(e => `• ${e}`).join('\n');
          }

          return {
            content,
            imageUrl,
            title: king.title,
            period: king.period,
            reignName: king.reignName
          };
        }
      }
      return null;
    } catch (error) {
      console.error('Error fetching king data:', error);
      // Fallback về ảnh triều đại nếu có lỗi
      return {
        content: king.description,
        imageUrl: king.image || dynastyDetail?.image || `/images/dynasties/${dynastyName.toLowerCase().replace(/\s+/g, '-')}.jpg`,
        title: king.title,
        period: king.period,
        reignName: king.reignName
      };
    }
  };

  // Cập nhật hàm handleDynastyClick
  const handleDynastyClick = async (dynasty) => {
    setSelectedDynasty(dynasty);
    setModalVisible(true);
    setDetailLoading(true);
    setImageLoading(true);
    setContentLoaded(false);

    try {
      // Lấy thông tin chi tiết từ dynastyData
      const dynastyInfo = dynastyData[dynasty.name];
      
      if (!dynastyInfo) {
        throw new Error('Không tìm thấy thông tin chi tiết');
      }

      // Lấy thông tin từ Wikipedia
      const wikiDescription = await fetchWikiData(dynasty.name);

      setDynastyDetail({
        ...dynasty,
        ...dynastyInfo,
        wikiDescription: wikiDescription || dynastyInfo.description,
        achievements: dynastyInfo.achievements || [],
        events: dynastyInfo.events || []
      });

      // Lấy danh sách vua
      if (dynastyInfo.kings) {
        const kingsData = dynastyInfo.kings.map(king => ({
          ...king,
          id: king.id || king.name.replace(/\s+/g, '-').toLowerCase()
        }));
        setKings(kingsData);
      } else {
        setKings([]);
      }

    } catch (error) {
      console.error('Error loading dynasty detail:', error);
      message.error('Không thể tải thông tin chi tiết triều đại');
    } finally {
      setDetailLoading(false);
      setImageLoading(false);
    }
  };

  const handleAIAnalysis = async () => {
    if (analysisLoading) return;
    
    // Reset trạng thái phân tích cũ và đóng dropdown
    setAiAnalysis(null);
    setAnalysisExpanded(false);
    setAnalysisLoading(true);

    try {
      // Chuẩn bị nội dung để phân tích
      const content = `
        Triều đại: ${dynastyDetail.name}
        Thời kỳ: ${dynastyDetail.period}
        Kinh đô: ${dynastyDetail.capital}
        
        ${dynastyDetail.wikiDescription || dynastyDetail.description}
        
        ${dynastyDetail.achievements?.length > 0 
          ? `\nThành tựu:\n${dynastyDetail.achievements.join('\n')}` 
          : ''}
        
        ${dynastyDetail.events?.length > 0 
          ? `\nSự kiện quan trọng:\n${dynastyDetail.events.join('\n')}` 
          : ''}
      `;

      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content,
          name: dynastyDetail.name
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setAiAnalysis(data.analysis);
      
      // Tự động mở dropdown sau khi có kết quả
      setTimeout(() => setAnalysisExpanded(true), 100);

    } catch (error) {
      console.error('Error in AI analysis:', error);
      message.error('Không thể thực hiện phân tích AI. Vui lòng thử lại sau.');
    } finally {
      setAnalysisLoading(false);
    }
  };

  // Thêm hàm toggle analysis
  const toggleAnalysis = () => {
    if (aiAnalysis) {
      setAnalysisExpanded(!analysisExpanded);
    } else if (!analysisLoading) {
      handleAIAnalysis();
    }
  };

  // Cập nhật hàm handleKingClick
  const handleKingClick = async (king) => {
    setSelectedKing(king);
    setKingModalVisible(true);
    setKingLoading(true);

    try {
      const wikiData = await fetchKingData(king, dynastyDetail.name);
      
      setKingDetail({
        ...king,
        description: wikiData?.content || king.description,
        image: wikiData?.imageUrl || king.image,
        achievements: king.achievements || [],
        events: king.events || [],
        reignName: wikiData?.reignName || king.reignName
      });

    } catch (error) {
      console.error('Error loading king details:', error);
      message.error('Không thể tải thông tin chi tiết về vua');
    } finally {
      setKingLoading(false);
    }
  };

    return (
    <div className="dynasties-page">
      <Title level={1} className="page-title">
        Các triều đại Việt Nam
              </Title>

      <div className="dynasties-grid">
        {loading ? (
          // Hiển thị skeleton loading cards
          Array(8).fill().map((_, index) => (
            <Card key={index} className="dynasty-card loading">
              <div className="dynasty-card-cover loading"></div>
            </Card>
          ))
        ) : dynasties.length === 0 ? (
          // Hiển thị thông báo khi không có dữ liệu
          <div className="no-data-message">
            <div className="no-data-icon">
              <HistoryOutlined style={{ fontSize: 60, opacity: 0.5 }} />
            </div>
            <Title level={4}>Không có dữ liệu triều đại</Title>
            <Button 
              type="primary" 
              onClick={loadDynasties}
              icon={<ReloadOutlined />}
            >
              Thử lại
            </Button>
          </div>
        ) : (
          // Render danh sách triều đại với thông tin cơ bản
          dynasties.map(dynasty => (
            <Card
              key={dynasty._id || dynasty.id}
              hoverable
              className="dynasty-card"
              cover={
                <div className="dynasty-card-cover">
                  <img 
                    alt={dynasty.name} 
                    src={dynasty.image}
                    onError={(e) => {
                      // Nếu hình ảnh hiện tại lỗi, thử các nguồn thay thế theo thứ tự
                      if (e.target.src !== dynasty.fallbackImage && dynasty.fallbackImage) {
                        console.log(`Trying fallback image for ${dynasty.name}`);
                        e.target.src = dynasty.fallbackImage;
                      } else if (e.target.src !== dynasty.defaultImage) {
                        console.log(`Using default image for ${dynasty.name}`);
                        e.target.src = dynasty.defaultImage;
                      }
                      // Nếu tất cả đều thất bại, không làm gì thêm
                    }}
                  />
                  <div className="dynasty-period">{dynasty.period}</div>
                </div>
              }
              onClick={() => handleDynastyClick(dynasty)}
            >
              <Card.Meta 
                title={dynasty.name}
                description={
                  <div className="dynasty-founder">
                    <HistoryOutlined /> {dynasty.founder}
          </div>
                }
              />
            </Card>
          ))
        )}
      </div>

      <Modal
        title={null}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setDynastyDetail(null);
          setKings([]);
          setAiAnalysis(null);
        }}
        width="auto"
        footer={null}
        className="dynasty-detail-modal"
        centered={false}
        maskClosable={false}
        closeIcon={<CloseOutlined />}
      >
        <div className="dynasty-detail-container">
          <Spin spinning={detailLoading} size="large">
            {dynastyDetail && (
              <div className={`dynasty-article ${contentLoaded ? 'loaded' : ''}`}>
                <div className="dynasty-article-header">
                  <div className="dynasty-title-group">
                    <Title level={2} className="dynasty-article-title">{dynastyDetail.name}</Title>
                    <div className="dynasty-meta">
                      <div className="dynasty-period-tag">
                        <span className="period-label">Thời kỳ:</span> {dynastyDetail.period}
                      </div>
                      <div className="dynasty-capital-tag">
                        <span className="capital-label">Kinh đô:</span> {dynastyDetail.capital}
                      </div>
                    </div>
                  </div>
                  
                  <div className="dynasty-article-actions">
                    <Button 
                      type="text" 
                      icon={<RobotOutlined />} 
                      onClick={toggleAnalysis}
                      loading={analysisLoading}
                      className="analyze-button"
                      size="large"
                    >
                      Phân tích AI
                    </Button>
                  </div>
                </div>
                
                <div className="dynasty-article-body three-column-layout">
                  {/* Cột 1: Danh sách vua (30%) */}
                  <div className="dynasty-kings-section">
                    <Title level={3} className="section-title">
                      Các vị vua tiêu biểu
                    </Title>
                    <List
                      className="kings-list"
                      itemLayout="horizontal"
                      dataSource={kings}
                      renderItem={king => (
                        <List.Item 
                          className="king-item"
                          onClick={() => handleKingClick(king)}
                        >
                          <List.Item.Meta
                            title={<span className="king-name">{king.name}</span>}
                            description={
                              <div className="king-info">
                                <div className="king-reign">{king.period}</div>
                                {king.title && <div className="king-title-small">{king.title}</div>}
            </div>
                            }
                          />
                        </List.Item>
                      )}
                    />
                  </div>
                  
                  {/* Cột 2: Hình ảnh và thông tin tổng quan (70%) */}
                  <div className="dynasty-content-section">
                    {/* Phần thông tin tổng quan */}
                    <div className="dynasty-overview-section">
                      <Title level={3} className="section-title">
                        Tổng quan
                      </Title>
                      
                      {/* Phần hình ảnh */}
                      <div className="dynasty-image-section">
                        <Image
                          src={dynastyDetail.image}
                          alt={dynastyDetail.name}
                          className="dynasty-image"
                          fallback="/images/default-dynasty.jpg"
                        />
                      </div>

                      {/* Phần nội dung */}
                      <div className="section-content">
                        {dynastyDetail.wikiDescription ? (
                          <Paragraph>
                            {dynastyDetail.wikiDescription}
                          </Paragraph>
                        ) : (
                    <Paragraph>
                            {dynastyDetail.description}
                    </Paragraph>
                  )}
                </div>
                    </div>
                    </div>
                    
                    {/* Thêm phần Analysis Section */}
                    <div className="dynasty-analysis-section">
                      <div 
                        className={`analysis-header ${aiAnalysis ? 'has-content' : ''}`}
                        onClick={toggleAnalysis}
                      >
                        <div className="analysis-title">
                          <RobotOutlined />
                          <span>Phân tích AI</span>
                        </div>
                        <div className="analysis-status">
                          {analysisLoading ? (
                            <>
                              <LoadingOutlined />
                              <span>Đang phân tích...</span>
                            </>
                          ) : aiAnalysis ? (
                            <CaretRightOutlined 
                              rotate={analysisExpanded ? 90 : 0}
                              style={{ transition: 'all 0.3s' }}
                            />
                          ) : (
                            <span>Click để phân tích</span>
                          )}
                        </div>
                      </div>

                      <div className={`analysis-content ${analysisExpanded ? 'expanded' : ''}`}>
                        {aiAnalysis && (
                          <div className="analysis-result">
                            <Paragraph>{aiAnalysis}</Paragraph>
                          </div>
                        )}
                      </div>
                    </div>
                </div>
                </div>
              )}
          </Spin>
        </div>
      </Modal>

      <Modal
        title={null}
        open={kingModalVisible}
        onCancel={() => {
          setKingModalVisible(false);
          setKingDetail(null);
        }}
        width={1000}
        footer={null}
        className="king-modal"
      >
        <Spin spinning={kingLoading}>
          {kingDetail && (
            <div className="king-article">
              <div className="king-article-header">
                <Title level={2} className="king-article-title">
                  {kingDetail.name}
                </Title>
                <div className="king-meta">
                  <div className="king-period">
                    <CalendarOutlined /> Trị vì: {kingDetail.period}
                  </div>
                  {kingDetail.title && (
                    <div className="king-title">
                      <CrownOutlined /> {kingDetail.title}
                    </div>
                  )}
                </div>
              </div>

              <div className="king-article-body">
                <div className="king-image-section">
                  <Image
                    src={kingDetail.image}
                    alt={kingDetail.name}
                    className="king-image"
                    fallback={dynastyDetail?.image || "/images/default-dynasty.jpg"}
                    onError={(e) => {
                      // Nếu ảnh vua lỗi, sử dụng ảnh triều đại
                      e.target.src = dynastyDetail?.image || "/images/default-dynasty.jpg";
                    }}
                  />
                </div>

                <div className="king-content">
                  <div className="content-section">
                    <Title level={3} className="section-title">
                      Tiểu sử
                    </Title>
                    <div className="section-content">
                      <Paragraph>{kingDetail.description}</Paragraph>
                    </div>
                  </div>

                  {kingDetail.achievements?.length > 0 && (
                    <div className="content-section">
                      <Title level={3} className="section-title">
                        Thành tựu
                      </Title>
                      <List
                        dataSource={kingDetail.achievements}
                        renderItem={item => (
                          <List.Item className="achievement-item">
                            {item}
                          </List.Item>
                        )}
                      />
                    </div>
                  )}

                  {kingDetail.events?.length > 0 && (
                    <div className="content-section">
                      <Title level={3} className="section-title">
                        Sự kiện quan trọng
                      </Title>
                      <List
                        dataSource={kingDetail.events}
                        renderItem={item => (
                          <List.Item className="event-item">
                            {item}
                          </List.Item>
                        )}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </Spin>
      </Modal>
    </div>
  );
}

export default DynastyList;