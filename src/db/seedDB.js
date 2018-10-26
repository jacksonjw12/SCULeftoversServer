
import models from './models'
// models.user
const forceTableRecreation = false
models.User.sync({force: forceTableRecreation}).then(()=> {

    console.log("Created User Table")

    return models.User.create({
        email:'admin',
        status:'ACTIVE',
        password:'admin'
    })
})
models.Post.sync({force: forceTableRecreation}).then(()=> {

    console.log("Created Post Table")
})
console.log("Done!")
