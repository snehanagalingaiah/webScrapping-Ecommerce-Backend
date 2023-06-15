const axios = require("axios"); //fetch the data
const cheerio = require("cheerio"); // parse the data

module.exports.scrape = async () => {
 
	 const flipkart_url = "https://www.flipkart.com/search?q=mobiles"
    const snap_url = "https://www.snapdeal.com/search?keyword=mobiles&sort=rlvncy";
    const products= []
    console.log("products initialized", products);

      //scraping data from flipkart and pushing to products array
    const scrapeFlipkart = async () => {
     //fetch the data
  	        console.log("inside flipkart")
	        const flipkart_response = await axios.get(flipkart_url);
	        const flipkart_data = flipkart_response.data;
	       //load data
	         const $ = cheerio.load(flipkart_data);
	        $('div._1AtVbE.col-12-12').each((idx,ele) =>{
	       	title = $(ele).find('div._3pLy-c.row > div.col.col-7-12 > div._4rR01T').text();
	       	img = $(ele).find('div.MIXNux > div._2QcLo- > div > div.CXW8mj > img._396cs4').attr('src');
	       	rating = $(ele).find('div._3pLy-c.row > div.col.col-7-12 > div.gUuXy- > span._1lRcqv > div._3LWZlK').text();
	       	finalPrice = $(ele).find('div._3pLy-c.row > div.col.col-5-12.nlI3QM > div._3tbKJL > div._25b18c > div._30jeq3._1_WHN1').text();
	       	originalPrice = $(ele).find('div._3pLy-c.row > div.col.col-5-12.nlI3QM > div._3tbKJL > div._25b18c > div._3I9_wc._27UcVY').text();
	       	if(img && title && originalPrice && finalPrice && rating){
	       	const item ={
	       		title,
	       		img,
	       		rating,
	       		finalPrice,
	       		originalPrice
	       	}
	       	//console.log("item",item);
	       	products.push(item);
     }
	})}
  
    //scraping from snapdeal and pushing to products array
     const scrapeSnap = async() => {
           	console.log("inside snapdeal")
	         const snap_response = await axios.get(snap_url);
	         const snap_data = snap_response.data;
	         const $ = cheerio.load(snap_data);
            $('div.col-xs-6.favDp.product-tuple-listing.js-tuple').each((idx,ele) =>{
            	//item.img = $(ele).find('img').attr('src');
            	      img = $(ele).find('source.product-image').attr('srcset');
            	      title = $(ele).find('p.product-title').text();
            	      originalPrice = $(ele).find('span.lfloat.product-desc-price.strike').text();
            	      finalPrice = $(ele).find('span.lfloat.product-price').text();
            	      rating = $(ele).find('div.filled-stars').attr('style');
            	      if(img && title && originalPrice && finalPrice && rating){
            	      	rating = rating.replace('width:','');
            	      	rating= rating.replace('%','');
            	      	rating = (rating/100) * 5;
            	      	rating = rating.toFixed(2);
            	         const item ={
                         title,
                         img,
                         rating,
                         finalPrice,
                         originalPrice
                     	}
                     	products.push(item)
                      }
             })  
          }
 
  await scrapeSnap();
  await scrapeFlipkart();
  console.log("scraped productss",products);
  console.log("SCRAPED DATA LENGTH", products.length)
  if(products){
  	   console.log("going to delete prev data now");
  	   const res = await axios.delete(`http://localhost:8000/products/delete`);
  	   console.log("previous data deleted moving on to data load...",res)
      try
       {
          const res = await axios.post(`${process.env.BACKEND}/products/post`,{products});
          if(res)
          	console.log("data loaded successfully")
         // res.status(200).send("success");
       }
       catch(err)
       {
  	     console.log(err)
        // res.status(400).send(err);
       }
      }
      else{
      	console.log("scraper scraped no data")
      }
}

