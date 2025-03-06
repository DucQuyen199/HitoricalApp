import React, { useState, useEffect, useCallback } from 'react';
import { Card, Typography, Row, Col, Tag, Modal, Image, Spin, Collapse, Button, Dropdown, message } from 'antd';
import styled from 'styled-components';
import { EnvironmentOutlined, CalendarOutlined, CloseOutlined, RobotOutlined, LoadingOutlined, CaretRightOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Title, Paragraph } = Typography;
const { Panel } = Collapse;

// Thêm styled component cho BattlesWrapper
const BattlesWrapper = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  margin-top: -95px;

  .battles-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 24px;
    padding: 20px;
  }

  .battle-card {
    width: 100%;
    transition: all 0.3s ease;
    border-radius: 12px;
    overflow: hidden;
    height: 100%;
    
    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 20px rgba(0,0,0,0.15);
    }

    img {
      height: 250px;
      object-fit: cover;
    }
  }

  .general-detail-modal {
    .ant-modal-content {
      height: 90vh;
      max-height: 800px;
      overflow: hidden;
      border-radius: 16px;
      
      .modal-content {
        height: 100%;
        overflow: hidden;
        padding: 24px;

        .content-layout {
          height: 100%;
          display: flex;
          flex-direction: column;

          .article-header {
            flex-shrink: 0;
            margin-bottom: 16px;
          }

          .article-body {
            flex: 1;
            overflow: hidden;
            display: grid;
            grid-template-columns: 320px 1fr;
            gap: 24px;

            .article-image-section {
              overflow-y: auto;
              padding-right: 12px;
              height: 100%;

              &::-webkit-scrollbar {
                width: 6px;
              }

              &::-webkit-scrollbar-thumb {
                background: #d9d9d9;
                border-radius: 3px;
              }
            }

            .article-content {
              overflow-y: auto;
              padding-right: 12px;
              height: 100%;

              &::-webkit-scrollbar {
                width: 6px;
              }

              &::-webkit-scrollbar-thumb {
                background: #d9d9d9;
                border-radius: 3px;
              }

              .info-grid {
                .content-section {
                  background: white;
                  border-radius: 12px;
                  padding: 16px;
                  margin-bottom: 16px;

                  &:last-child {
                    margin-bottom: 0;
                  }

                  .section-title {
                    font-size: 18px;
                    margin-bottom: 12px;
                  }

                  .section-content {
                    font-size: 14px;
                    line-height: 1.6;
                    color: #333;
                    text-align: justify;
                  }
                }
              }
            }
          }

          .wiki-source {
            flex-shrink: 0;
            margin-top: 16px;
            text-align: center;
          }
        }
      }
    }
  }

  @media (max-width: 1024px) {
    .article-body {
      grid-template-columns: 1fr !important;
      
      .article-image-section {
        position: relative !important;
        top: 0 !important;
        margin-bottom: 24px;
      }
    }
  }

  @media (max-width: 768px) {
    .general-detail-modal {
      .ant-modal-content {
        .modal-content {
          padding: 16px;

          .article-body {
            grid-template-columns: 1fr;

            .article-image-section {
              max-height: 400px;
            }
          }
        }
      }
    }
  }

  .modal-content {
    .section-content {
      img {
        max-width: 100%;
        height: auto;
        border-radius: 8px;
        margin: 16px 0;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        transition: transform 0.3s ease;

        &:hover {
          transform: scale(1.02);
        }
      }

      figure {
        margin: 16px 0;
        text-align: center;

        figcaption {
          font-size: 14px;
          color: #666;
          margin-top: 8px;
        }
      }
    }
  }

  .image-gallery {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 12px;
    margin-top: 16px;
    
    .gallery-image {
      width: 100%;
      height: 100px;
      object-fit: cover;
      border-radius: 8px;
      cursor: pointer;
      transition: transform 0.3s ease;
      
      &:hover {
        transform: scale(1.05);
      }
    }
  }
`;

// Thêm styled components cho phần phân tích AI
const AnalysisSection = styled.div`
  margin-top: 24px;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
  
  .analysis-header {
    background: #1890ff;
    color: white;
    padding: 12px 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    
    .title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 16px;
      font-weight: 600;
    }
    
    .status {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  }

  .analysis-content {
    background: white;
    padding: 0;
    max-height: 0;
    opacity: 0;
    transition: all 0.3s ease;
    
    &.expanded {
      padding: 16px;
      max-height: 1000px;
      opacity: 1;
    }
  }
`;

// Đặt các hàm helper bên ngoài component để tái sử dụng
const isUnwantedSection = (title) => {
  const unwantedTitles = [
    'mục lục',
    'chú thích',
    'xem thêm',
    'tài liệu tham khảo',
    'liên kết ngoài',
    'tham khảo',
    'ghi chú',
    'nguồn',
    'thư mục',
    'tham chiếu',
    'chú dẫn',
    'phụ lục'
  ];
  return unwantedTitles.some(unwanted => 
    title.toLowerCase().includes(unwanted.toLowerCase())
  );
};

const isUnrelatedContent = (content) => {
  const unrelatedKeywords = [
    'Một phần của loạt bài về',
    'Xem thêm',
    'Tham khảo',
    'Chú thích',
    '[cần dẫn nguồn]',
    '[1]',
    '[2]',
    '[3]',
    '[4]',
    '[5]'
  ];
  
  return unrelatedKeywords.some(keyword => 
    content.toLowerCase().includes(keyword.toLowerCase())
  );
};

// Cập nhật hàm cleanContent để loại bỏ các phần không mong muốn
const cleanContent = (content) => {
  if (!content) return '';
  
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = content;

  // Loại bỏ các phần không cần thiết
  const removeSelectors = [
    '.mw-editsection',  // Loại bỏ [sửa | sửa mã nguồn]
    '.reference',        // Loại bỏ tham chiếu [1], [2]...
    '.references',      // Loại bỏ phần tham khảo
    '.reflist',         // Loại bỏ danh sách tham khảo
    '.hatnote',         // Loại bỏ ghi chú mũ
    '.navigation-not-searchable', // Loại bỏ phần điều hướng
    '.mbox',            // Loại bỏ message box
    '.ambox',           // Loại bỏ article message box
    '.navbox',          // Loại bỏ navigation box
    '.metadata',        // Loại bỏ metadata
    '.catlinks',        // Loại bỏ category links
    '.printfooter',     // Loại bỏ print footer
    '#toc',            // Loại bỏ mục lục
    '.toc',            // Loại bỏ mục lục
    '.portal',         // Loại bỏ portal links
    '.sister-project', // Loại bỏ sister project links
    '.noprint',        // Loại bỏ nội dung không in
    '.error',          // Loại bỏ thông báo lỗi
    '.mw-empty-elt',   // Loại bỏ phần tử rỗng
    '.mw-headline',    // Loại bỏ headline markers
    '.thumbinner',     // Loại bỏ thumbnail containers
    '.magnify',        // Loại bỏ nút phóng to
    '.internal',       // Loại bỏ internal links
    'table',          // Loại bỏ tất cả bảng
    'style',          // Loại bỏ style tags
    'script'          // Loại bỏ script tags
  ];

  removeSelectors.forEach(selector => {
    tempDiv.querySelectorAll(selector).forEach(el => el.remove());
  });

  // Loại bỏ [sửa | sửa mã nguồn] và các biến thể của nó
  tempDiv.innerHTML = tempDiv.innerHTML.replace(/\[\s*(sửa|chỉnh sửa|sửa đổi|sửa mã nguồn|chỉnh sửa mã nguồn)\s*\|\s*(sửa|chỉnh sửa|sửa đổi|sửa mã nguồn|chỉnh sửa mã nguồn)\s*\]/g, '');
  
  // Loại bỏ số trong ngoặc vuông [1], [2], [18]...
  tempDiv.innerHTML = tempDiv.innerHTML.replace(/\[\d+\]/g, '');

  // Loại bỏ các phần "Xem thêm", "Tham khảo", "Chú thích", "Liên kết ngoài"
  const unwantedSections = [
    'Xem thêm',
    'Tham khảo',
    'Chú thích',
    'Liên kết ngoài',
    'Ghi chú',
    'Tài liệu',
    'Nguồn gốc'
  ];

  unwantedSections.forEach(section => {
    const sectionRegex = new RegExp(`<h[2-6][^>]*>${section}.*?</h[2-6]>.*?(?=<h[2-6]|$)`, 'gs');
    tempDiv.innerHTML = tempDiv.innerHTML.replace(sectionRegex, '');
  });

  // Loại bỏ tất cả các link nhưng giữ lại text
  tempDiv.querySelectorAll('a').forEach(link => {
    const text = link.textContent;
    const span = document.createElement('span');
    span.textContent = text;
    link.parentNode.replaceChild(span, link);
  });

  // Loại bỏ các khoảng trắng và xuống dòng thừa
  const cleanText = tempDiv.innerHTML
    .replace(/\s+/g, ' ')
    .replace(/>\s+</g, '><')
    .replace(/\n+/g, '\n')
    .trim();

  tempDiv.innerHTML = cleanText;

  // Thêm style để kiểm soát khoảng cách
  const styles = `
    <style>
      p {
        margin: 0 0 8px 0;
        text-align: justify;
      }
      p:last-child {
        margin-bottom: 0;
      }
      br {
        display: none;
      }
      .section-content > *:not(:last-child) {
        margin-bottom: 8px;
      }
      .section-content {
        line-height: 1.5;
      }
    </style>
  `;

  return styles + tempDiv.innerHTML;
};

// Thêm hàm để lấy hình ảnh từ bài viết
const extractImagesFromContent = (content) => {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = content;
  
  const images = [];
  tempDiv.querySelectorAll('img').forEach(img => {
    const src = img.getAttribute('src');
    if (src) {
      let fullSizeUrl = src;
      
      // Chuyển đổi URL tương đối thành tuyệt đối
      if (src.startsWith('//')) {
        fullSizeUrl = 'https:' + src;
      } else if (src.startsWith('/')) {
        fullSizeUrl = 'https://vi.wikipedia.org' + src;
      }
      
      // Chuyển thumbnail thành ảnh full size
      if (fullSizeUrl.includes('/thumb/')) {
        const parts = fullSizeUrl.split('/thumb/');
        if (parts.length > 1) {
          fullSizeUrl = parts[0] + '/' + parts[1].split('/').slice(0, -1).join('/');
        }
      }
      
      images.push({
        url: fullSizeUrl,
        caption: img.getAttribute('alt') || ''
      });
    }
  });
  
  return images;
};

function Battles() {
  // Dữ liệu cơ bản luôn có sẵn
  const battlesData = [
    {
      id: 1,
      name: "Khởi nghĩa Hai Bà Trưng",
      year: "40-43",
      location: "Mê Linh",
      commander: "Hai Bà Trưng",
      enemy: "Nhà Hán",
      image: "https://i0.wp.com/lichsu.blog/wp-content/uploads/2024/03/Hai_Ba_Trung_danh_duoi_giac_Han.webp?fit=2048%2C1512&ssl=1",
      wikiSearchTerms: ["Khởi nghĩa Hai Bà Trưng", "Trưng Trắc", "Trưng Nữ Vương"]
    },
    {
      id: 2,
      name: "Khởi nghĩa Bà Triệu",
      year: "248",
      location: "Nông Cống, Thanh Hóa",
      commander: "Bà Triệu (Triệu Thị Trinh)",
      enemy: "Nhà Ngô",
      image: "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcRgC8BbQkqEKx_R_4hFDsAnhm5xTZUeq7GS2oZoYS-kNYHa6xw8dX29WPyFNp9vX2urBg7y8vqy6SzUD8mFDyG51g",
      wikiSearchTerms: ["Khởi nghĩa Bà Triệu", "Triệu Thị Trinh"]
    },
    {
      id: 3,
      name: "Trận Bạch Đằng",
      year: "938",
      location: "Sông Bạch Đằng",
      commander: "Ngô Quyền",
      enemy: "Quân Nam Hán",
      image: "http://bachdanggiang.vn/wp-content/uploads/2019/12/su-kien-ls-1-1.png",
      wikiSearchTerms: ["Trận Bạch Đằng", "Ngô Quyền"]
    },
    {
      id: 4,
      name: "Trận Như Nguyệt",
      year: "1077",
      location: "Sông Như Nguyệt, Bắc Ninh",
      commander: "Lý Thường Kiệt",
      enemy: "Quân Tống",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Tr%E1%BA%ADn_Nh%C6%B0_Nguy%E1%BB%87t.png/560px-Tr%E1%BA%ADn_Nh%C6%B0_Nguy%E1%BB%87t.png",
      wikiSearchTerms: ["Trận Như Nguyệt", "Lý Thường Kiệt"]
    },
    {
      id: 5,
      name: "Trận Chi Lăng - Xương Giang",
      year: "1427",
      location: "Chi Lăng, Xương Giang",
      commander: "Lê Lợi, Nguyễn Trãi",
      enemy: "Quân Minh",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVEdnc7H4PknaQ0faYz0pcLLr2ZygAFBtsTQ&s",
      wikiSearchTerms: ["Trận Chi Lăng - Xương Giang", "Lê Lợi", "Nguyễn Trãi"]
    },
    {
      id: 6,
      name: "Trận Đống Đa",
      year: "1789",
      location: "Đống Đa, Hà Nội",
      commander: "Quang Trung Nguyễn Huệ",
      enemy: "Quân Thanh",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7YOE6GRSXixWPryVUFrE03qJ75etrxjXxgom1GCFZ52QGUcJOQNgdkPISeiCnNh6dk1Y&usqp=CAU",
      wikiSearchTerms: ["Trận Đống Đa", "Quang Trung Nguyễn Huệ"]
    },
    {
      id: 7,
      name: "Trận Điện Biên Phủ",
      year: "1954",
      location: "Điện Biên Phủ",
      commander: "Võ Nguyên Giáp",
      enemy: "Quân đội Pháp",
      image: "https://icdn.dantri.com.vn/I3KdHJtU0B3ELPKGaTLe/Image/2014/04/dbp2-4ad4a.jpg",
      wikiSearchTerms: ["Trận Điện Biên Phủ", "Võ Nguyên Giáp"]
    },
    {
      id: 8,
      name: "Trận Rạch Gầm - Xoài Mút",
      year: "1785",
      location: "Tiền Giang",
      commander: "Nguyễn Huệ",
      enemy: "Quân Xiêm",
      image: "https://cloudfront-us-east-1.images.arcpublishing.com/radiofreeasia/2NGVEZU5QR57YHSXSGHQFZAGX4.jpg",
      wikiSearchTerms: ["Trận Rạch Gầm - Xoài Mút", "Nguyễn Huệ"]
    },
    {
      id: 9,
      name: "Điện Biên Phủ Trên Không",
      year: "1972",
      location: "Hà Nội",
      commander: "Phùng Thế Tài",
      enemy: "Không quân Mỹ",
      image: "https://ddk.1cdn.vn/2022/12/17/image.daidoanket.vn-images-upload-nghipm-12172022-_trang-41.jpg",
      wikiSearchTerms: ["Điện Biên Phủ Trên Không", "Phùng Thế Tài"]
    },
    {
      id: 10,
      name: "Chiến dịch Hồ Chí Minh",
      year: "1975",
      location: "Sài Gòn",
      commander: "Văn Tiến Dũng",
      enemy: "Quân đội Việt Nam Cộng hòa",
      image: "https://upload.wikimedia.org/wikipedia/vi/9/9c/BuiQuangThan.jpg",
      wikiSearchTerms: ["Chiến dịch Hồ Chí Minh", "Văn Tiến Dũng"]
    },
    {
      id: 11,
      name: "Trận Tốt Động - Chúc Động",
      year: "1426",
      location: "Chương Mỹ, Hà Nội",
      commander: "Lê Lợi, Nguyễn Trãi",
      enemy: "Quân Minh",
      description: "Chiến thắng mở đầu cho cuộc kháng chiến chống Minh",
      image: "https://i.ytimg.com/vi/RSzhpX_WZ_Y/sddefault.jpg",
      wikiSearchTerms: ["Trận Tốt Động - Chúc Động", "Lê Lợi", "Nguyễn Trãi"]
    },
    {
      id: 12,
      name: "Trận Vạn Kiếp",
      year: "1285",
      location: "Vạn Kiếp, Quảng Ninh",
      commander: "Trần Hưng Đạo",
      enemy: "Quân Nguyên Mông",
      description: "Trận đánh then chốt trong cuộc kháng chiến chống Nguyên lần 2",
      image: "https://vanhoavaphattrien.vn/uploads/images/blog/photongbientap/2023/01/07/d1aq-thoathoan-1673085314.jpg",
      wikiSearchTerms: ["Trận Vạn Kiếp", "Trần Hưng Đạo"]
    },
    {
      id: 13,
      name: "Trận Cầu Giấy",
      year: "1873",
      location: "Cầu Giấy, Hà Nội",
      commander: "Hoàng Diệu",
      enemy: "Quân Pháp",
      description: "Trận đánh tiêu biểu chống thực dân Pháp, tiêu diệt Francis Garnier",
      image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiVfoDd1PDNCrlnfH6MljcYeINJXx4Fp5rdCZ82-7CVYuC8kkArtY9TlGs4hXsgqyIVS5NSYENY2x4OQ3YZTwnNpF4gSlTpwSyO7Hd9mTvE_CeMohyphenhyphensIymGnuIY_GO192upiXY6AS-IMcXk/s1600/12.png",
      wikiSearchTerms: ["Trận Cầu Giấy", "Hoàng Diệu"]
    },
    {
      id: 14,
      name: "Chiến dịch Biên Giới",
      year: "1950",
      location: "Cao Bằng",
      commander: "Võ Nguyên Giáp",
      enemy: "Quân Pháp",
      description: "Chiến thắng mở đầu cho cuộc tiến công chiến lược Đông - Xuân 1950",
      image: "https://file1.dangcongsan.vn/data/0/images/2020/09/15/phuongdt/anh-1.jpg",
      wikiSearchTerms: ["Chiến dịch Biên Giới", "Võ Nguyên Giáp"]
    },
    {
      id: 15,
      name: "Kháng Chiến Chống Quân Mông Nguyên Lần 1",
      year: "1258",
      location: "Đông Triều, Quảng Ninh",
      commander: "Trần Thủ Độ",
      enemy: "Quân Nguyên Mông lần 1",
      description: "Trận đánh đầu tiên chống quân Nguyên Mông xâm lược",
      image: "https://www.worldhistory.org/img/r/p/750x750/11455.jpg?v=1676591103",
      wikiSearchTerms: ["Kháng Chiến Chống Quân Mông Nguyên Lần 1", "Trần Thủ Độ"]
    },
    {
      id: 16,
      name: "Trận Hàm Tử - Chương Dương",
      year: "1285",
      location: "Hưng Yên",
      commander: "Trần Nhật Duật, Trần Quốc Tuấn",
      enemy: "Quân Nguyên Mông lần 2",
      description: "Chiến thắng mở đầu cho cuộc phản công quân Nguyên lần thứ hai",
      image: "https://danviet.mediacdn.vn/upload/2-2019/images/2019-06-23/dai-chien-Chuong-Duong---Ham-Tu-dai-Viet-day-lui-500000-quan-Nguyen-mc-02-1561278399-width640height487.jpg",
      wikiSearchTerms: ["Trận Hàm Tử - Chương Dương", "Trần Nhật Duật", "Trần Quốc Tuấn"]
    },
    {
      id: 17,
      name: "Trận Tây Kết",
      year: "1285",
      location: "Khoái Châu, Hưng Yên",
      commander: "Trần Hưng Đạo",
      enemy: "Quân Nguyên Mông",
      description: "Trận đánh tiêu diệt tướng giặc Toa Đô trong cuộc kháng chiến chống Nguyên Mông",
      image: "https://upload.wikimedia.org/wikipedia/vi/thumb/3/3d/Chongquannguyenlan2-th%E1%BB%AD.gif/440px-Chongquannguyenlan2-th%E1%BB%AD.gif",
      wikiSearchTerms: ["Trận Tây Kết", "Trần Hưng Đạo"]
    }
  ];

  const [selectedBattle, setSelectedBattle] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [battleDetail, setBattleDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [contentLoaded, setContentLoaded] = useState(false);
  const [battleImages, setBattleImages] = useState([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [expanded, setExpanded] = useState(false);

  // Thêm useEffect để handle content loaded
  useEffect(() => {
    if (!loading && battleDetail) {
      // Đợi một chút để content render xong
      setTimeout(() => {
        setContentLoaded(true);
      }, 100);
    } else {
      setContentLoaded(false);
    }
  }, [loading, battleDetail]);

  // Thêm hàm fetchWikiContent
  const fetchWikiContent = useCallback(async (battleName, searchTerms = []) => {
    setLoading(true);
    try {
      const baseUrl = 'https://vi.wikipedia.org/w/api.php';
      
      // Tìm trang Wikipedia phù hợp
      const searchResults = await Promise.all(
        [battleName, ...searchTerms].map(async (term) => {
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

      // Lấy nội dung trang
      const pageContent = await fetch(`${baseUrl}?${new URLSearchParams({
        action: 'parse',
        format: 'json',
        page: bestMatch.title,
        prop: 'text|images',
        origin: '*'
      })}`);

      const contentData = await pageContent.json();
      const content = contentData?.parse?.text?.['*'];
      
      if (!content) throw new Error('Không tìm thấy nội dung');

      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = content;

      // Lấy danh sách hình ảnh từ bài viết
      const images = extractImagesFromContent(content);
      
      // Lấy hình ảnh đầu tiên làm ảnh chính nếu có
      const mainImage = images.length > 0 ? images[0].url : selectedBattle?.image;

      let currentSection = {
        title: 'Tổng quan',
        content: '',
        level: 0
      };
      
      const sections = [];
      const relevantSectionTitles = [
        'tiểu sử',
        'thân thế',
        'cuộc đời',
        'diễn biến',
        'kết quả',
        'ý nghĩa',
        'chi tiết'
      ];

      // Xử lý từng phần tử trong nội dung
      Array.from(tempDiv.children).forEach(element => {
        if (['H2', 'H3', 'H4'].includes(element.tagName)) {
          if (currentSection.content) {
            sections.push({...currentSection});
          }
          
          const title = element.textContent.replace(/[\[\d\]]/g, '').trim();
          const isRelevantSection = relevantSectionTitles.some(
            relevant => title.toLowerCase().includes(relevant)
          );

          if (isRelevantSection) {
            currentSection = {
              title: title,
              content: '',
              level: parseInt(element.tagName.substring(1)) - 1
            };
          } else {
            currentSection = null;
          }
        } else if (currentSection) {
          let content = element.outerHTML;
          content = cleanContent(content);
          if (content.trim()) {
            currentSection.content += content;
          }
        }
      });

      if (currentSection?.content) {
        sections.push({...currentSection});
      }

      setBattleDetail({
        name: bestMatch.title,
        image: mainImage,
        images: images,
        sections: sections.filter(section => section.content.trim() !== ''),
        url: `https://vi.wikipedia.org/wiki/${encodeURIComponent(bestMatch.title)}`
      });

    } catch (error) {
      console.error('Error:', error);
      setBattleDetail({
        name: battleName,
        image: selectedBattle?.image,
        sections: [{
          title: 'Lỗi',
          content: 'Không thể tải thông tin từ Wikipedia.'
        }],
        url: `https://vi.wikipedia.org/wiki/${encodeURIComponent(battleName)}`
      });
    } finally {
      setLoading(false);
      setContentLoaded(true);
    }
  }, [selectedBattle]);

  // Hàm xử lý khi click vào một trận đánh
  const handleBattleClick = (battle) => {
    setSelectedBattle(battle);
    setModalVisible(true);
    setBattleDetail(null);
    setLoading(true);
    setImageLoading(true);
    fetchWikiContent(battle.name, battle.wikiSearchTerms);
  };

  // Cập nhật hàm showBattleDetails
  const showBattleDetails = async (battle) => {
    setSelectedBattle(battle);
    setModalVisible(true);
    setBattleDetail(null);
    
    // Chỉ fetch wiki content khi modal được mở
    if (battle.wikiSearchTerms) {
      await fetchWikiContent(battle.name, battle.wikiSearchTerms);
    }
  };

  // Hàm phân tích nội dung
  const analyzeContent = async (content) => {
    try {
      setAnalyzing(true);
      setAnalysis(null);
      setExpanded(false);

      const response = await axios.post('/api/analyze', {
        content: content,
        name: selectedBattle?.name
      });

      if (response.data?.analysis) {
        setAnalysis(response.data.analysis);
        // Tự động mở rộng sau khi có kết quả
        setTimeout(() => setExpanded(true), 300);
      }
    } catch (error) {
      message.error('Không thể phân tích nội dung: ' + error.message);
    } finally {
      setAnalyzing(false);
    }
  };

  // Thêm hàm xử lý khi click vào header
  const handleAnalysisClick = async () => {
    // Nếu đã có phân tích, chỉ toggle expanded
    if (analysis) {
      setExpanded(!expanded);
      return;
    }

    // Nếu chưa phân tích, bắt đầu phân tích
    if (battleDetail) {
      const content = battleDetail.sections
        .map(section => `${section.title}\n${section.content}`)
        .join('\n\n');
      await analyzeContent(content);
    }
  };

  if (loading) {
    return (
      <BattlesWrapper>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
          <p>Đang tải dữ liệu...</p>
        </div>
      </BattlesWrapper>
    );
  }

  return (
    <BattlesWrapper>
      <Title level={2} className="page-title">
        Các Trận Đánh Tiêu Biểu
      </Title>

      <div className="battles-grid">
        {battlesData.map(battle => (
          <Card
            key={battle.id}
            hoverable
            className="battle-card"
            cover={<img alt={battle.name} src={battle.image} />}
            onClick={() => handleBattleClick(battle)}
          >
            <Card.Meta title={battle.name} />
          </Card>
        ))}
      </div>

      <Modal
        title={null}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setBattleDetail(null);
          setLoading(false);
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
            {battleDetail && (
              <div className={`content-layout ${contentLoaded ? 'loaded' : ''}`}>
                <div className="article-header">
                  <Title level={1} className="article-title">
                    {battleDetail.name}
                  </Title>
                </div>

                <div className={`article-body ${loading ? 'loading' : ''}`}>
                  <div className="article-image-section">
                    <div className={`image-container ${imageLoading ? 'loading' : ''}`}>
                      <Image
                        className="article-image"
                        src={battleDetail.image}
                        alt={battleDetail.name}
                        fallback="/images/default-battle.jpg"
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
                    
                    {/* Thêm gallery ảnh nếu có nhiều hơn 1 ảnh */}
                    {battleDetail.images && battleDetail.images.length > 1 && (
                      <div className="image-gallery">
                        {battleDetail.images.slice(1).map((img, index) => (
                          <Image
                            key={index}
                            src={img.url}
                            alt={img.caption}
                            className="gallery-image"
                            preview={{
                              mask: <div>Xem ảnh lớn</div>
                            }}
                          />
                        ))}
                      </div>
                    )}
                    
                    <div className="battle-tags">
                      <Tag color="blue"><CalendarOutlined /> {selectedBattle?.year}</Tag>
                      <Tag color="green"><EnvironmentOutlined /> {selectedBattle?.location}</Tag>
                      <Tag color="red">Chỉ huy: {selectedBattle?.commander}</Tag>
                      <Tag color="orange">Đối thủ: {selectedBattle?.enemy}</Tag>
                    </div>
                  </div>

                  <div className="article-content">
                    <div className="info-grid">

                      {battleDetail.sections.map((section, index) => (
                        <div key={index} className="content-section">
                          <Title level={3} className="section-title">
                            {section.title}
                          </Title>
                          <div 
                            className="section-content"
                            dangerouslySetInnerHTML={{ __html: section.content }} 
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="wiki-source">
                  <a 
                    href={battleDetail.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="wiki-link"
                  >
                    Xem thêm trên Wikipedia
                  </a>
                </div>

                <AnalysisSection>
                  <div className="analysis-header" onClick={handleAnalysisClick}>
                    <div className="title">
                      <RobotOutlined />
                      <span>Phân tích AI</span>
                    </div>
                    <div className="status">
                      {analyzing ? (
                        <>
                          <LoadingOutlined />
                          <span>Đang phân tích...</span>
                        </>
                      ) : analysis ? (
                        <CaretRightOutlined 
                          rotate={expanded ? 90 : 0}
                          style={{ transition: 'all 0.3s' }}
                        />
                      ) : (
                        <span style={{ fontSize: '13px' }}>Click để phân tích</span>
                      )}
                    </div>
                  </div>
                  
                  <div className={`analysis-content ${expanded ? 'expanded' : ''}`}>
                    {analysis && (
                      <div className="analysis-result">
                        <div className="main-analysis">
                          {analysis}
                        </div>
                      </div>
                    )}
                  </div>
                </AnalysisSection>

              </div>
            )}
          </Spin>
        </div>
      </Modal>
    </BattlesWrapper>
  );
}

// Helper functions to extract information from Wikipedia text
const extractYear = (text) => {
  const yearRegex = /\b\d{3,4}(?:-\d{3,4})?\b/;
  const match = text.match(yearRegex);
  return match ? match[0] : '';
};

const extractLocation = (text) => {
  const locationRegex = /tại\s([^,.]+)/i;
  const match = text.match(locationRegex);
  return match ? match[1] : '';
};

const extractCommander = (text) => {
  const commanderRegex = /(?:dưới sự chỉ huy của|do|lãnh đạo bởi)\s([^,.]+)/i;
  const match = text.match(commanderRegex);
  return match ? match[1] : '';
};

const extractEnemy = (text) => {
  const enemyRegex = /(?:chống lại|đánh với|chống)\s([^,.]+)/i;
  const match = text.match(enemyRegex);
  return match ? match[1] : '';
};

const extractDetails = (text) => {
  return text.split(/[.!?]/)
    .map(s => s.trim())
    .filter(s => s.length > 10)
    .slice(0, 5);
};

export default Battles;