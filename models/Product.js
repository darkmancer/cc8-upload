module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define("Product", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    imgUrl: DataTypes.STRING,
  },{
      underscored: true
  });

  return Product;
};
