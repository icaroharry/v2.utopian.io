const User = require("../models").User

module.exports = socket => ({data}) => {
    User
        .findOne({name: data.name})
        .exec()
        .then(user => {
            if(!user.name) {
                return Promise.reject({status: 401,msg: 'missing name parameter'})
            } else if(!user) {
                return User.create(_.pick(data,['name']))
            }
            return user
        }).then((user) => {
            socket.emit('createUser',user.toObject())
        })
        .catch(err => {
            socket.emit('createUser',err)
        })
}