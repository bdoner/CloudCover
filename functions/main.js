var funk = {};
const request = require("request");
const chalk = require('chalk');
const cheerio = require("cheerio");
const arrayUnique = require("array-unique");
const dns = require("dns");
const CC = require("../models/domain.js");
const needle = require("needle");

funk.crt = function (post) {
    const domain = post;

    return needle('get', "https://crt.sh/?q=%25." + domain)
        .then(function(response) {
            var $ = cheerio.load(response.body);

            //Create temp array to store domains in
            var domains = [];

            //Grab the domain name
            $("td:nth-of-type(4)").map(function(index, element) {
                const domainName = $(this).text();
                //Check if domain is a wildcard.
                if (!domainName.startsWith("*")) {
                    //Write to array
                    domains.push(domainName);
                }
            });

            //Remove duplicate domains
            var uniqueDomains = arrayUnique(domains);

            // Iterate over array and add to DB
            uniqueDomains.forEach(function(domain) {

                return new Promise((resolve, reject) => {
                    // Resolve CNames
                    dns.resolveCname(domain, function(error, address) {
                        if (!error) {
                            CC.create({names: domain, cname: address}, function(error, insertedDomain) {
                                if(error) {
                                    console.log(error)
                                    reject(error);
                                } else {
                                    resolve(insertedDomain)
                                    console.log(insertedDomain);
                                };
                            });
                        };
                    });
                })
        
            });

            return Promise.all(uniqueDomains);

        }).catch((error) => {
            console.error('crt FAILED', error);
        });
};

funk.threatcrowd = function(post) {
    var domain = post;
    return needle('get', "https://www.threatcrowd.org/searchApi/v2/domain/report/?domain=" + domain)
        .then(function(response) {
            let jsonBody;

            if (response.body.response_code == "0") {
                return null;
            }

            try {
                jsonBody = JSON.parse(response.body);
            } catch (err) {
                console.error(chalk.red(err), '\n', response.body);
                //jsonresponse.Body = { error: err }
            }
            
            var subdomains = response.body.subdomains;
            subdomains.forEach(function(domain) {
                return new Promise((resolve, reject) => {
                        // Resolve CNames
                dns.resolveCname(domain, function(error, address) {
                    if (!error) {
                        CC.create({names: domain, cname: address}, function(error, insertedDomain) {
                            if(error) {
                                console.log(error)
                                reject(error);
                            } else {
                                console.log(insertedDomain);
                                resolve(insertedDomain);
                            };
                        });
                    };
                });
            });

                
            });
            console.log("______________________");

            return Promise.all(subdomains);
        }).catch((error) => {
            console.error('threatcrowd FAILED', error);
        });
};

module.exports = funk;
