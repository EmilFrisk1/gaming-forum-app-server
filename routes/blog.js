const { Router } = require('express')
const blogController = require('./../controllers/blog')

const router = Router()

router.get('/blogs', blogController.getPosts)
router.post('/blogs/create', blogController.createBlog)
router.put('/blogs/update', blogController.updateBlog)
router.delete('/blogs/delete/:id', blogController.deleteBlog)
router.get('/blogs/:id', blogController.getPost)

module.exports = router   