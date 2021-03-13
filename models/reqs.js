
// Requiring bcrypt for password hashing. Using the bcryptjs version as the regular bcrypt module sometimes causes errors on Windows machines
// Creating our User model
module.exports = function(sequelize, DataTypes) {
  const reqs = sequelize.define("reqs", {
    // The email cannot be null, and must be a proper email before creation
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true

    },
    // The password cannot be null
    todoId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    todoTitle: {
      type: DataTypes.STRING,
      allowNull: true
    },
    from: {
      type: DataTypes.STRING,
      allowNull: true
    },
    to: {
      type: DataTypes.STRING,
      allowNull: true
    },
    msg: {
      type: DataTypes.STRING,
      allowNull: true
    },
    state: {
      type: DataTypes.STRING,
      allowNull: true
    },

  });
  return reqs;
};
