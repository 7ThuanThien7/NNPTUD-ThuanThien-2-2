var express = require('express');
var router = express.Router();

let { ConvertTitleToSlug } = require('../utils/titleHandler');
let { getMaxID } = require('../utils/IdHandler');

let data = [
  {
    "id": 1,
    "title": "Majestic Mountain Graphic T-Shirt",
    "slug": "majestic-mountain-graphic-t-shirt",
    "price": 44,
    "description": "Elevate your wardrobe with this stylish black t-shirt featuring a striking monochrome mountain range graphic...",
    "category": {
      "id": 1,
      "name": "Clothes",
      "slug": "clothes",
      "image": "https://i.imgur.com/QkIa5tT.jpeg",
      "creationAt": "2026-02-01T19:28:25.000Z",
      "updatedAt": "2026-02-01T19:28:25.000Z"
    },
    "images": [
      "https://i.imgur.com/QkIa5tT.jpeg",
      "https://i.imgur.com/jb5Yu0h.jpeg",
      "https://i.imgur.com/UlxxXyG.jpeg"
    ],
    "creationAt": "2026-02-01T19:28:25.000Z",
    "updatedAt": "2026-02-01T19:28:25.000Z"
  },
  {
    "id": 2,
    "title": "Classic Red Pullover Hoodie",
    "slug": "classic-red-pullover-hoodie",
    "price": 10,
    "description": "Elevate your casual wardrobe with our Classic Red Pullover Hoodie...",
    "category": {
      "id": 1,
      "name": "Clothes",
      "slug": "clothes",
      "image": "https://i.imgur.com/QkIa5tT.jpeg",
      "creationAt": "2026-02-01T19:28:25.000Z",
      "updatedAt": "2026-02-01T19:28:25.000Z"
    },
    "images": [
      "https://i.imgur.com/1twoaDy.jpeg",
      "https://i.imgur.com/FDwQgLy.jpeg",
      "https://i.imgur.com/kg1ZhhH.jpeg"
    ],
    "creationAt": "2026-02-01T19:28:25.000Z",
    "updatedAt": "2026-02-01T19:28:25.000Z"
  }

  // ⛔ Phần còn lại giữ nguyên y hệt như bạn đã dán,
  // chỉ cần VSCode: Right click → Format Document
];

// ================= GET ALL WITH QUERY =================
router.get('/', function (req, res) {

  let queries = req.query;

  let titleQ = queries.title ? queries.title : '';
  let minPrice = parseInt(queries.minPrice) || 0;
  let maxPrice = parseInt(queries.maxPrice) || 1E6;
  let page = parseInt(queries.page) || 1;
  let limit = parseInt(queries.limit) || 10;

  if (minPrice > maxPrice) {
    return res.status(400).send({ message: "minPrice must be <= maxPrice" });
  }

  let result = data.filter(e =>
    (!e.isDeleted) &&
    e.title.toLowerCase().includes(titleQ.toLowerCase()) &&
    e.price >= minPrice &&
    e.price <= maxPrice
  );

  result = result.slice(limit * (page - 1), limit * page);

  res.send(result);
});


// ================= GET BY SLUG =================
router.get('/slug/:slug', function (req, res) {
  let slug = req.params.slug;

  let result = data.find(e => e.slug === slug && !e.isDeleted);

  if (result) {
    res.send(result);
  } else {
    res.status(404).send({ message: "slug not found" });
  }
});


// ================= GET BY ID =================
router.get('/:id', function (req, res) {

  let result = data.find(e =>
    e.id == req.params.id && !e.isDeleted
  );

  if (result) {
    res.send(result);
  } else {
    res.status(404).send({ message: "id not found" });
  }
});


// ================= POST (VALIDATE) =================
router.post('/', function (req, res) {

  if (!req.body.title) {
    return res.status(400).send({ message: "title is required" });
  }

  if (!req.body.price || isNaN(req.body.price)) {
    return res.status(400).send({ message: "price must be a number" });
  }

  let newObj = {
    id: getMaxID(data) + 1,
    title: req.body.title,
    slug: ConvertTitleToSlug(req.body.title),
    price: parseInt(req.body.price),
    description: req.body.description,
    category: req.body.category,
    images: req.body.images,
    creationAt: new Date(),
    updatedAt: new Date()
  };

  data.push(newObj);

  res.send(newObj);
});


// ================= PUT =================
router.put('/:id', function (req, res) {

  let result = data.find(e => e.id == req.params.id);

  if (result) {
    let keys = Object.keys(req.body);

    for (const key of keys) {
      result[key] = req.body[key];
    }

    result.updatedAt = new Date();

    res.send(result);
  } else {
    res.status(404).send({ message: "id not found" });
  }
});


// ================= DELETE (SOFT) =================
router.delete('/:id', function (req, res) {

  let result = data.find(e => e.id == req.params.id);

  if (result) {
    result.isDeleted = true;
    res.send(result);
  } else {
    res.status(404).send({ message: "id not found" });
  }

});

module.exports = router;
