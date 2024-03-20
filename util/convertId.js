const { ObjectId } = require("mongodb");

const convertToObjectId = id => {
	return new ObjectId(`${id}`);
};

module.exports = convertToObjectId