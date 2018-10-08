import Sequelize from 'sequelize'
/*
 */
import db from './dbConnect'
import bcrypt from 'bcrypt'
const User = db.define('user',{
    id: {
        type: Sequelize.UUID,
        defaultValue:Sequelize.UUIDV4,
        primaryKey: true,
    },
    email: {
        type: Sequelize.STRING,
        primaryKey: true,
    },
    password: {
        type: Sequelize.STRING
    },
    createdAt: {
        type: Sequelize.DATE,
        field: 'created_at',
    },
    updatedAt: {
        type: Sequelize.DATE,
        field: 'updated_at',
    },
    status: {
        type: Sequelize.ENUM('UNVERIFIED', 'ACTIVE', 'DELETED'),
        defaultValue: 'UNVERIFIED',
    },

}, {
    underscored: true,
    freezeTableName: true,
    instanceMethods: {
        validatePassword: async function(password) {
            return await bcrypt.compare(password, this.password);
        }
    }

});
User.beforeCreate((user, options) => {

    return bcrypt.hash(user.password, bcrypt.genSaltSync(8))
        .then(hash => {
            user.password = hash;
        })
        .catch(err => {
            throw new Error();
        });
});


const Post = db.define('post',{
     id: {
        type: Sequelize.UUID,
        defaultValue:Sequelize.UUIDV4,
        primaryKey: true,
    },
    createdAt: {
        type: Sequelize.DATE,
        field: 'created_at',
    },
    updatedAt: {
        type: Sequelize.DATE,
        field: 'updated_at',
    },
    title: {
        type: Sequelize.TEXT,
        defaultValue: 'No Title',
    },
    pictureURL: {
        type: Sequelize.STRING,
        field: 'picture_url',
        defaultValue:'https://i.imgur.com/Sr62xVL.jpg'
    },
},{
    underscored: true,
    freezeTableName: true
});
User.hasMany(Post, { as: 'posts', foreignKey: 'owner_id' })
Post.belongsTo(User, { as: 'owner', foreignKey: 'owner_id' })

const models = {
    User,
    Post
}
export default models
