// 商品数据
const products = [
    {
        id: 1,
        name: '高版本轻奢克罗心牛仔裤',
        category: '裤子',
        price: 79,
        originalPrice: 299,
        emoji: '👖',
        image: 'images/微信图片_20260627171551_42_2.jpg',
        desc: '十字架贴布印花，男女同款，广州现货秒发',
        tag: '新品',
    },
];

// 分类列表
const categoryList = ['all', '卫衣', '外套', '裤子', '鞋子', '帽子', '短袖'];

// 获取所有分类
function getCategories() {
    return categoryList;
}