import React from 'react';
import { Typography, Row, Col, Card, Image, Tag } from 'antd';
import styled from 'styled-components';
import { BookOutlined, HomeOutlined, CalendarOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const ScholarsWrapper = styled.div`
  padding: 20px 20px;
  max-width: 1200px;
  margin: 0 auto;
  margin-top: -85px;

  .scholar-card {
    width: 100%;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    border-radius: 12px;
    overflow: hidden;
    transition: all 0.3s ease;
    height: 100%;

    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 20px rgba(0,0,0,0.15);
    }

    .ant-card-cover {
      height: 300px;
      overflow: hidden;
      
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .ant-card-body {
      padding: 20px;
    }

    .scholar-tags {
      margin-top: 12px;
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
  }
`;

const scholarsData = [
  {
    id: 1,
    name: "Chu Văn An",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Institut_des_Fils_de_lEtat_%28Temple_de_la_litt%C3%A9rature%2C_Hanoi%29_%284356119550%29.jpg/440px-Institut_des_Fils_de_lEtat_%28Temple_de_la_litt%C3%A9rature%2C_Hanoi%29_%284356119550%29.jpg",
    period: "1292-1370",
    hometown: "Thanh Trì, Hà Nội",
    achievement: "Tiến sĩ đời Trần, Tư nghiệp Quốc Tử Giám",
    description: "Chu Văn An là một nhà giáo, nhà nho tiêu biểu của Việt Nam thời Trần. Ông được coi là người thầy mẫu mực của nền giáo dục Việt Nam.",
    dynasty: "Nhà Trần"
  },
  {
    id: 2,
    name: "Nguyễn Bỉnh Khiêm",
    image: "https://upload.wikimedia.org/wikipedia/commons/6/60/Tr%E1%BA%A1ng_Tr%C3%ACnh_Nguy%E1%BB%85n_B%E1%BB%89nh_Khi%C3%AAm_n.jpg",
    period: "1491-1585",
    hometown: "Vĩnh Lại, Hải Phòng",
    achievement: "Trạng nguyên, Tể tướng đời Mạc",
    description: "Nguyễn Bỉnh Khiêm, hiệu là Bạch Vân cư sĩ, là một nhà thơ, nhà giáo dục, nhà triết học và là một nhà tiên tri nổi tiếng.",
    dynasty: "Nhà Mạc"
  },
  {
    id: 3,
    name: "Lê Quý Đôn",
    image: "https://upload.wikimedia.org/wikipedia/commons/7/79/Le_quy_don_tranhve.jpg",
    period: "1726-1784",
    hometown: "Thái Ninh, Thái Bình",
    achievement: "Thám hoa, Đại học sĩ triều Lê",
    description: "Lê Quý Đôn là một nhà bác học lớn của Việt Nam, có công lớn trong việc biên soạn và nghiên cứu về lịch sử, văn hóa Việt Nam.",
    dynasty: "Nhà Lê"
  },
  {
    id: 4,
    name: "Nguyễn Trãi",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Nguyen_Trai.jpg/440px-Nguyen_Trai.jpg",
    period: "1380-1442",
    hometown: "Thị Cầu, Bắc Ninh",
    achievement: "Trạng nguyên, Quốc Tử Giám Tế tửu",
    description: "Nguyễn Trãi là một nhà chính trị, nhà quân sự, nhà thơ lớn thời Lê sơ. Ông được UNESCO công nhận là Danh nhân văn hóa thế giới.",
    dynasty: "Nhà Lê"
  },
  {
    id: 5,
    name: "Ngô Thì Nhậm",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Ng%C3%B4_Th%C3%AC_Nh%E1%BA%ADm.jpg/375px-Ng%C3%B4_Th%C3%AC_Nh%E1%BA%ADm.jpg",
    period: "1746-1803",
    hometown: "Thanh Oai, Hà Nội",
    achievement: "Tiến sĩ, Tham tụng triều Tây Sơn",
    description: "Ngô Thì Nhậm là một nhà ngoại giao, nhà văn hóa lớn. Ông có công lớn trong việc giúp nhà Tây Sơn đánh bại quân Thanh.",
    dynasty: "Tây Sơn"
  },
  {
    id: 6,
    name: "Phan Huy Chú",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWQVcvRpLfWHbp3se06mblziab8PM3IKtPQA&s",
    period: "1782-1840",
    hometown: "Sơn Tây, Hà Nội",
    achievement: "Cử nhân, tác giả Lịch triều hiến chương loại chí",
    description: "Phan Huy Chú là một nhà nghiên cứu lịch sử, địa lý và văn hóa. Tác phẩm của ông là nguồn tư liệu quý về lịch sử Việt Nam.",
    dynasty: "Nhà Nguyễn"
  },
  {
    id: 7,
    name: "Lê Văn Hưu",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/T%C6%B0%E1%BB%A3ng_s%E1%BB%AD_gia_L%C3%AA_V%C4%83n_H%C6%B0u_t%E1%BA%A1i_Khu_%C4%90%E1%BA%A1i_h%E1%BB%8Dc_Qu%E1%BB%91c_gia_TP_H%E1%BB%93_Ch%C3%AD_Minh%2C_Th%E1%BB%A7_%C4%90%E1%BB%A9c%2C_TPHCM%2C_Vi%E1%BB%87t_Nam_Apr_2022.jpg/357px-T%C6%B0%E1%BB%A3ng_s%E1%BB%AD_gia_L%C3%AA_V%C4%83n_H%C6%B0u_t%E1%BA%A1i_Khu_%C4%90%E1%BA%A1i_h%E1%BB%8Dc_Qu%E1%BB%91c_gia_TP_H%E1%BB%93_Ch%C3%AD_Minh%2C_Th%E1%BB%A7_%C4%90%E1%BB%A9c%2C_TPHCM%2C_Vi%E1%BB%87t_Nam_Apr_2022.jpg",
    period: "1230-1322",
    hometown: "Thanh Hóa",
    achievement: "Quốc sử quân, tác giả Đại Việt sử ký",
    description: "Lê Văn Hưu là người đầu tiên biên soạn bộ sử chính thức của Việt Nam - Đại Việt sử ký, đặt nền móng cho sử học Việt Nam.",
    dynasty: "Nhà Trần"
  },
  {
    id: 8,
    name: "Đặng Trần Côn",
    image: "https://8486fef5bc.vws.vegacdn.vn/uploadimages/news/2024/thcsdangtrancon/17948610_2320241415.jpg",
    period: "1710-1745",
    hometown: "Hưng Yên",
    achievement: "Tiến sĩ, tác giả Chinh phụ ngâm",
    description: "Đặng Trần Côn nổi tiếng với tác phẩm Chinh phụ ngâm khúc, một kiệt tác trong nền văn học cổ điển Việt Nam.",
    dynasty: "Nhà Lê"
  },
  {
    id: 9,
    name: "Ngô Sĩ Liên",
    image: "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcTm_e8YitAQrQWjIMp1hhQxHWfmSNdqQIzMn31dcKre7z8VROAHPnjhI1DYSxPhciSTOHYW-zzOZX-QBHzzeWq8Csmn6FR7Z--StgMnVA",
    period: "1400-1479",
    hometown: "Bắc Giang",
    achievement: "Tiến sĩ, tác giả Đại Việt sử ký toàn thư",
    description: "Ngô Sĩ Liên là người biên soạn bộ sử quan trọng nhất của Việt Nam - Đại Việt sử ký toàn thư, được coi là quốc sử của Việt Nam.",
    dynasty: "Nhà Lê"
  },
  {
    id: 10,
    name: "Lê Thánh Tông",
    image: "https://upload.wikimedia.org/wikipedia/commons/0/04/Le_Thanh_Tong_%28cropped%29.png",
    period: "1442-1497",
    hometown: "Thanh Hóa",
    achievement: "Hoàng đế, người sáng lập Tao Đàn Nhị Thập Bát Tú",
    description: "Vừa là vị vua anh minh, vừa là nhà thơ, nhà văn hóa lớn. Ông sáng lập hội Tao Đàn, đưa văn học Việt Nam lên đỉnh cao.",
    dynasty: "Nhà Lê"
  },
  {
    id: 11,
    name: "Phạm Sư Mạnh",
    image: "https://bhd.1cdn.vn/2023/03/27/files-library-newimages-20230327_phamsumanh1.jpg",
    period: "1300-1384",
    hometown: "Nam Định",
    achievement: "Trạng nguyên, Hàn lâm viện học sĩ",
    description: "Một trong những nhà thơ lớn thời Trần, nổi tiếng với những bài thơ về đề tài thiên nhiên và tình yêu quê hương.",
    dynasty: "Nhà Trần"
  },
  {
    id: 12,
    name: "Mạc Đĩnh Chi",
    image: "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcS7V9pLACQNzH4XKs8IwEkzQCjIks8PQiUP68No1p_4vrnlFLsoHhOzcgbgM4bl0kpF4AHhQ6ZlB11MlKb1SuDsJQ",
    period: "1272-1346",
    hometown: "Hải Dương",
    achievement: "Trạng nguyên, được phong Lưỡng quốc Trạng nguyên",
    description: "Nổi tiếng với tài ứng đối thông minh, là người Việt Nam duy nhất đỗ Trạng nguyên cả ở Việt Nam và Trung Quốc.",
    dynasty: "Nhà Trần"
  },
  {
    id: 13,
    name: "Lê Quát",
    image: "https://danviet.mediacdn.vn/upload/2-2019/images/2019-05-14/Trang-Quet---Hoc-tro-xuat-sac-nhat-cua-Chu-Van-An-la-ai-le-quat-01-1557818934-width300height200.jpg",
    period: "1319-1386",
    hometown: "Hải Dương",
    achievement: "Tiến sĩ, Tư nghiệp Quốc Tử Giám",
    description: "Nhà giáo dục nổi tiếng thời Trần, có công lớn trong việc phát triển Quốc Tử Giám - trường đại học đầu tiên của Việt Nam.",
    dynasty: "Nhà Trần"
  },
  {
    id: 14,
    name: "Nguyễn Thiếp",
    image: "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcTCPEJdHjYQ3JovfQIJyVKUMqvwIO6E5O1WZZ9aRmrwJR20qTgNSHy9iEC_GlL2Ge2N58olXHw5Pdi5xWV8s9dtCg",
    period: "1723-1804",
    hometown: "Nghệ An",
    achievement: "La Sơn Phu Tử, cố vấn cho vua Quang Trung",
    description: "Là nhà tư tưởng, nhà giáo dục lớn, có ảnh hưởng quan trọng đến chính sách của nhà Tây Sơn.",
    dynasty: "Tây Sơn"
  },
  {
    id: 15,
    name: "Phạm Đình Hổ",
    image: "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcT80_2tz3kAIrsXakWXj279eYO3XZDtBa8Dw_O1AM54gbGkYqjH",
    period: "1768-1839",
    hometown: "Hà Nội",
    achievement: "Cử nhân, tác giả Vũ trung tùy bút",
    description: "Nhà văn, nhà nghiên cứu văn học và lịch sử. Tác phẩm của ông là nguồn tư liệu quý về văn hóa Việt Nam thế kỷ 18-19.",
    dynasty: "Nhà Nguyễn"
  },
  {
    id: 16,
    name: "Đoàn Thị Điểm",
    image: "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQ092qEiWucFs_oWnYOrOoV0R6N9wCJuUREJyhbtPPsk379Kzh6Mk7C3iWUiwvFHvoo1SwA9twi_P4oss1b03mq8g",
    period: "1705-1748",
    hometown: "Bắc Ninh",
    achievement: "Nữ sĩ tài danh, dịch giả Chinh phụ ngâm",
    description: "Là một trong những nữ sĩ tài năng nhất trong lịch sử Việt Nam, nổi tiếng với bản dịch Chinh phụ ngâm từ chữ Hán sang chữ Nôm.",
    dynasty: "Nhà Lê"
  },
  {
    id: 17,
    name: "Lê Hữu Trác",
    image: "https://hatinh.gov.vn/uploads/topics/17302821374336.jpg",
    period: "1720-1791",
    hometown: "Hưng Yên",
    achievement: "Danh y, tác giả Hải Thượng y tông tâm lĩnh",
    description: "Là một trong những danh y nổi tiếng nhất lịch sử Việt Nam, tác giả bộ sách y học đồ sộ nhất Việt Nam.",
    dynasty: "Nhà Lê"
  },
  {
    id: 18,
    name: "Bùi Huy Bích",
    image: "https://vanvn.vn/wp-content/uploads/2024/06/Bui-Huy-Bich-tung-lam-den-chuc-Tham-tung.jpg",
    period: "1744-1818",
    hometown: "Hà Tĩnh",
    achievement: "Tiến sĩ, Đại học sĩ triều Tây Sơn",
    description: "Nhà thơ, nhà văn và nhà nghiên cứu văn học. Ông có công lớn trong việc sưu tầm và bình chú thơ văn cổ Việt Nam.",
    dynasty: "Tây Sơn"
  }
];

function Scholars() {
  return (
    <ScholarsWrapper>
      <Title level={1} style={{ textAlign: 'center', marginBottom: 30 }}>
        Các Nhà Khoa Bảng Tiêu Biểu
      </Title>
      <Paragraph style={{ textAlign: 'center', marginBottom: 40 }}>
        Tìm hiểu về những nhà khoa bảng, những người đỗ đạt cao trong các kỳ thi Nho học của Việt Nam
      </Paragraph>

      <Row gutter={[24, 24]}>
        {scholarsData.map(scholar => (
          <Col xs={24} sm={12} lg={8} key={scholar.id}>
            <Card
              hoverable
              className="scholar-card"
              cover={
                <Image
                  alt={scholar.name}
                  src={scholar.image}
                  fallback="https://via.placeholder.com/300x400"
                />
              }
            >
              <Title level={4}>{scholar.name}</Title>
              <div className="scholar-tags">
                <Tag icon={<CalendarOutlined />} color="blue">
                  {scholar.period}
                </Tag>
                <Tag icon={<HomeOutlined />} color="green">
                  {scholar.hometown}
                </Tag>
                <Tag icon={<BookOutlined />} color="magenta">
                  {scholar.dynasty}
                </Tag>
              </div>
              <Paragraph style={{ marginTop: 16 }}>
                <strong>Thành tựu:</strong> {scholar.achievement}
              </Paragraph>
              <Paragraph>{scholar.description}</Paragraph>
            </Card>
          </Col>
        ))}
      </Row>
    </ScholarsWrapper>
  );
}

export default Scholars; 