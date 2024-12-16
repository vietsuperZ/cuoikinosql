const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

/**
 * GET /
 * HOME
*/
/**
 * GET /
 * HOME
 */
router.get('', async (req, res) => {
  try {
    const locals = {
      title: "NodeJs Blog",
      description: "."
    }

    let perPage = 10;
    let page = req.query.page || 1;

    // Truy vấn tất cả bài viết, phân trang
    const data = await Post.aggregate([
      { $sort: { createdAt: -1 } }
    ])
    .skip(perPage * page - perPage)
    .limit(perPage)
    .exec();

    // Đếm tổng số bài viết (vẫn dùng countDocuments)
    const count = await Post.countDocuments({});
    const nextPage = parseInt(page) + 1;
    const hasNextPage = nextPage <= Math.ceil(count / perPage);

    // Truy vấn 4 bài viết gần đây nhất
    const recentBlogs = await Post.find()
      .sort({ createdAt: -1 }) // Sắp xếp theo thời gian tạo
      .limit(4); // Giới hạn 4 bài viết

    res.render('index', { 
      locals,
      data,
      recentBlogs, // Truyền thêm biến recentBlogs vào render
      current: page,
      nextPage: hasNextPage ? nextPage : null,
      currentRoute: '/'
    });

  } catch (error) {
    console.log(error);
  }
});



router.get('/post/:id', async (req, res) => {
  try {
    let slug = req.params.id;

    const data = await Post.findById({ _id: slug });

    const locals = {
      title: data.title,
      description: ".",
    }

    res.render('post', { 
      locals,
      data,
      currentRoute: `/post/${slug}`
    });
  } catch (error) {
    console.log(error);
  }

});


/**
 * POST /
 * Post - searchTerm
*/
router.post('/search', async (req, res) => {
  try {
    const locals = {
      title: "",
      description: "."
    }

    let searchTerm = req.body.searchTerm;
    const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "")

    const data = await Post.find({
      $or: [
        { title: { $regex: new RegExp(searchNoSpecialChar, 'i') }},
        { body: { $regex: new RegExp(searchNoSpecialChar, 'i') }}
      ]
    });

    res.render("search", {
      data,
      locals,
      currentRoute: '/'
    });

  } catch (error) {
    console.log(error);
  }

});


/**
 * GET /
 * About
*/
router.get('/about', (req, res) => {
  res.render('about', {
    currentRoute: '/about'
  });
});


router.get('/contact', (req, res) => {
  res.render('contact', {
    currentRoute: '/contact'
  });
});



module.exports = router;