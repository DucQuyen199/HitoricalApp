const dynastyData = {
  "Nhà Ngô": {
    period: "939-965",
    description: "Nhà Ngô là triều đại đầu tiên trong lịch sử độc lập của Việt Nam, được thành lập sau chiến thắng Bạch Đằng năm 938, chấm dứt thời kỳ Bắc thuộc. Đây là triều đại mở đầu thời kỳ độc lập lâu dài của dân tộc Việt Nam.",
    capital: "Cổ Loa",
    achievements: [
      "Đánh bại quân Nam Hán trong trận Bạch Đằng năm 938",
      "Chấm dứt 1000 năm Bắc thuộc",
      "Thiết lập nền độc lập cho Việt Nam",
      "Xây dựng bộ máy nhà nước phong kiến độc lập đầu tiên",
      "Đặt nền móng cho sự phát triển độc lập của Việt Nam"
    ],
    events: [
      "Chiến thắng Bạch Đằng năm 938",
      "Ngô Quyền lên ngôi vương năm 939",
      "Dời đô về Cổ Loa",
      "Xây dựng hệ thống phòng thủ đất nước",
      "Thiết lập bộ máy nhà nước độc lập"
    ],
    kings: [
      {
        id: "ngo-quyen",
        name: "Ngô Quyền",
        title: "Tiền Ngô Vương",
        period: "939-944",
        description: "Vị vua đầu tiên của nhà Ngô, người đánh bại quân Nam Hán, chấm dứt thời kỳ Bắc thuộc. Ông được xem là vị Tổ Trung hưng của Việt Nam và nằm trong danh sách 14 anh hùng dân tộc.",
        reignName: null,
        achievements: [
          "Đánh bại quân Nam Hán trong trận Bạch Đằng năm 938",
          "Thiết lập nhà nước độc lập đầu tiên",
          "Xây dựng bộ máy nhà nước phong kiến",
          "Đặt nền móng cho nền độc lập lâu dài của Việt Nam",
          "Phát triển chiến thuật đóng cọc trên sông Bạch Đằng",
          "Thống nhất và ổn định đất nước"
        ],
        events: [
          "Sinh ngày 17 tháng 4 năm 898 tại Đường Lâm",
          "Làm tướng cho Dương Đình Nghệ",
          "Đánh bại Kiều Công Tiễn năm 938",
          "Chiến thắng Bạch Đằng năm 938",
          "Lên ngôi vương năm 939",
          "Dời đô về Cổ Loa",
          "Mất ngày 14 tháng 2 năm 944, thọ 47 tuổi"
        ],
        biography: `Ngô Quyền sinh ngày 17/4/898 trong một dòng họ hào trưởng có thế lực tại Đường Lâm. Cha là Ngô Mân làm chức châu mục. Theo sử sách, khi mới sinh có ánh sáng lạ đầy nhà, dung mạo khác thường, có 3 nốt ruồi ở lưng. Ông được mô tả là người khôi ngô, mắt sáng như chớp, dáng đi thong thả như hổ, có trí dũng, sức có thể nâng được vạc đồng. Làm tướng cho Dương Đình Nghệ và được gả con gái. Năm 938, ông đánh bại quân Nam Hán trong trận Bạch Đằng lịch sử bằng chiến thuật đóng cọc xuống lòng sông, chấm dứt 1000 năm Bắc thuộc. Năm 939, ông lên ngôi vương, đóng đô ở Cổ Loa, mở ra thời kỳ độc lập cho Việt Nam. Ông mất năm 944, trước khi mất có di chúc cho Dương Tam Kha phò tá con mình là Ngô Xương Ngập.`
      },
      {
        id: "duong-tam-kha",
        name: "Dương Tam Kha",
        title: "Dương Bình Vương",
        period: "944-950",
        description: "Em vợ của Ngô Quyền, được ủy thác phò tá Ngô Xương Ngập nhưng sau đó cướp ngôi, tự xưng là Dương Bình Vương",
        reignName: null,
        events: [
          "Cướp ngôi của Ngô Xương Ngập năm 944",
          "Nhận Ngô Xương Văn làm con nuôi",
          "Bị Ngô Xương Văn lật đổ năm 950"
        ]
      },
      {
        id: "ngo-xuong-ngap",
        name: "Ngô Xương Ngập",
        title: "Thiên Sách Vương",
        period: "951-954",
        description: "Con trưởng của Ngô Quyền, được cha ủy thác ngôi vua nhưng bị Dương Tam Kha cướp ngôi",
        reignName: null,
        events: [
          "Được cha truyền ngôi năm 944",
          "Bị Dương Tam Kha cướp ngôi",
          "Trốn sang Nam Sách",
          "Trở về làm vua cùng em từ năm 951-954"
        ]
      },
      {
        id: "ngo-xuong-van",
        name: "Ngô Xương Văn",
        title: "Nam Tấn Vương",
        period: "950-965",
        description: "Con thứ của Ngô Quyền, được Dương Tam Kha nhận làm con nuôi, sau đó lật đổ Dương Tam Kha để khôi phục nhà Ngô",
        reignName: null,
        events: [
          "Lật đổ Dương Tam Kha năm 950",
          "Đón anh về cùng trị vì",
          "Cai trị đến năm 965",
          "Nhà Ngô suy yếu và kết thúc, mở đầu thời kỳ loạn 12 sứ quân"
        ]
      }
    ]
  },

  "Nhà Đinh": {
    period: "968-980",
    kings: [
      {
        id: "dinh-tien-hoang",
        name: "Đinh Bộ Lĩnh",
        title: "Đinh Tiên Hoàng",
        period: "968-979",
        reignName: "Thái Bình",
        description: "Thống nhất đất nước sau loạn 12 sứ quân"
      },
      {
        id: "dinh-phe-de",
        name: "Đinh Toàn",
        title: "Đinh Phế Đế",
        period: "980",
        reignName: null
      }
    ],
    description: "Triều đại thống nhất đất nước sau thời kỳ loạn 12 sứ quân",
    capital: "Hoa Lư"
  },

  "Nhà Tiền Lê": {
    period: "980-1009",
    kings: [
      {
        id: "le-dai-hanh",
        name: "Lê Hoàn",
        title: "Lê Đại Hành",
        period: "980-1005",
        reignName: [
          "Thiên Phúc (980-988)",
          "Hưng Thống (989-993)",
          "Ứng Thiên (994-1005)"
        ]
      },
      {
        id: "le-trung-tong",
        name: "Lê Trung Tông",
        period: "1005",
        reignName: null
      },
      {
        id: "le-long-dinh",
        name: "Lê Long Đĩnh",
        period: "1005-1009",
        reignName: [
          "Ứng Thiên (1006-1007)",
          "Cảnh Thụy (1008-1009)"
        ]
      }
    ],
    description: "Triều đại kế tục sự nghiệp của nhà Đinh",
    capital: "Hoa Lư"
  },

  "Nhà Lý": {
    period: "1010-1225",
    kings: [
      {
        id: "ly-thai-to",
        name: "Lý Công Uẩn",
        title: "Lý Thái Tổ",
        period: "1010-1028",
        reignName: "Thuận Thiên",
        description: "Dời đô từ Hoa Lư về Thăng Long"
      },
      {
        id: "ly-thai-tong",
        name: "Lý Phật Mã",
        title: "Lý Thái Tông",
        period: "1028-1054",
        reignName: [
          "Thiên Thành (1028-1033)",
          "Thống Thụy (1034-1038)",
          "Càn Phù Hữu Đạo (1039-1041)",
          "Minh Đạo (1042-1043)",
          "Thiên Cảm Thánh Võ (1044-1048)",
          "Sùng Hưng Đại Bảo (1049-1054)"
        ]
      },
      {
        id: "ly-thanh-tong",
        name: "Lý Nhật Tôn",
        title: "Lý Thánh Tông",
        period: "1054-1072",
        reignName: [
          "Long Thụy Thái Bình (1054-1058)",
          "Chương Thánh Gia Khánh (1059-1065)",
          "Long Chương Thiên Tự (1066-1067)",
          "Thiên Chúc Bảo Tượng (1068-1069)",
          "Thần Võ (1069-1072)"
        ]
      },
      {
        id: "ly-nhan-tong",
        name: "Lý Càn Đức",
        title: "Lý Nhân Tông",
        period: "1072-1127",
        reignName: [
          "Thái Ninh (1072-1075)",
          "Anh Võ Chiêu Thắng (1076-1084)",
          "Quảng Hựu (1085-1092)",
          "Hội Phong (1092-1100)",
          "Long Phù (1101-1109)",
          "Hội Trường Đại Khánh (1110-1119)",
          "Thiên Phù Duệ Võ (1120-1126)",
          "Thiên Phù Khánh Thọ (1127)"
        ]
      },
      {
        id: "ly-than-tong",
        name: "Lý Dương Hoán",
        title: "Lý Thần Tông",
        period: "1128-1138",
        reignName: [
          "Thiên Thuận (1128-1132)",
          "Thiên Chương Bảo Tự (1133-1138)"
        ]
      },
      {
        id: "ly-anh-tong",
        name: "Lý Thiên Tộ",
        title: "Lý Anh Tông",
        period: "1138-1175",
        reignName: [
          "Thiệu Minh (1138-1140)",
          "Đại Định (1140-1162)",
          "Chính Long Bảo Ứng (1163-1174)",
          "Thiên Cảm Chí Bảo (1174-1175)"
        ]
      },
      {
        id: "ly-cao-tong",
        name: "Lý Long Cán",
        title: "Lý Cao Tông",
        period: "1175-1210",
        reignName: [
          "Trịnh Phù (1176-1186)",
          "Thiên Tư Gia Thụy (1186-1202)",
          "Thiên Gia Bảo Hựu (1202-1204)",
          "Trị Bình Long Ứng (1205-1210)"
        ]
      },
      {
        id: "ly-hue-tong",
        name: "Lý Sảm",
        title: "Lý Huệ Tông",
        period: "1210-1224",
        reignName: "Kiến Gia"
      },
      {
        id: "ly-chieu-hoang",
        name: "Lý Phật Kim",
        title: "Lý Chiêu Hoàng",
        period: "1224-1225",
        reignName: "Thiên Chương Hữu Đạo"
      }
    ],
    description: "Triều đại đánh dấu thời kỳ phát triển rực rỡ của Đại Việt",
    capital: "Thăng Long"
  },

  "Nhà Trần": {
    period: "1225-1400",
    kings: [
      {
        id: "tran-thai-tong",
        name: "Trần Cảnh",
        title: "Trần Thái Tông",
        period: "1225-1258",
        reignName: [
          "Kiến Trung (1225-1232)",
          "Thiên Ứng Chính Bình (1232-1251)",
          "Nguyên Phong (1251-1258)"
        ]
      },
      {
        id: "tran-thanh-tong",
        name: "Trần Hoảng",
        title: "Trần Thánh Tông",
        period: "1258-1278",
        reignName: [
          "Thiệu Phong (1258-1272)",
          "Bảo Phù (1273-1278)"
        ]
      },
      {
        id: "tran-nhan-tong",
        name: "Trần Khâm",
        title: "Trần Nhân Tông",
        period: "1278-1293",
        reignName: [
          "Thiệu Bảo (1279-1284)",
          "Trùng Hưng (1285-1293)"
        ]
      },
      {
        id: "tran-anh-tong",
        name: "Trần Thuyên",
        title: "Trần Anh Tông",
        period: "1293-1314",
        reignName: "Hưng Long (1293-1314)"
      },
      {
        id: "tran-minh-tong",
        name: "Trần Mạnh",
        title: "Trần Minh Tông",
        period: "1314-1329",
        reignName: [
          "Đại Khánh (1314-1323)",
          "Khai Thái (1324-1329)"
        ]
      },
      {
        id: "tran-hien-tong",
        name: "Trần Vượng",
        title: "Trần Hiến Tông",
        period: "1329-1341",
        reignName: "Khai Hựu"
      },
      {
        id: "tran-du-tong",
        name: "Trần Hạo",
        title: "Trần Dụ Tông",
        period: "1341-1369",
        reignName: [
          "Thiệu Phong (1341-1357)",
          "Đại Trị (1358-1369)"
        ]
      },
      {
        id: "duong-nhat-le",
        name: "Dương Nhật Lễ",
        period: "1369-1370",
        reignName: "Đại Định"
      },
      {
        id: "tran-nghe-tong",
        name: "Trần Phủ",
        title: "Trần Nghệ Tông",
        period: "1370-1372",
        reignName: "Thiệu Khánh"
      },
      {
        id: "tran-due-tong",
        name: "Trần Kính",
        title: "Trần Duệ Tông",
        period: "1372-1377",
        reignName: "Long Khánh"
      },
      {
        id: "tran-phe-de",
        name: "Trần Hiện",
        title: "Trần Phế Đế",
        period: "1377-1388",
        reignName: "Xương Phù"
      },
      {
        id: "tran-thuan-tong",
        name: "Trần Ngung",
        title: "Trần Thuận Tông",
        period: "1388-1398",
        reignName: "Quang Thái"
      },
      {
        id: "tran-thieu-de",
        name: "Trần Thiếu Đế",
        period: "1398-1400",
        reignName: "Kiến Tân"
      }
    ],
    description: "Triều đại đánh dấu thời kỳ phát triển rực rỡ của Đại Việt",
    capital: "Thăng Long"
  },

  "Nhà Hồ": {
    period: "1400-1407",
    kings: [
      {
        id: "ho-quy-ly",
        name: "Hồ Quý Ly",
        period: "1400",
        reignName: "Thánh Nguyên"
      },
      {
        id: "ho-han-thuong",
        name: "Hồ Hán Thương",
        period: "1400-1407",
        reignName: [
          "Thiệu Thành (1401-1402)",
          "Khai Đại (1403-1407)"
        ]
      }
    ],
    description: "Triều đại ngắn ngủi trước khi Đại Việt rơi vào thời kỳ Bắc thuộc lần thứ tư",
    capital: "Tây Đô"
  },

  "Nhà Hậu Trần": {
    period: "1407-1413",
    kings: [
      {
        id: "gian-dinh-de",
        name: "Giản Định Đế",
        period: "1407-1409",
        reignName: "Hưng Khánh"
      },
      {
        id: "trung-quang-de",
        name: "Trần Quý Khoáng",
        title: "Trùng Quang Đế",
        period: "1409-1413",
        reignName: "Trùng Quang"
      }
    ],
    description: "Triều đại ngắn ngủi trong thời kỳ chống Minh",
    capital: "Thăng Long"
  },

  "Nhà Lê sơ": {
    period: "1428-1527",
    kings: [
      {
        id: "le-thai-to",
        name: "Lê Lợi",
        title: "Lê Thái Tổ",
        period: "1428-1433",
        reignName: "Thuận Thiên"
      },
      {
        id: "le-thai-tong",
        name: "Lê Nguyên Long",
        title: "Lê Thái Tông",
        period: "1434-1442",
        reignName: [
          "Thiệu Bình (1434-1439)",
          "Đại Bảo (1440-1442)"
        ]
      },
      {
        id: "le-nhan-tong",
        name: "Lê Nhân Tông",
        period: "1443-1459",
        reignName: [
          "Đại Hòa (1443-1453)",
          "Diên Ninh (1454-1459)"
        ]
      },
      {
        id: "le-nghi-dan",
        name: "Lê Nghi Dân",
        period: "1459-1460",
        reignName: "Thiên Hưng"
      },
      {
        id: "le-thanh-tong",
        name: "Lê Tư Thành",
        title: "Lê Thánh Tông",
        period: "1460-1497",
        reignName: [
          "Quang Thuận (1460-1469)",
          "Hồng Đức (1470-1497)"
        ]
      },
      {
        id: "le-hien-tong",
        name: "Lê Tranh",
        title: "Lê Hiến Tông",
        period: "1497-1504",
        reignName: "Cảnh Thống"
      },
      {
        id: "le-tuc-tong",
        name: "Lê Thuần",
        title: "Lê Túc Tông",
        period: "1504",
        reignName: "Thái Trinh"
      },
      {
        id: "le-uy-muc",
        name: "Lê Tuấn",
        title: "Lê Uy Mục",
        period: "1505-1509",
        reignName: "Đoan Khánh"
      },
      {
        id: "le-tuong-duc",
        name: "Lê Oanh",
        title: "Lê Tương Dực",
        period: "1510-1516",
        reignName: "Hồng Thuận"
      },
      {
        id: "le-chieu-tong",
        name: "Lê Y",
        title: "Lê Chiêu Tông",
        period: "1516-1522",
        reignName: "Quang Thiệu"
      },
      {
        id: "le-cung-hoang",
        name: "Lê Xuân",
        title: "Lê Cung Hoàng",
        period: "1522-1527",
        reignName: "Thống Nguyên"
      }
    ],
    description: "Triều đại phát triển rực rỡ sau khi đánh đuổi quân Minh",
    capital: "Thăng Long"
  },

  "Nhà Mạc": {
    period: "1527-1592",
    kings: [
      {
        id: "mac-dang-dung",
        name: "Mạc Đăng Dung",
        title: "Mạc Thái Tổ",
        period: "1527-1529",
        reignName: "Minh Đức"
      },
      {
        id: "mac-dang-doanh",
        name: "Mạc Đăng Doanh",
        title: "Mạc Thái Tông",
        period: "1530-1540",
        reignName: "Đại Chính"
      },
      {
        id: "mac-phuc-hai",
        name: "Mạc Phúc Hải",
        title: "Mạc Hiến Tông",
        period: "1541-1546",
        reignName: "Quảng Hòa"
      },
      {
        id: "mac-phuc-nguyen",
        name: "Mạc Phúc Nguyên",
        title: "Mạc Tuyên Tông",
        period: "1546-1561",
        reignName: [
          "Vĩnh Định (1547)",
          "Cảnh Lịch (1548-1553)",
          "Quang Bảo (1554-1561)"
        ]
      },
      {
        id: "mac-mau-hop",
        name: "Mạc Mậu Hợp",
        period: "1562-1592",
        reignName: [
          "Thuần Phúc (1562-1565)",
          "Sùng Khang (1566-1577)",
          "Diên Thành (1578-1585)",
          "Đoan Thái (1586-1587)",
          "Hưng Trị (1590)",
          "Hồng Ninh (1591-1592)"
        ]
      }
    ],
    description: "Triều đại tồn tại song song với nhà Hậu Lê",
    capital: "Thăng Long"
  },

  "Nhà Hậu Lê": {
    period: "1533-1789",
    kings: [
      {
        id: "le-trang-tong",
        name: "Lê Duy Ninh",
        title: "Lê Trang Tông",
        period: "1533-1548",
        reignName: "Nguyên Hòa"
      },
      {
        id: "le-trung-tong",
        name: "Lê Duy Huyên",
        title: "Lê Trung Tông",
        period: "1548-1556",
        reignName: "Thuận Bình"
      },
      {
        id: "le-anh-tong",
        name: "Lê Duy Bang",
        title: "Lê Anh Tông",
        period: "1556-1573",
        reignName: [
          "Thiên Hữu (1557)",
          "Chính Trị (1558-1571)",
          "Hồng Phúc (1572-1573)"
        ]
      },
      {
        id: "le-the-tong",
        name: "Lê Duy Đàm",
        title: "Lê Thế Tông",
        period: "1573-1599",
        reignName: [
          "Gia Thái (1573-1577)",
          "Quang Hưng (1578-1599)"
        ]
      },
      {
        id: "le-kinh-tong",
        name: "Lê Duy Tân",
        title: "Lê Kính Tông",
        period: "1600-1619",
        reignName: [
          "Thuận Đức (1600)",
          "Hoằng Định (1601-1619)"
        ]
      },
      {
        id: "le-than-tong-1",
        name: "Lê Duy Kỳ",
        title: "Lê Thần Tông",
        period: "1619-1643",
        reignName: [
          "Vĩnh Tộ (1620-1628)",
          "Đức Long (1629-1634)",
          "Dương Hòa (1635-1643)"
        ]
      },
      {
        id: "le-chan-tong",
        name: "Lê Duy Hựu",
        title: "Lê Chân Tông",
        period: "1643-1649",
        reignName: "Phúc Thái"
      },
      {
        id: "le-than-tong-2",
        name: "Lê Duy Kỳ",
        title: "Lê Thần Tông",
        period: "1649-1662",
        reignName: [
          "Khánh Đức (1649-1652)",
          "Thịnh Đức (1653-1657)",
          "Vĩnh Thọ (1658-1662)",
          "Vạn Khánh (1662)"
        ]
      },
      {
        id: "le-huyen-tong",
        name: "Lê Duy Vũ",
        title: "Lê Huyền Tông",
        period: "1662-1671",
        reignName: "Cảnh Trị"
      },
      {
        id: "le-gia-tong",
        name: "Lê Duy Hội",
        title: "Lê Gia Tông",
        period: "1672-1675",
        reignName: [
          "Dương Đức (1672-1673)",
          "Đức Nguyên (1674-1675)"
        ]
      },
      {
        id: "le-hi-tong",
        name: "Lê Duy Cáp",
        title: "Lê Hy Tông",
        period: "1676-1705",
        reignName: [
          "Vĩnh Trị (1676-1680)",
          "Chính Hòa (1681-1705)"
        ]
      },
      {
        id: "le-du-tong",
        name: "Lê Duy Đường",
        title: "Lê Dụ Tông",
        period: "1705-1728",
        reignName: [
          "Vĩnh Thịnh (1705-1720)",
          "Bảo Thái (1720-1729)"
        ]
      },
      {
        id: "le-de-duy-phuong",
        name: "Lê Duy Phường",
        title: "Lê Đế Duy Phường",
        period: "1729-1732",
        reignName: "Vĩnh Khánh"
      },
      {
        id: "le-thuan-tong",
        name: "Lê Duy Tường",
        title: "Lê Thuần Tông",
        period: "1732-1735",
        reignName: "Long Đức"
      },
      {
        id: "le-y-tong",
        name: "Lê Duy Thận",
        title: "Lê Ý Tông",
        period: "1735-1740",
        reignName: "Vĩnh Hựu"
      },
      {
        id: "le-hien-tong",
        name: "Lê Duy Diêu",
        title: "Lê Hiển Tông",
        period: "1740-1786",
        reignName: "Cảnh Hưng"
      },
      {
        id: "le-man-de",
        name: "Lê Duy Kỳ",
        title: "Lê Mẫn Đế",
        period: "1787-1789",
        reignName: "Chiêu Thống"
      }
    ],
    description: "Triều đại tồn tại song song với nhà Mạc và chúa Trịnh",
    capital: "Thăng Long"
  },

  "Nhà Tây Sơn": {
    period: "1778-1802",
    kings: [
      {
        id: "nguyen-nhac",
        name: "Nguyễn Nhạc",
        title: "Thái Đức Hoàng Đế",
        period: "1778-1793",
        reignName: "Thái Đức"
      },
      {
        id: "nguyen-hue",
        name: "Nguyễn Huệ",
        title: "Quang Trung Hoàng Đế",
        period: "1789-1792",
        reignName: "Quang Trung"
      },
      {
        id: "nguyen-quang-toan",
        name: "Nguyễn Quang Toản",
        title: "Cảnh Thịnh Hoàng Đế",
        period: "1792-1802",
        reignName: [
          "Cảnh Thịnh (1792-1801)",
          "Bảo Hưng (1801-1802)"
        ]
      }
    ],
    description: "Triều đại nông dân khởi nghĩa thành công",
    capital: "Phú Xuân"
  },

  "Nhà Nguyễn": {
    period: "1802-1945",
    kings: [
      {
        id: "gia-long",
        name: "Nguyễn Phúc Ánh",
        title: "Nguyễn Thế Tổ",
        period: "1802-1819",
        reignName: "Gia Long"
      },
      {
        id: "minh-mang",
        name: "Nguyễn Phúc Đảm",
        title: "Nguyễn Thánh Tổ", 
        period: "1820-1840",
        reignName: "Minh Mạng"
      },
      {
        id: "thieu-tri",
        name: "Nguyễn Phúc Miên Tông",
        title: "Nguyễn Hiến Tổ",
        period: "1841-1847",
        reignName: "Thiệu Trị"
      },
      {
        id: "tu-duc",
        name: "Nguyễn Phúc Hồng Nhậm",
        title: "Nguyễn Dực Tông",
        period: "1848-1883",
        reignName: "Tự Đức"
      },
      {
        id: "duc-duc",
        name: "Nguyễn Phúc Ưng Chân",
        title: "Nguyễn Dục Đức",
        period: "1883",
        reignName: null,
        description: "Làm vua được 3 ngày"
      },
      {
        id: "hiep-hoa",
        name: "Nguyễn Phúc Hồng Dật",
        title: "Nguyễn Hiệp Hoà",
        period: "1883",
        reignName: "Hiệp Hoà"
      },
      {
        id: "kien-phuc",
        name: "Nguyễn Phúc Ưng Đăng",
        title: "Nguyễn Giản Tông",
        period: "1883-1884",
        reignName: "Kiến Phúc"
      },
      {
        id: "ham-nghi",
        name: "Nguyễn Phúc Ưng Lịch",
        title: "Nguyễn Hàm Nghi",
        period: "1884-1885",
        reignName: "Hàm Nghi"
      },
      {
        id: "dong-khanh",
        name: "Nguyễn Phúc Ưng Đường",
        title: "Nguyễn Cảnh Tông",
        period: "1885-1888",
        reignName: "Đồng Khánh"
      },
      {
        id: "thanh-thai",
        name: "Nguyễn Phúc Bửu Lân",
        title: "Nguyễn Thành Thái",
        period: "1889-1907",
        reignName: "Thành Thái"
      },
      {
        id: "duy-tan",
        name: "Nguyễn Phúc Vĩnh San",
        title: "Nguyễn Duy Tân",
        period: "1907-1916",
        reignName: "Duy Tân"
      },
      {
        id: "khai-dinh",
        name: "Nguyễn Phúc Bửu Đảo",
        title: "Nguyễn Hoằng Tông",
        period: "1916-1925",
        reignName: "Khải Định"
      },
      {
        id: "bao-dai",
        name: "Nguyễn Phúc Vĩnh Thụy",
        title: "Nguyễn Bảo Đại",
        period: "1925-1945",
        reignName: "Bảo Đại"
      },
      {
        id:"nguyen-lam-dung",
        name: "Nguyễn Lâm Dũng",
        title: "Dũng Fuck Boi",
        period: "2004 - Nay",
        reignName: "Dũng"
      }
    ],
    description: "Triều đại thống trị đến năm 1945",
    capital: "Phú Xuân"
  }
};

module.exports = dynastyData;