const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const signSchema = new mongoose.Schema({
    username: {
        type: String,
        required:true
    },
    email: {
        type: String,
        required: true,
        unique:true
    },
    phone: {
        type: Number,
        required: true,
        unique:true
    },
    grade: {
        type:String,
        required:true
    },
    dateofbirth: {
        type: String,
        required:true
    },
    password: {
        type: String,
        required: true
    }
    
})

signSchema.methods.generateAuthToken = async function(){
    try {
        const token = jwt.sign({_id:this._id.toString(),name:this.username}, process.env.SECRET_KEY);
        
        return token;
    } catch (err) {
        res.send("the error part" + err);
        console.log("the error part" + err);
    }
}

signSchema.pre("save", async function(next) {
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password, 10);
    }
    
    next();
})


module.exports = mongoose.model('signtable', signSchema)