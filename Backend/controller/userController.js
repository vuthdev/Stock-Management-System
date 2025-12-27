const Users = require("../models/users")
const path = require('path');
const fs = require('fs');

exports.getCount = async (req, res) => {
    const user = await Users.countDocuments()
    res.json(user)
}

exports.getUsers = async (req, res) => {
    const user = await Users.find()
    res.json(user)
}

exports.createUser = async (req, res) => {
    try {
        const imagePath = req.file ? "/uploads/" + req.file.filename : null;
        const UserData = {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            gender: req.body.gender,
            image: imagePath,
        }
        const user = new Users(UserData)
        await user.save()
        res.status(200).json(user)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

exports.getUserById = async (req, res) => {
    const user = await Users.findById(req.params.id)
    res.json(user)
}

exports.deleteUser = async (req, res) => {
    try {
        const user = await Users.findById(req.params.id); // Assuming you fixed the 'User' vs 'Users' error
        if (!user) return res.status(404).json({ message: "User not found" });

        if (user.image && user.image !== '/default-user.png') {
            const filename = user.image.replace('/uploads/', ''); 
            
            const absolutePath = path.join(__dirname, "..", "uploads", filename); 
            
            console.log("Attempting to delete file at:", absolutePath);

            if (fs.existsSync(absolutePath)) {
                fs.unlinkSync(absolutePath);
                console.log("File deleted successfully:", absolutePath);
            } else {
                console.log("File not found on disk at:", absolutePath);
            }
        }

        await Users.findByIdAndDelete(req.params.id);
        res.json({ message: "User deleted successfully" });
    } catch (err) {
        console.error("Deletion error:", err);
        res.status(500).json({ message: 'Server error during deletion.', details: err.message });
    }
}

exports.updateUser = async (req, res) => {
    try {
        const user = await Users.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        let imagePath = user.image;
        if (req.file) {
        if (user.image) {
            const oldPath = path.join(__dirname, "../", user.image);
            if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }
        imagePath = "/uploads/" + req.file.filename;
        }

        user.username = req.body.username;
        user.email = req.body.email;
        user.password = req.body.password;
        user.gender = req.body.gender;
        user.image = imagePath;

        const updatedUser = await user.save();
        res.json(updatedUser);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}