const { Schema, model } = require('mongoose');

const drawSchema = new Schema({
    name: String,
    coords: [Object],
})

module.exports = model('Drawing', drawSchema);
