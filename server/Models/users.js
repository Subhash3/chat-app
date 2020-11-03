const mongoose = require('mongoose')
const Schema = mongoose.Schema

const leanersSchema = new Schema({
    _id: mongoose.Types.ObjectId,
    "profileOrdering": Object,
    "Music": Object,
    "Sports": Object,
    "Arts": Object,
    "Others": Object,
    "interests": Object,
    "email": String,
    "password": String,
    "educations": Object,
    "skills": Object,
    "accomplishments": Object,
    "workExperiences": Object,
    "internshipExperiences": Object,
    "volunteerExperiences": Object,
    "__v": Number,
    "country": String,
    "date": Object,
    "faculty": Object,
    "gender": String,
    "instituteName": Object,
    "name": String,
    "phone": String,
    "pincode": Number,
    "state": String,
    "bio": String,
    "summury": String,
    "imageUrl": String

})

const Learner = mongoose.model('learners', leanersSchema)

module.exports = {
    LearnersModel: Learner
}