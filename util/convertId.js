import { ObjectId } from "mongodb";

const convertToObjectId = id => {
	return new ObjectId(`${id}`);
};

export default convertToObjectId