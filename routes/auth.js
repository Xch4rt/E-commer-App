const router = require('express').Router();
const User = require('../models/User')
const CryptoJS = require('crypto-js')
// Register
router.post('/register', async (req, res) => {
    const newUser = new User({
        username : req.body.username,
        email : req.body.email,
        password : CryptoJS.AES.encrypt(req.body.password,process.env.PASSWORD_PHRASE).toString(),
    })
    try{
        const savedUser = await newUser.save()
        res.status(201).json(savedUser)
    } catch(err){
        console.log(err)
        res.status(500).json(err);
    }

});

router.post('/login', async (req, res) => {
    try{
        const user = await User.findOne({userName : req.body.username});
        !user && res.status(401).json("Wrong Credentials!");

        const hashPassword = CryptoJS.AES.decrypt(user.password, process.env.PASSWORD_PHRASE);

        const originalPassword = hashPassword.toString(CryptoJS.enc.Utf8);
        const inputPassword = req.body.password;

        originalPassword !== inputPassword && res.status(401).json("Wrong Credentials!");

        const {password, ...others} = user
        res.status(200).json(others);

    } catch(err){
        console.log(err)
        res.status(500).json(err);
    }

})


module.exports = router