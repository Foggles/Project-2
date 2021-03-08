module.exports = (sequelize, DataTypes) => {
  const Ticket = sequelize.define('Ticket', {
    id: { 
        autoIncrement: true, 
        primaryKey: true, 
        type: DataTypes.INTEGER,
      },
    // Giving the role model a title of type STRING
    service: {
        type:DataTypes.STRING,
        allowNull:false,
      },

    description: {
      type: DataTypes.STRING,
      allowNull:false
    },

    postcode: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING, 
    },

  });

  // Associating ticket with user
  // When an ticket is deleted, also delete any associated user
  Ticket.associate = (models)=> {   
    Ticket.belongsTo(models.User, {
      foreignKey: {
        allowNull: false,
      },
    });
  };

  return Ticket;
};