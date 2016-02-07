var mongoose = require('mongoose');
var itemSchema = mongoose.Schema({
   item:{
         item_name : String,
        item_count : String
       }
});
module.exports = mongoose.model('Item', itemSchema);