const { MongoClient } = require('mongodb');
const MongoDBClient = MongoClient;

let _db;

const mongoConnect = async callback => {
	try {
		const client = await MongoDBClient.connect(
			'mongodb+srv://Kato:mwg8cRLzcxAJ3a5P@katomarketcluster.bix4dpj.mongodb.net/shop?retryWrites=true&w=majority&appName=KatoMarketCluster'
		);
		console.log('Connected!');
		_db = client.db();
		callback();
	} catch (error) {
		throw new Error('Error connecting to MongoDB: ' + error.message);
	}
};

const getDb = () => {
	if (_db) {
		return _db;
	}
	throw 'No database found!';
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
