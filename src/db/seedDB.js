
import models from './models'
// models.user
models.User.sync({force: false}).then(()=> {

    console.log("Created User Table")

    return models.User.create({
        email:'admin',
        status:'ACTIVE',
        password:'admin'
    })
})
models.Post.sync({force: false}).then(()=> {

    console.log("Created Post Table")
})
console.log("Done!")
