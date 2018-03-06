const express = require("express");
const router = express.Router();
const CC = require("../models/domain");
const functions = require("../functions/main");
const arrayUnique = require("array-unique");
const {tldExists, getDomain} = require('tldjs');



//ROUTES
router.get("/", function(req, res) {
    var domainFind = CC.find({cname: { $in: [/.*appspot.com*/, /.*msecnd.net/, /.*aspnetcdn.com.*/, /.*azureedge.net.*/, /.*a248.e.akamai.net.*/, /.*secure.footprint.net.*/, /.*unbouncepages.com.*/, /.*cloudfront.net.*/]}}).sort({date: -1}).limit(10);
    domainFind.exec(function (error, domains) {
        if (error) {
            console.log(error);
        } else {
            res.render("index.ejs", {domains: domains});
        };
    });
});

router.get("/api/new/:domain", function(req, res) {
    //Strip all subdomains - the post var now only contains the domain and TLD.
    const domain = getDomain(req.params.domain);
    console.log(domain);
    //Check if the user inserts a valid TLD.
    if (!tldExists(domain)) {
        return res.send('["TLD does not exist"]');
    }
    //TODO: Write all output to a single array, make sure there are no duplicates and write it to the DB.
    const crt = functions.crt(domain);
    const threatcrowd = functions.threatcrowd(domain);

    Promise.all([
        crt,
        threatcrowd
    ]).then(function(values) {
        console.log('done from main.js');

        let domains = arrayUnique(values[0].concat(values[1]));
        
        domains = domains.filter((domain) => {
            return domain != null;
        });

        res.send(JSON.stringify(domains, null, '\t'))
    });

});

module.exports = router;