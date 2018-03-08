const express = require("express");
const router = express.Router();
const CC = require("../models/domain");
const functions = require("../functions/main");
const {tldExists, getDomain} = require('tldjs');
const arrayUnique = require("array-unique");
const dns = require("dns");



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

router.get("/new/:id", function(req, res) {
    //Strip all subdomains - the post var now only contains the domain and TLD.
    var post = getDomain(req.params.id);
    console.log(post);
    //Check if the user inserts a valid TLD.
    if (!tldExists(post)) {
        return res.redirect("/");
    }

    //TODO:  Write it to the DB.
    const crt = functions.crt(post);
    const threatcrowd = functions.threatcrowd(post);

    Promise.all([
        crt,
        threatcrowd
    ]).then(function(values) {
        let domains = arrayUnique(values[0].concat(values[1]));
        res.send(JSON.stringify(domains, null, '\t'));

        //Write it to the DB.
        domains.forEach(function (domain) {
                // Resolve CNames
                dns.resolveCname(domain, function (error, address) {
                if (!error) {
                    CC.create({names: domain, cname: address}, function (error, insertedDomain) {
                        if (error) {
                            console.log(error)
                        } else {
                            console.log(insertedDomain);

                        };

                    });
                };

            });
        });


    });
});

module.exports = router;