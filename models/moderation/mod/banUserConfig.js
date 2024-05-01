const { Schema, model } = require('mongoose');

const banUserConfig = new Schema({
    userId: {
        type: [String],
        required: true
    }, 

})

module.exports = model('banUserConfig', banUserConfig)