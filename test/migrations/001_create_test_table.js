exports.up = async function(knex) {
  await knex.schema.createTable('test_table', (table) => {
    table.increments('id');
    table.string('name');
    table.timestamps(true, true);
  });
};

exports.down = async function(knex) {
  await knex.schema.dropTable('test_table');
}; 