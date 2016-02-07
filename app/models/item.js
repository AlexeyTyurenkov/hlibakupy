var mongoose = require('mongoose');
var itemSchema = mongoose.Schema({
   item:{
         item_name : String,
          quantity : String
       }
});
module.exports = mongoose.model('Item', itemSchema);