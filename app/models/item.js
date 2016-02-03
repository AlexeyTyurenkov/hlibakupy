var mongoose = require('mongoose');

var itemSchema = mongoose.Schema({
        item_name : String,
        count : String
        //user:{
        //    type:Schema.ObjectId,
        //        ref:'users'
        //}
        //required: true
});

// validation
//itemSchema.path('item_name').validate(function (v) {
//    return v.length > 3 && v.length < 20;
//});
module.exports = mongoose.model('Item', itemSchema);