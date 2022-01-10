const Blog = require('../models/Blog')

function handleErrors(err) {
    const errors = { title: '', author: '', description: ''}

    if (err.message.includes('Please enter an title')) {
        errors.title = 'Please enter an title'
        return errors
    } 

    if (err.message.includes('Please enter a description')) {
        errors.description = 'Please enter a description'
        return errors
    }

    return errors
}

module.exports.createBlog = async (req, res) => {
    const { author, description, title } = req.body
    try {
        const blog = await Blog.create({ author, description, title })
        res.status(201).json({ status: 'success' }) 
    } catch (error) {
        const errors = handleErrors(error)
        res.status(400).json(errors)
    }
}

module.exports.getPosts = async (req, res) => {
    try {
        const posts = await Blog.find()
        res.status(200).json({ posts })
    } catch (error) {
        res.status(400).json(error)
        console.log(error)
    }
} 

module.exports.getPost = async (req, res) => {
    const id = req.params.id
    try {
        const post = await Blog.find({ _id: id })
        const postObject = post[0]
        res.status(200).json({ post: postObject })
    } catch (error) {
        res.status(400).json({ error: 'This post does not exist' })
        console.log(error)
    }
} 

module.exports.deleteBlog = async (req, res) => {
    const id = req.params.id

    try {
        await Blog.findOneAndDelete({ _id: id })
        res.status(200).json({ status: 'success'})
    } catch (error) {
        console.log(error)
    }
}

module.exports.updateBlog = async (req, res) => {
    const likeUpdate = req.body.likeCount
    if (!likeUpdate && likeUpdate !== 0) {
        const { description, title, id} = req.body
        try {
            await Blog.findOneAndUpdate({_id: id}, {description: description, title: title})
            res.status(200).json({ status: 'success' })
        } catch (error) {
            console.log(error)
            res.status(404).json({ message: 'No such blog post found'})
        }
    } else {
        const { likeCount, id, user, likeHistory, hasLiked } = req.body

        if (hasLiked) {
            const updatedLikeHistory = likeHistory.filter(userId => userId !== user)

            try {
                await Blog.findOneAndUpdate({_id: id}, {likeCount, likeHistory: updatedLikeHistory })
                res.status(200).json({ status: 'success' })
            } catch (error) {
                console.log(error)
                res.status(404).json({ message: 'No such blog post found'})
            }
        } else {
            likeHistory.push(user)
            try {
                await Blog.findOneAndUpdate({_id: id}, {likeCount, likeHistory: likeHistory})
                res.status(200).json({ status: 'success' })
            } catch (error) {
                console.log(error)
                res.status(404).json({ message: 'No such blog post found'})
            }
        }
    }

   
} 