const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productsSchema = new Schema ({

	title:{
		type: String,
		required : true,
		trim: true
	},

	 img:{
		type: String,
		required : true,
		trim: true
	 },
   
     rating: {
   	    type: Number,
		required : true,
     },

     finalPrice: {
   	    type: String,
		required : true,
     },

     originalPrice: {
   	    type: String,
		required : true,
     },

})

const productsModel = mongoose.model("products", productsSchema )

module.exports = productsModel;