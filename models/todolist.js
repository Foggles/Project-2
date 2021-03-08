// Requiring bcrypt for password hashing. Using the bcryptjs version as the regular bcrypt module sometimes causes errors on Windows machines.

// Creating our User model
module.exports = function (Sequelize, DataTypes) {
 const todolist = Sequelize.define(
  'todolist',
  {
   // The email cannot be null, and must be a proper email before creation
   id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
   },
   // The password cannot be null
   title: {
    type: DataTypes.STRING,
    allowNull: true,
   },
   email: {
    type: DataTypes.STRING,
    allowNull: true,
   },
   checked: {
    type: DataTypes.STRING,
    allowNull: true,
   },
   type: {
    type: DataTypes.STRING,
    allowNull: true,
   },
  },
  {
   timestamps: false,
  }
 );
 return todolist;
};
