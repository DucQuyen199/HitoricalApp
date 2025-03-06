const { GoogleGenerativeAI } = require("@google/generative-ai");

// Khởi tạo Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const analyzeContent = async (req, res) => {
  try {
    const { content, name } = req.body;

    // Tạo prompt cho AI
    const prompt = `
    Hãy phân tích và tóm tắt thông tin về nhân vật lịch sử ${name} dựa trên nội dung sau:

    ${content}

    Yêu cầu phân tích:
    1. Tóm tắt ngắn gọn về thân thế, xuất thân (2-3 câu)
    2. Những đóng góp và chiến công quan trọng nhất
    3. Ý nghĩa lịch sử và tầm ảnh hưởng
    4. Các đặc điểm nổi bật về tính cách, tài năng
    
    Hãy trình bày theo dạng đoạn văn mạch lạc, dễ hiểu, tập trung vào những điểm quan trọng nhất.
    Phân tích bằng tiếng Việt.
    `;

    // Khởi tạo model
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash"
    });

    // Gọi Gemini API
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const analysis = response.text();

    res.json({ analysis });
  } catch (error) {
    console.error('Error in AI analysis:', error);
    res.status(500).json({ 
      error: 'Không thể phân tích nội dung. Vui lòng thử lại sau.' 
    });
  }
};

module.exports = {
  analyzeContent
}; 