// 商品数据（空）
const products = [];

// 获取所有分类
function getCategories() {
    const cats = new Set(products.map(p => p.category));
    return ['all', ...Array.from(cats)];
}
