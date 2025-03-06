import React, { useState, useCallback, useEffect } from 'react';
import { Typography, Card, Modal, Spin, Image, Button, message, Dropdown } from 'antd';
import { CloseOutlined, RobotOutlined } from '@ant-design/icons';
import './Generals.css';

const { Title, Paragraph } = Typography;

const generalsData = [
  {
    id: 1,
    name: "Hùng Vương",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/T%C6%B0%E1%BB%A3ng_H%C3%B9ng_V%C6%B0%C6%A1ng_t%E1%BA%A1i_%C4%90%E1%BB%81n_H%C3%B9ng%2C_Tao_%C4%90%C3%A0n%2C_th%C3%A1ng_12_n%C4%83m_2021_%2812%29.jpg/600px-T%C6%B0%E1%BB%A3ng_H%C3%B9ng_V%C6%B0%C6%A1ng_t%E1%BA%A1i_%C4%90%E1%BB%81n_H%C3%B9ng%2C_Tao_%C4%90%C3%A0n%2C_th%C3%A1ng_12_n%C4%83m_2021_%2812%29.jpg",
    wikiSearchTerms: ["Hùng Vương", "Vua Hùng", "Các vua Hùng"]
  },
  {
    id: 2,
    name: "Hai Bà Trưng",
    image: "https://www.nxbtre.com.vn/Images/Book/nxbtre_full_23102023_091025.jpg",
    wikiSearchTerms: ["Hai Bà Trưng", "Trưng Trắc", "Trưng Nhị"]
  },
  {
    id: 3,
    name: "Lý Nam Đế",
    image: "https://upload.wikimedia.org/wikipedia/commons/9/91/Emperor_Ly_Nam_De.jpg",
    wikiSearchTerms: ["Lý Nam Đế", "Lý Bí", "Lý Bôn"]
  },
  {
    id: 4,
    name: "Ngô Quyền",
    image: "https://product.hstatic.net/200000343865/product/ngo-quyen_3e7dc2eb93954fb7a8049b94eb9c10bb_1973788aa35f4aa0bec8c90137286d0c.jpg",
    wikiSearchTerms: ["Ngô Quyền", "Tiền Ngô Vương"]
  },
  {
    id: 5,
    name: "Đinh Tiên Hoàng",
    image: "https://upload.wikimedia.org/wikipedia/commons/e/e2/VuaDinhTienHoang.jpg",
    wikiSearchTerms: ["Đinh Tiên Hoàng", "Đinh Bộ Lĩnh"]
  },
  {
    id: 6,
    name: "Lê Đại Hành",
    image: "https://upload.wikimedia.org/wikipedia/commons/a/a7/Le_Dai_Hanh.jpg",
    wikiSearchTerms: ["Lê Đại Hành", "Lê Hoàn"]
  },
  {
    id: 7,
    name: "Lý Thái Tổ",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/T%C6%B0%E1%BB%A3ng_L%C3%BD_Th%C3%A1i_T%E1%BB%95.jpeg/500px-T%C6%B0%E1%BB%A3ng_L%C3%BD_Th%C3%A1i_T%E1%BB%95.jpeg",
    wikiSearchTerms: ["Lý Thái Tổ", "Lý Công Uẩn"]
  },
  {
    id: 8,
    name: "Lý Thường Kiệt",
    image: "https://www.nxbtre.com.vn/Images/Book/nxbtre_full_19012021_100159.jpg",
    wikiSearchTerms: ["Lý Thường Kiệt"]
  },
  {
    id: 9,
    name: "Trần Nhân Tông",
    image: "https://www.cdspkg.edu.vn/images/tin-tong-hop/nam_2021/phat_hoang_nhan_tong/1.jpg",
    wikiSearchTerms: ["Trần Nhân Tông", "Trần Khâm"]
  },
  {
    id: 10,
    name: "Trần Hưng Đạo",
    image: "https://cdn-i.vtcnews.vn/resize/ma/upload/2023/02/12/chuyen-it-biet-noi-ben-song-voi-chien-cua-tran-hung-dao-bi-sa-lay-8-20125397.jpg",
    wikiSearchTerms: ["Trần Hưng Đạo", "Trần Quốc Tuấn", "Hưng Đạo Vương"]
  },
  {
    id: 11,
    name: "Lê Thái Tổ",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZyQmEB9hL1cN_MkRJRfkm1-4wgTttVhf8lw&s",
    wikiSearchTerms: ["Lê Thái Tổ", "Lê Lợi", "Bình Định Vương"]
  },
  {
    id: 12,
    name: "Nguyễn Trãi",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Nguyen_Trai.jpg/1200px-Nguyen_Trai.jpg",
    wikiSearchTerms: ["Nguyễn Trãi", "Ức Trai"]
  },
  {
    id: 13,
    name: "Quang Trung",
    image: "https://upload.wikimedia.org/wikipedia/commons/5/59/Quang_Trung_statue_02.jpg",
    wikiSearchTerms: ["Quang Trung", "Nguyễn Huệ", "Bắc Bình Vương"]
  },
  {
    id: 14,
    name: "Hồ Chí Minh",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Ho_Chi_Minh_1946.jpg/250px-Ho_Chi_Minh_1946.jpg",
    wikiSearchTerms: ["Hồ Chí Minh", "Nguyễn Sinh Cung", "Nguyễn Tất Thành", "Nguyễn Ái Quốc"]
  },
  {
    id: 15,
    name: "Võ Nguyên Giáp",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYUzwFlpacskvOrw70QTrol1Wy4AsOc79k7A&s",
    wikiSearchTerms: ["Võ Nguyên Giáp", "Đại tướng Võ Nguyên Giáp"]
  }
];

function Generals() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedGeneral, setSelectedGeneral] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generalDetail, setGeneralDetail] = useState(null);
  const [cardsLoading, setCardsLoading] = useState(true);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [contentLoaded, setContentLoaded] = useState(false);

  const cleanContent = (content) => {
    if (!content) return '';
    
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;

    // Loại bỏ các phần tử không cần thiết
    const removeSelectors = [
      'script', 'style',
      '.reference', '.references', '.reflist',
      '.navigation-not-searchable', '.noprint',
      '.mw-editsection', 'table',
      '.mbox-small', '.ambox', '.navbox',
      '.metadata', '.catlinks', '.hatnote',
      '.portal', '.sister-project',
      '.seealso', '.external',
      '#Xem_thêm', '#Tham_khảo',
      '#Liên_kết_ngoài', '#Chú_thích',
      '.mw-references-wrap', '.error',
      '.mw-empty-elt', '.reference-text',
      '.mw-headline', '.thumbinner',
      '.magnify', '.internal'
    ];

    removeSelectors.forEach(selector => {
      tempDiv.querySelectorAll(selector).forEach(el => el.remove());
    });

    // Gộp tất cả nội dung thành một
    const allContent = [];
    const contentElements = tempDiv.querySelectorAll('p, h2, h3, h4');
    contentElements.forEach(el => {
      if (el.textContent.trim()) {
        // Bỏ qua các tiêu đề không cần thiết
        const skipTitles = ['tham khảo', 'chú thích', 'xem thêm', 'liên kết ngoài', 'nguồn gốc'];
        const text = el.textContent.toLowerCase();
        if (!skipTitles.some(title => text.includes(title))) {
          allContent.push(el.outerHTML);
        }
      }
    });

    // Format lại nội dung
    const formattedContent = allContent
      .join('')
      .replace(/\s+/g, ' ')
      .replace(/<\/p><p>/g, '</p>\n<p>');

    // Tạo section tổng quan
    return `
      <div class="overview-content">
        ${formattedContent}
      </div>
    `;
  };

  const processWikiContent = (contentData) => {
    const content = cleanContent(contentData.parse.text['*']);
    
    // Chỉ tạo một section Tổng quan
    return [{
      title: 'Tổng quan',
      level: 1,
      content: content
    }];
  };

  const fetchWikiContent = useCallback(async (generalName, alternativeNames = []) => {
    setLoading(true);
    setImageLoading(true);
    try {
      const baseUrl = 'https://vi.wikipedia.org/w/api.php';
      
      // Tìm trang Wikipedia phù hợp
      const searchResults = await Promise.all(
        [generalName, ...alternativeNames].map(async (term) => {
          const searchParams = new URLSearchParams({
            action: 'query',
            format: 'json',
            list: 'search',
            srsearch: term,
            srlimit: 1,
            origin: '*'
          });

          const response = await fetch(`${baseUrl}?${searchParams}`);
          const data = await response.json();
          return data?.query?.search?.[0];
        })
      );

      const bestMatch = searchResults.find(result => result?.title);
      if (!bestMatch) throw new Error('Không tìm thấy thông tin');

      // Lấy thông tin hình ảnh từ Wikipedia
      const imageParams = new URLSearchParams({
        action: 'query',
        format: 'json',
        titles: bestMatch.title,
        prop: 'pageimages',
        pithumbsize: 1000,
        origin: '*'
      });

      const imageResponse = await fetch(`${baseUrl}?${imageParams}`);
      const imageData = await imageResponse.json();
      const page = Object.values(imageData.query.pages)[0];
      const wikiImage = page.thumbnail?.source;

      // Lấy nội dung từ Wikipedia
      const contentParams = new URLSearchParams({
        action: 'parse',
        format: 'json',
        page: bestMatch.title,
        prop: 'text|sections',
        origin: '*'
      });

      const contentResponse = await fetch(`${baseUrl}?${contentParams}`);
      const contentData = await contentResponse.json();
      
      // Sử dụng hàm processWikiContent mới
      const sections = processWikiContent(contentData);

      setGeneralDetail({
        name: bestMatch.title,
        image: wikiImage || selectedGeneral?.image,
        sections: sections,
        url: `https://vi.wikipedia.org/wiki/${encodeURIComponent(bestMatch.title)}`
      });

    } catch (error) {
      console.error('Error:', error);
      message.error('Không thể tải thông tin. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
      setImageLoading(false);
    }
  }, [selectedGeneral]);

  const handleGeneralClick = (general) => {
    setSelectedGeneral(general);
    setModalVisible(true);
    setGeneralDetail(null);
    setLoading(true);
    fetchWikiContent(general.name, general.wikiSearchTerms);
  };

  const handleAIAnalysis = async () => {
    if (analysisLoading || aiAnalysis) return;
    
    setAnalysisLoading(true);
    try {
      // Lấy nội dung từ section Tổng quan
      const overviewSection = generalDetail.sections.find(
        section => section.title.toLowerCase() === 'tổng quan'
      );
      
      if (!overviewSection) {
        throw new Error('Không tìm thấy nội dung để phân tích');
      }

      // Làm sạch nội dung HTML trước khi gửi đi
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = overviewSection.content;
      const cleanText = tempDiv.textContent.trim();

      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: cleanText,
          name: generalDetail.name
        })
      });

      if (!response.ok) {
        throw new Error('Lỗi khi phân tích');
      }

      const data = await response.json();
      if (!data.analysis) {
        throw new Error('Không nhận được kết quả phân tích');
      }

      setAiAnalysis(data.analysis);
    } catch (error) {
      console.error('Error getting AI analysis:', error);
      message.error('Không thể phân tích nội dung. Vui lòng thử lại sau.');
    } finally {
      setAnalysisLoading(false);
    }
  };

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setCardsLoading(false);
    }, 1500);
  }, []);

  useEffect(() => {
    if (!loading && generalDetail) {
      // Đợi một chút để content render xong
      setTimeout(() => {
        setContentLoaded(true);
      }, 100);
    } else {
      setContentLoaded(false);
    }
  }, [loading, generalDetail]);

  const AIButton = ({ loading, analysis, onAnalyze }) => {
    const items = analysis ? [
      {
        key: '1',
        label: (
          <div className="ai-analysis-content">
            <Title level={4}>Phân tích của AI</Title>
            <div className="analysis-text">
              {analysis.split('\n').map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>
          </div>
        ),
      },
    ] : [];

    return (
      <div className="ai-button-container">
        <Dropdown
          menu={{ items }}
          trigger={['click']}
          placement="bottomLeft"
          overlayClassName="ai-analysis-dropdown"
          disabled={loading}
        >
          <Button
            type="primary"
            icon={<RobotOutlined />}
            loading={loading}
            onClick={e => {
              if (!analysis) {
                e.stopPropagation();
                onAnalyze();
              }
            }}
            className="ai-button"
          >
            {!analysis && "AI Phân tích"}
          </Button>
        </Dropdown>
      </div>
    );
  };

  return (
    <div className="generals-page">
      <Title level={2} className="page-title">
        Các anh hùng dân tộc
      </Title>

      <div className="generals-grid">
        {generalsData.map(general => (
          <Card
            key={general.id}
            hoverable
            className={`general-card ${cardsLoading ? 'loading' : ''}`}
            cover={<img alt={general.name} src={general.image} />}
            onClick={() => handleGeneralClick(general)}
          >
            <Card.Meta title={general.name} />
          </Card>
        ))}
      </div>

      <Modal
        title={null}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setGeneralDetail(null);
          setLoading(false);
          setAiAnalysis(null);
        }}
        width="auto"
        footer={null}
        className="general-detail-modal"
        centered={false}
        maskClosable={false}
        closeIcon={<CloseOutlined />}
        style={{ 
          position: 'fixed',
          top: 50,
          right: 50,
          bottom: 50,
          margin: 0,
          padding: 0
        }}
      >
        <div className="modal-content">
          <Spin spinning={loading} tip="Đang tải thông tin..." size="large">
            {generalDetail && (
              <div className={`content-layout ${contentLoaded ? 'loaded' : ''}`}>
                <div className="article-header">
                  <Title level={1} className="article-title">
                    {generalDetail.name}
                  </Title>
                  <AIButton 
                    loading={analysisLoading}
                    analysis={aiAnalysis}
                    onAnalyze={handleAIAnalysis}
                  />
                </div>

                <div className={`article-body ${loading ? 'loading' : ''}`}>
                  <div className="article-image-section">
                    <div className={`image-container ${imageLoading ? 'loading' : ''}`}>
                      <Image
                        className="article-image"
                        src={generalDetail.image}
                        alt={generalDetail.name}
                        fallback="/images/default-general.jpg"
                        preview={{
                          mask: <div>Xem ảnh lớn</div>,
                          maskClassName: "image-preview-mask"
                        }}
                        onLoad={() => setImageLoading(false)}
                      />
                      {imageLoading && (
                        <div className="image-loading-overlay">
                          <Spin size="large" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="article-content">
                    <div className="info-grid">
                      {loading ? (
                        <div className="content-loading" />
                      ) : (
                        generalDetail.sections.map((section, index) => (
                          <div 
                            key={index} 
                            className={`content-section ${
                              section.title.toLowerCase().includes('tổng quan') ? 'overview-section' : ''
                            }`}
                          >
                            <Title level={section.level + 2} className="section-title">
                              {section.title}
                            </Title>
                            <div 
                              className="section-content"
                              dangerouslySetInnerHTML={{ __html: section.content }} 
                            />
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                <div className="wiki-source">
                  <a 
                    href={generalDetail.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="wiki-link"
                  >
                    Xem thêm trên Wikipedia
                  </a>
                </div>
              </div>
            )}
          </Spin>
        </div>
      </Modal>
    </div>
  );
}

export default Generals;