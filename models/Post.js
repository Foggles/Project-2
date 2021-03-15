module.exports = (sequelize, DataTypes) => {
    const Post = sequelize.define('Post' , 
      {
        Name: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            len: [1],
          },
        },
        Message: {
          type: DataTypes.TEXT,
          allowNull: false,
          validate: {
            len: [1],
          },
        },
        Phone: {
          type: DataTypes.INTEGER,
        },
        Email: {
            type:DataTypes.STRING,
        },
      },
      {
        // Other model options go here
        sequelize, // We need to pass the connection instance
        modelName: 'Post', // We need to choose the model name
      }
    );
  
    return Post;
  };
  