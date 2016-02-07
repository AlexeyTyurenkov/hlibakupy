var mongoose = require('mongoose');
var itemSchema = mongoose.Schema({
   item:{
         item_name : String,
          quantity : String,
          _id: String
       }
});
module.exports = mongoose.model('Item', itemSchema);