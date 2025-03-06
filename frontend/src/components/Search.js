import React, { useState, useEffect } from 'react';
import { Input, List, Image, Typography, Spin, Empty, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import axios from 'axios';
import styled from 'styled-components';

const { Search } = Input;
const { Title, Paragraph } = Typography;

const SearchContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px 20px 40px;
  margin-top: -60px; /* Di chuyển form lên trên */

  .search-header {
    text-align: center;
    margin-bottom: 30px;
    background: linear-gradient(135deg, #f0f2f5, #ffffff);
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  }

  .search-input {
    max-width: 700px;
    margin: 0 auto;
    
    .ant-input-search {
      .ant-input {
        height: 50px;
        font-size: 16px;
        padding-left: 20px;
      }
      
      .ant-input-search-button {
        height: 50px;
        width: 60px;
      }
    }
  }

  .search-results {
    margin-top: 30px;
    display: ${props => props.showResults ? 'block' : 'none'};
    background: white;
    padding: 24px;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  }

  .result-item {
    transition: all 0.3s ease;
    padding: 20px;
    border-radius: 8px;
    
    &:hover {
      background: #f5f5f5;
    }
  }

  .result-image {
    border-radius: 8px;
    overflow: hidden;
  }
`;

// Cập nhật danh sách từ khóa lịch sử
const HISTORICAL_KEYWORDS = {
  dynasties: [
    'nhà tiền lê', 'nhà hậu lê', 'nhà lý', 'nhà trần', 'nhà ngô', 
    'nhà đinh', 'nhà hồ', 'nhà nguyễn', 'nhà mạc', 'nhà tây sơn',
    'triều lê', 'triều lý', 'triều trần', 'triều nguyễn',
    'tiền lê', 'hậu lê', 'lê sơ', 'lê trung hưng'
  ],
  periods: [
    'thời kỳ bắc thuộc', 'thời kỳ độc lập', 'phong kiến', 
    'đại việt', 'đại nam', 'âu lạc', 'vân lang',
    'bắc thuộc', 'độc lập', 'tự chủ', 'phong kiến'
  ],
  events: [
    'khởi nghĩa', 'chiến tranh', 'cách mạng', 'phong trào', 
    'kháng chiến', 'chiến thắng', 'hòa ước', 'độc lập',
    'trận', 'cuộc chiến', 'biến', 'loạn', 'phong trào'
  ],
  figures: [
    'vua', 'hoàng đế', 'hoàng hậu', 'công chúa', 'hoàng tử',
    'tướng', 'quan', 'tiên chủ', 'thái tổ', 'thái tông', 'thánh tông',
    'anh tông', 'minh tông', 'hiến tông', 'túc tông', 'dụ tông', 'nghệ tông'
  ]
};

// Thêm hàm xử lý từ khóa tìm kiếm
const processSearchTerm = (term) => {
  // Chuẩn hóa từ khóa tìm kiếm
  const normalizedTerm = term.toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();

  // Tách các từ khóa
  const searchTerms = normalizedTerm.split(' ');

  // Tạo các biến thể của từ khóa
  const variations = [];
  if (searchTerms.length > 1) {
    variations.push(searchTerms.join(' ')); // Cụm từ đầy đủ
  }
  variations.push(...searchTerms); // Các từ riêng lẻ

  return {
    original: term,
    normalized: normalizedTerm,
    terms: variations
  };
};

function SearchComponent() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);

  useEffect(() => {
    const fromHome = localStorage.getItem('fromHome');
    if (fromHome) {
      localStorage.removeItem('fromHome');
    }
  }, []);

  const searchWikipedia = async (term) => {
    if (!term.trim()) return;
    
    try {
      setLoading(true);
      setSearchPerformed(true);

      // Xử lý từ khóa tìm kiếm
      const searchTerm = term.trim();

      // Tìm kiếm theo tiêu đề
      const searchUrl = `https://vi.wikipedia.org/w/api.php?${new URLSearchParams({
        action: 'query',
        list: 'search',
        srsearch: `intitle:${searchTerm}`, // Tìm trong tiêu đề
        format: 'json',
        origin: '*',
        utf8: '1',
        srlimit: 20
      })}`;

      const response = await axios.get(searchUrl);
      const searchResults = response.data?.query?.search || [];

      // Nếu không có kết quả theo tiêu đề, tìm trong toàn bộ nội dung
      if (searchResults.length === 0) {
        const fullSearchUrl = `https://vi.wikipedia.org/w/api.php?${new URLSearchParams({
          action: 'query',
          list: 'search',
          srsearch: `${searchTerm} (Việt Nam OR lịch sử)`,
          format: 'json',
          origin: '*',
          utf8: '1',
          srlimit: 20
        })}`;

        const fullResponse = await axios.get(fullSearchUrl);
        searchResults.push(...(fullResponse.data?.query?.search || []));
      }

      const detailedResults = await Promise.all(
        searchResults.map(async (result) => {
          const contentUrl = `https://vi.wikipedia.org/w/api.php?${new URLSearchParams({
            action: 'query',
            pageids: result.pageid,
            prop: 'extracts|pageimages|categories',
            exintro: '1',
            format: 'json',
            origin: '*',
            piprop: 'original',
            explaintext: '1'
          })}`;

          const contentResponse = await axios.get(contentUrl);
          const page = contentResponse.data.query.pages[result.pageid];
          const content = (page.extract || '').toLowerCase();
          const title = page.title.toLowerCase();
          const searchTermLower = searchTerm.toLowerCase();

          // Tính điểm phù hợp
          let relevanceScore = 0;

          // Điểm cho tiêu đề chính xác
          if (title === searchTermLower) {
            relevanceScore += 100;
          } else if (title.includes(searchTermLower)) {
            relevanceScore += 50;
          }

          // Điểm cho nội dung
          if (content.includes(searchTermLower)) {
            relevanceScore += 10;
            
            // Tính số lần xuất hiện trong nội dung
            const occurrences = (content.match(new RegExp(searchTermLower, 'g')) || []).length;
            relevanceScore += occurrences;
          }

          // Highlight từ khóa trong nội dung
          let highlightedExtract = page.extract;
          const regex = new RegExp(`(${searchTerm})`, 'gi');
          highlightedExtract = highlightedExtract?.replace(regex, '<mark>$1</mark>');

          return {
            title: page.title,
            extract: highlightedExtract,
            plainExtract: page.extract,
            image: page.original?.source,
            pageid: result.pageid,
            relevanceScore,
            isExactMatch: title === searchTermLower
          };
        })
      );

      // Sắp xếp và lọc kết quả
      const sortedResults = detailedResults
        .filter(result => result.relevanceScore > 0)
        .sort((a, b) => {
          // Ưu tiên kết quả khớp chính xác
          if (a.isExactMatch && !b.isExactMatch) return -1;
          if (!a.isExactMatch && b.isExactMatch) return 1;
          // Sau đó sắp xếp theo điểm
          return b.relevanceScore - a.relevanceScore;
        })
        .slice(0, 10);

      setResults(sortedResults);

    } catch (error) {
      console.error('Error searching Wikipedia:', error);
      message.error('Có lỗi khi tìm kiếm');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SearchContainer showResults={searchPerformed}>
      <div className="search-header">
        <Title level={2}>Tìm kiếm Lịch sử</Title>
        <Paragraph type="secondary">
          Khám phá thông tin về lịch sử Việt Nam qua các thời kỳ
        </Paragraph>
        <div className="search-input">
          <Search
            placeholder="Nhập từ khóa tìm kiếm (ví dụ: Lý Thái Tổ, Điện Biên Phủ...)"
            enterButton={<SearchOutlined />}
            size="large"
            onSearch={searchWikipedia}
            loading={loading}
          />
        </div>
      </div>

      <div className="search-results">
        <Spin spinning={loading}>
          {results && results.length > 0 ? (
            <List
              itemLayout="vertical"
              size="large"
              dataSource={results}
              renderItem={item => (
                <List.Item
                  className="result-item"
                  key={item.pageid}
                  extra={
                    item.image && (
                      <div className="result-image">
                        <Image
                          width={200}
                          alt={item.title}
                          src={item.image}
                          placeholder={
                            <div style={{ 
                              background: '#f5f5f5',
                              width: 200,
                              height: 150
                            }} />
                          }
                        />
                      </div>
                    )
                  }
                >
                  <List.Item.Meta
                    title={
                      <a
                        href={`https://vi.wikipedia.org/wiki?curid=${item.pageid}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {item.title}
                      </a>
                    }
                  />
                  {item.extract && (
                    <>
                      <div 
                        dangerouslySetInnerHTML={{ 
                          __html: item.extract || ''  // Thêm fallback empty string
                        }}
                        style={{ marginBottom: 8 }}
                      />
                    </>
                  )}
                </List.Item>
              )}
            />
          ) : searchPerformed && !loading && (
            <Empty 
              description="Không tìm thấy kết quả phù hợp"
              image={Empty.PRESENTED_IMAGE_SIMPLE} 
            />
          )}
        </Spin>
      </div>
    </SearchContainer>
  );
}

export default SearchComponent; 