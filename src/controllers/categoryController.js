// src/controllers/categoryController.js
const getCategories = (req, res) => {
    // Dữ liệu mẫu (sau này lấy từ database MySQL thông qua Model)
    const mockCategories = [
        { id: 1, name: 'Điện thoại', description: 'Các dòng smartphone mới nhất' },
        { id: 2, name: 'Laptop', description: 'Máy tính xách tay chính hãng' },
        { id: 3, name: 'Phụ kiện', description: 'Tai nghe, cáp sạc, ốp lưng...' }
    ];

    try {
        // Render ra file category.ejs và truyền dữ liệu sang
        res.render('category', { categories: mockCategories, error: null });
    } catch (err) {
        res.render('category', { error: err.message, categories: [] });
    }
};

module.exports = {
    getCategories
};