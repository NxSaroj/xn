const { Schema, model } = require('mongoose');

const banUserConfig = new Schema({
    userId: {
        type: [String],
        required: true
    }, 

})

export default model('banUserConfig', banUserConfig)