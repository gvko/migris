exports.up = async function(db) {
  await db.createCollection('test_collection');
  await db.collection('test_collection').createIndex({ name: 1 });
};

exports.down = async function(db) {
  await db.collection('test_collection').drop();
}; 