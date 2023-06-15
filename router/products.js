const express = require('express');
const router = express.Router();
const productsModel = require("../model/products");

router.post("/post", async(req,res,next) =>{

    console.log("Post api hit!", req.body.products)
    const reqArr= req.body.products
    const resArr =[]

    reqArr.map( async (data) =>{
    try{
	   const productsData = new productsModel(data);
	   const newproductsData = await productsData.save();
     resArr.push(newproductsData)
     if(resArr.length == reqArr.length)
     res.status(200).send(newproductsData);
     }
    catch(err)
    {
    	 console.log(err);
      res.status(400).send(err);
    }
   })
 })


  router.get("/get", async(req,res,next) =>{
     console.log("get api hit");
  	try
  	{
         const productsData = await productsModel.find();
         console.log("data being sent from get api is....",productsData);
         res.status(200).send(productsData)
  	}
  	catch(err)
  	{
  		console.log(err);
  		res.status(400).send(err);
  	}
  })


router.delete("/delete", async(req,res,next) => {
   console.log("delete API hit");
		try
	{
       const response = await productsModel.deleteMany({});
       res.send(response)
	}
	catch(err)
	{
		console.log(err);
		res.status(400).send(err);
	}

})
module.exports = router;