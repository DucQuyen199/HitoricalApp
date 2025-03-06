const { GoogleGenerativeAI } = require("@google/generative-ai");
const fetch = require('node-fetch');
const { Headers } = require('node-fetch');
const fs = require('fs');
require('dotenv').config();

class GeminiService {
  constructor() {
    console.log('Initializing GeminiService...');
    
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    try {
      // Thêm fetch và Headers vào global scope
      if (!globalThis.fetch) {
        globalThis.fetch = fetch;
      }
      if (!globalThis.Headers) {
        globalThis.Headers = Headers;
      }
      
      this.genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      this.model = this.genAI.getGenerativeModel({
        model: "gemini-2.0-flash-001",
        generationConfig: {
          temperature: 0.9,
          topK: 1,
          topP: 0.8,
          maxOutputTokens: 1000,
          candidateCount: 1,
          stopSequences: ["Human:", "Assistant:"]
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_NONE",
          }
        ],
        callOptions: {
          timeout: 30000,
          apiVersion: "v2"
        }
      });
      console.log('Gemini service initialized successfully');

      // Khởi tạo model vision
      this.visionModel = this.genAI.getGenerativeModel({
        model: "gemini-pro-vision",
        generationConfig: {
          temperature: 0.9,
          topK: 1,
          topP: 0.8,
          maxOutputTokens: 1000
        }
      });
    } catch (error) {
      console.error('Failed to initialize Gemini service:', error);
      throw error;
    }

    // Mở rộng từ khóa lịch sử Việt Nam
    this.vietnamHistoryKeywords = [
      // Thời kỳ lịch sử
      'việt nam', 'đại việt', 'âu lạc', 'văn lang', 'đại cồ việt', 'đại nam',
      'hồng bàng', 'thời tiền sử', 'thời kỳ đồ đồng', 'thời kỳ đồ sắt',
      
      // Triều đại và chế độ
      'triều đại', 'vương quốc', 'phong kiến', 'quân chủ', 'chế độ',
      'nhà lý', 'nhà trần', 'nhà hồ', 'nhà lê', 'nhà nguyễn', 'nhà mạc',
      
      // Sự kiện và hiện tượng
      'độc lập', 'tự chủ', 'khởi nghĩa', 'chiến tranh', 'kháng chiến',
      'giải phóng', 'cách mạng', 'phong trào', 'bắc thuộc', 'đô hộ',
      'chiến thắng', 'thất bại', 'hòa ước', 'hiệp định',
      
      // Văn hóa và xã hội
      'văn hóa', 'phong tục', 'truyền thống', 'di sản', 'di tích',
      'tín ngưỡng', 'tôn giáo', 'lễ hội', 'phong tục tập quán',
      'kiến trúc', 'nghệ thuật', 'văn học', 'giáo dục',
      
      // Nhân vật và chức danh
      'vua', 'hoàng đế', 'chúa', 'tướng', 'anh hùng', 'lãnh đạo',
      'danh nhân', 'danh tướng', 'văn thân', 'sĩ phu', 'quan lại'
    ];
  }

  async analyzeHistory(question, retries = 3) {
    try {
      console.log('Analyzing question:', question);

      if (!question?.trim()) {
        throw new Error('Câu hỏi không được để trống');
      }

      let lastError;
      for (let i = 0; i < retries; i++) {
        try {
          const prompt = `
            Hãy trả lời câu hỏi sau về lịch sử Việt Nam một cách ngắn gọn, dễ hiểu và hiện đại:
            "${question}"

            Yêu cầu format:
            💡 Câu trả lời chính (ngắn gọn 2-3 câu)

            📅 Sự kiện quan trọng:
            • [Tên sự kiện] ([Thời gian])
            
            👥 Nhân vật liên quan:
            • [Tên nhân vật] - [Vai trò ngắn gọn]

            💎 Điểm đáng chú ý:
            • [1-2 điểm thú vị hoặc bài học rút ra]

            Hãy trả lời bằng ngôn ngữ đơn giản, dễ hiểu và có tính giáo dục.
          `;

          console.log(`Attempt ${i + 1} of ${retries}`);
          const result = await this.model.generateContent(prompt);
          
          if (!result) {
            throw new Error('Không nhận được phản hồi từ Gemini');
          }

          const response = await result.response;
          const text = response.text();

          if (!text) {
            throw new Error('Phản hồi từ Gemini trống');
          }

          console.log('Raw Gemini response:', text);

          // Parse response
          const sections = text.split('\n\n');
          const answer = sections[0]?.replace('💡 ', '')?.trim() || text;
          
          const events = [];
          const figures = [];

          sections.forEach(section => {
            if (section.includes('📅')) {
              const lines = section.split('\n');
              lines.forEach(line => {
                if (line.startsWith('•')) {
                  const match = line.match(/• (.*?) \((.*?)\)/);
                  if (match) {
                    events.push({
                      id: this.generateId(),
                      title: match[1].trim(),
                      date: match[2].trim()
                    });
                  }
                }
              });
            } else if (section.includes('👥')) {
              const lines = section.split('\n');
              lines.forEach(line => {
                if (line.startsWith('•')) {
                  const match = line.match(/• (.*?) - (.*)/);
                  if (match) {
                    figures.push({
                      id: this.generateId(),
                      name: match[1].trim(),
                      role: match[2].trim()
                    });
                  }
                }
              });
            }
          });

          return {
            success: true,
            answer,
            events,
            figures,
            highlights: sections.find(s => s.includes('💎'))
              ?.split('\n')
              ?.filter(l => l.startsWith('•'))
              ?.map(l => l.replace('• ', '').trim()) || []
          };
        } catch (error) {
          console.error(`Attempt ${i + 1} failed:`, error);
          lastError = error;
          if (i < retries - 1) {
            await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1))); // Exponential backoff
            continue;
          }
        }
      }

      console.error('Gemini analysis error:', lastError);
      return {
        success: false,
        error: lastError.message,
        answer: 'Xin lỗi, không thể xử lý câu hỏi của bạn.',
        events: [],
        figures: [],
        highlights: []
      };

    } catch (error) {
      console.error('Error in analyzeHistory:', error);
      return {
        success: false,
        error: error.message,
        answer: 'Xin lỗi, đã có lỗi xảy ra khi xử lý câu hỏi.',
        events: [],
        figures: [],
        highlights: []
      };
    }
  }

  isVietnamHistoryQuestion(question) {
    const normalizedQuestion = question.toLowerCase();
    return this.vietnamHistoryKeywords.some(keyword => 
      normalizedQuestion.includes(keyword.toLowerCase())
    );
  }

  async findRelevantImages(question) {
    // Implement image search logic here
    // Có thể sử dụng Google Custom Search API hoặc các service khác
    return []; // Tạm thời return array rỗng
  }

  generateId() {
    return Math.random().toString(36).substr(2, 9);
  }

  // Thêm hàm xử lý hình ảnh
  async analyzeImage(imageFile, question) {
    try {
      if (!imageFile?.buffer) {
        throw new Error('Không tìm thấy dữ liệu hình ảnh');
      }

      // Chuyển buffer sang base64
      const imageBase64 = imageFile.buffer.toString('base64');
      const mimeType = imageFile.mimetype;

      // Tạo prompt cho vision model
      const prompt = `
        Hãy phân tích hình ảnh này và trả lời câu hỏi sau:
        "${question}"

        Yêu cầu format:
        💡 Mô tả hình ảnh (2-3 câu)

        📝 Trả lời câu hỏi:
        • [Câu trả lời chi tiết]

        🔍 Chi tiết quan trọng:
        • [Liệt kê các chi tiết đáng chú ý trong hình]

        Trả lời bằng tiếng Việt, ngắn gọn và dễ hiểu.
      `;

      // Gọi vision model
      const result = await this.visionModel.generateContent([
        prompt,
        {
          inlineData: {
            data: imageBase64,
            mimeType: mimeType
          }
        }
      ]);

      const response = await result.response;
      const text = response.text();

      // Parse response
      const sections = text.split('\n\n');
      return {
        success: true,
        description: sections[0]?.replace('💡 ', '')?.trim(),
        answer: sections[1]?.replace('📝 ', '')?.trim(),
        details: sections[2]?.replace('🔍 ', '')?.split('\n')
          ?.filter(l => l.startsWith('•'))
          ?.map(l => l.replace('• ', '').trim()) || []
      };

    } catch (error) {
      console.error('Vision analysis error:', error);
      return {
        success: false,
        error: error.message,
        description: 'Không thể phân tích hình ảnh',
        answer: 'Xin lỗi, không thể xử lý câu hỏi với hình ảnh này',
        details: []
      };
    }
  }
}

module.exports = new GeminiService(); 