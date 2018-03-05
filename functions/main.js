var funk = {};
var request = require("request");
var cheerio = require("cheerio");
var arrayUnique = require("array-unique");
var dns = require("dns");
var CC = require("../models/domain.js");

funk.crt = function (post) {
    var domain = post;
    request("https://crt.sh/?q=%25." + domain, function(error, response, body) {
        var $ = cheerio.load(body);

        //Create temp array to store domains in
        var domains = [];

        //Grab the domain name
        $("td:nth-of-type(4)").map(function(index, element) {
            if ($(this)) {
                //TODO Remove any wildcard domains.
                //Write to array
                domains.push($(this).text());
            }});



        //Remove duplicate domains
        var uniqueDomains = arrayUnique(domains);

        return uniqueDomains;

        // Iterate over array and add to DB
        uniqueDomains.forEach(function(domain) {

            // Resolve CNames
            dns.resolveCname(domain, function(error, address) {
                if (!error) {
                    CC.create({names: domain, cname: address}, function(error, insertedDomain) {
                        if(error) {
                            console.log(error)
                        } else {
                            console.log(insertedDomain);
                        };
                    });
                };
            });
        });

    });
};

funk.threatcrowd = function(post) {
    var domain = post;
    request("https://www.threatcrowd.org/searchApi/v2/domain/report/?domain=" + domain, function(error, response, body) {
        var body = JSON.parse(body);
        if (body.response_code == "0") {
            console.log("No information about that domain, sorry.");
        } else {
            var subdomains = body.subdomains;
            subdomains.forEach(function(domain) {
                // Resolve CNames
                dns.resolveCname(domain, function(error, address) {
                    if (!error) {
                        CC.create({names: domain, cname: address}, function(error, insertedDomain) {
                            if(error) {
                                console.log(error)
                            } else {
                                console.log(insertedDomain);
                            };
                        });
                    };
                });
            });
            console.log("______________________");
        };
    });
};

module.exports = funk;
