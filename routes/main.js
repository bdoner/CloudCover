var express = require("express");
var router = express.Router();
var CC = require("../models/domain");
var functions = require("../functions/main");
const {tldExists, getDomain} = require('tldjs');



//ROUTES
router.get("/", function(req, res) {
    var domainFind = CC.find({cname: { $in: [/.*appspot.com*/, /.*msecnd.net.*/, /.*aspnetcdn.com.*/, /.*azureedge.net.*/, /.*a248.e.akamai.net.*/, /.*secure.footprint.net.*/, /.*unbouncepages.com.*/, /.*cloudfront.net.*/]}}).sort({date: -1}).limit(10);
    domainFind.exec(function (error, domains) {
        if (error) {
            console.log(error);
        } else {
            res.render("index.ejs", {domains: domains});
        };
    });
});

router.post("/new", function(req, res) {
    //Strip all subdomains - the post var now only contains the domain and TLD.
    var post = getDomain(req.body.domain);
    console.log(post);
    //Check if the user inserts a valid TLD.
    if (!tldExists(post)) {
        return res.redirect("/");
    }

    //TODO: Write all output to a single array, make sure there are no duplicates and write it to the DB.
    functions.crt(post);
    functions.threatcrowd(post);


});

module.exports = router;