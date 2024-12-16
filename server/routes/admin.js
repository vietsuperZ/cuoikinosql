const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const adminLayout = '../views/layouts/admin';
const jwtSecret = process.env.JWT_SECRET;






//l=khai bao upload
const multer = require('multer');
const path = require('path');

// Cấu hình Multer để xử lý tải lên hình ảnh
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads');  // Lưu hình ảnh vào thư mục uploads
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));  // Tạo tên file duy nhất
  }
});
const upload = multer({ storage: storage });

// Route PUT để chỉnh sửa bài viết
router.put('/edit-post/:id', upload.single('image'), async (req, res) => {
  try {
    const { title, body } = req.body;
    let imageUrl = req.body.imageUrl; // Giữ lại ảnh cũ nếu không có ảnh mới

    // Nếu có tệp hình ảnh mới, thay thế đường dẫn cũ
    if (req.file) {
      imageUrl = '/uploads/' + req.file.filename;
    }

    // Cập nhật bài viết trong cơ sở dữ liệu
    const updatedPost = await Post.findByIdAndUpdate(req.params.id, {
      title,
      body,
      imageUrl  // Cập nhật ảnh mới hoặc giữ ảnh cũ
    }, { new: true });

    // Chuyển hướng đến trang chi tiết bài viết vừa sửa
    res.redirect(`/post/${updatedPost._id}`);  // Chuyển hướng tới bài viết vừa sửa
  } catch (error) {
    console.log(error);
    res.status(500).send('Error updating post');
  }
});


//------------------------------------

//check login


const authMiddleware = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json( {message: 'Unauthorized'});

    }

    try{
        const decoded = jwt.verify(token, jwtSecret);
        req.userId = decoded.userId;
        next();
    } catch(error) {
        res.status(401).json({ message: 'Unauthorized'});
    }
}

// Inside your route handler for rendering the homepage


  

//admin login page



router.get('/admin', async (req, res) => {
  

  try {
    const locals = {
        title: "Admin",
        description: "Simple Blog created with NodeJs, Express & MongoDb."
      }

    res.render('admin/index', { locals, layout: adminLayout });
  } catch (error) {
    console.log(error);
  }

});



//check login


router.post('/admin', async (req, res) => {
  

    try {
      
        const { username, password} = req.body;
        
        const user = await User.findOne({username});

        if(!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentialsIn'});
        }

        const token = jwt.sign({ userId: user._id}, jwtSecret);
        res.cookie('token', token, { httpOnly: true });
        res.redirect('/dashboard');



    

    } catch (error) {
      console.log(error);
    }
  
  });
  


//admin dashboard


router.get('/dashboard',authMiddleware, async (req, res) => {
    try {
        const locals = {
            title: 'Dashboard',
            description: 'SImple easy'
        }

        const data = await Post.find();

        res.render('admin/dashboard', {
            locals,
            data,
            layout: adminLayout
        });
    } catch (error) {
        console.log(error);
    }
   
});

  
//get
///admin create new post

router.get('/add-post',authMiddleware, async (req, res) => {
    try {
        const locals = {
            title: 'Add Post',
            description: 'Simple easy'
        }

        const data = await Post.find();

        res.render('admin/add-post', {
            locals,
            layout: adminLayout
        });
    } catch (error) {
        console.log(error);
    }
   
});




///admin create new post
router.post('/add-post', authMiddleware, upload.single('image'), async (req, res) => {
    try {
        // Kiểm tra xem có hình ảnh không
        let imageUrl = '';
        if (req.file) {
            imageUrl = '/uploads/' + req.file.filename;  // Lưu đường dẫn tới hình ảnh đã tải lên
        }

        // Tạo bài viết mới với hình ảnh (nếu có)
        const newPost = new Post({
            title: req.body.title,
            body: req.body.body,
            imageUrl: imageUrl  // Lưu đường dẫn hình ảnh vào cơ sở dữ liệu
        });

        // Lưu bài viết mới vào cơ sở dữ liệu
        await newPost.save();
        res.redirect('/dashboard');  // Chuyển hướng về dashboard sau khi tạo bài viết thành công
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error uploading post' });
    }
});



// router.post('/add-post',authMiddleware, async (req, res) => {
//     try {   
//         try {
//             const newPost = new Post({
//                 title: req.body.title,
//                 body: req.body.body
//     });

//     await Post.create(newPost);
//     res.redirect('/dashboard');
// }catch (error) {
//     console.log(error);
// }

    
      
//     } catch (error) {
//         console.log(error);
//     }
   
// });



//get
///admin create new post

router.get('/edit-post/:id',authMiddleware, async (req, res) => {
    try {
        const locals = {
            title: "Edit Post",
            description: "Free NodeJs"
        };
        const data = await Post.findOne({ _id: req.params.id});

        res.render('admin/edit-post', {
            locals,
            data,
            layout: adminLayout
        })



    } catch (error) {
        console.log(error);
    }
   
});





//put
///admin create new post

router.put('/edit-post/:id',authMiddleware, async (req, res) => {
    try {

    

       await Post.findByIdAndUpdate(req.params.id, {
        title: req.body.title,
        body: req.body.body,
        updatedAt: Date.now()
       });


       res.redirect(`/edit-post/${req.params.id}`);


    } catch (error) {
        console.log(error);
    }
   
});




//delete
///admin delete  post
router.delete('/delete-post/:id',authMiddleware, async (req, res) => {

    try {
        await Post.deleteOne({ _id: req.params.id});
        res.redirect('/dashboard');
    } catch (error) {
        console.log(error);   
    }

});



//get
///admin logout
router.get('/logout', (req, res) => {
    res.clearCookie('token');
    //res.json({ message: 'Logout successful.'});
    res.redirect('/');
});



 // router.post('/admin', async (req, res) => {
  

//     try {
      
//         const { username, password} = req.body;
        
//         if(req.body.username === 'admin' && req.body.password === 'password') {
//             res.send('You are logged in')
//         } else{
//             res.send('Wrong username or password');
//         }


    

//     } catch (error) {
//       console.log(error);
//     }
  
//   });
  


//admin register




  router.post('/register', async (req, res) => {
  

    try {
      
        const { username, password} = req.body;
        
        const hashedPassword = await bcrypt.hash(password, 10);

        try {
            const user = await User.create({ username, password: hashedPassword });
            res.status(201).json({message: 'User Created', user});
        } catch (error) {
            if(error.code === 11000) {
                res.status(409).json({message: 'User already in use'});
            }
            res.status(500).json({ message: 'Internal server errol'})
        }

    

    } catch (error) {
      console.log(error);
    }
  
  });



module.exports = router;