const User = require('../models/User')
const jwt = require('jsonwebtoken')

function createToken(id) {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: 1 * 24 * 60 * 60
    })
}

function handleErrors(err) {
    const errors = { username: '', password: '' }

    if (err.code === 11000) {
        errors.username = 'This username has already been taken';
        return errors
    }

    if (err.message.includes('Minimum password length is 6 characters')) {
        errors.password = 'Minimum password length is 6 characters'
    }

    if (err.message === 'Incorrect password') {
        errors.password = 'This password in invalid'
    }

    if (err.message === 'Incorrect username') {
        errors.username = 'This username is invalid'
    }

    return errors
}

module.exports.signUp = async (req, res) => {
    const { username, password } = req.body
    const usernameLC = username.toLowerCase()

    try {
        const user = await User.create({ username, password, usernameLC })
        const token = createToken(user._id)
        res.status(201).json({ token, user: user.username })
    } catch (error) {
        const errors = handleErrors(error)
        console.log(errors)
        res.status(400).json(errors)
    }
}

module.exports.signIn = async (req, res) => {
    const { username, password } = req.body
    try {
        const user = await User.login(username, password)
        const token = createToken(user._id)
        res.status(200).json({ token, user: user.username })
    } catch (error) {
        const errors = handleErrors(error) 
        res.status(400).json(errors)
     }
} 

module.exports.checkUser = async(req, res) => {
    const { token } = req.body

    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
            if (err) {
                res.status(401).json({ token: null, user: null })
            } else {
                const userId = decodedToken.id
                try {
                    const user = await User.findById({ _id: userId })
                    res.status(200).json({ token, user: user.username })
                } catch (error) {
                    console.log(error)
                }
            }
        })
    } else {
        res.status(401).json({ token: null })
    }
}