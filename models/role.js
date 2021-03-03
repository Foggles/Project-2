module.exports = (sequelize, DataTypes) => {
  const Role= sequelize.define('Role', {
    id: { 
        autoIncrement: true, 
        primaryKey: true, 
        type: DataTypes.INTEGER,
      },
    // Giving the role model a title of type STRING
    title: {
        type:DataTypes.STRING,
        allowNull:false,
      },

  });

  // Associating role with user
  // When an role is deleted, also delete any associated user
  Role.associate = (models)=> {
    Role.hasMany(models.User, {
      onDelete: 'cascade',
    });
  };

  return Role;
};