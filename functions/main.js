var funk = {};
const cheerio = require("cheerio");
const arrayUnique = require("array-unique");
const dns = require("dns");
const CC = require("../models/domain.js");
const needle = require("needle");

funk.crt = function (post) {
    return needle("get", "https://crt.sh/?q=%25." + post)
        .then (function(response) {
            var $ = cheerio.load(response.body);

            return new Promise(function(resolve, reject) {
                //Create temp array to store domains in
                var domains = [];

                //Grab the domain name
                $("td:nth-of-type(4)").map(function (index, element) {
                    const domainName = $(this).text();
                    //Check if domain starts with wildcard.
                    if (!domainName.startsWith("*")) {
                        //Write to array
                        domains.push(domainName);
                    };
                });
                //Remove duplicate domains
                var uniqueDomains = arrayUnique(domains);
                resolve(uniqueDomains);
            });
        })
            .catch(function(error) {
        console.error("Something went wrong with CRT", error);
    })
};

funk.threatcrowd = function(post) {
    return needle("get", "https://www.threatcrowd.org/searchApi/v2/domain/report/?domain=" + post)
        .then (function(response) {

            //assign body to constant.
            const body = response.body;

            return new Promise(function(resolve, reject) {
            //Check if threatcrowd has any information about the specific domain.
            if (body.response_code == "0") {
                //TODO: Return empty string if body.response_code is 0.
               reject("No info")
            }
                var subdomains = body.subdomains;
                //Insert every subdomain to the DB.
                subdomains.forEach(function (domain) {
                    resolve(domain);
                });
            });

            return Promise.all(subdomains);
        })
        .catch(function(error) {
        console.error("Something went wrong with Threatcrowd", error);
        })
};

module.exports = funk;
