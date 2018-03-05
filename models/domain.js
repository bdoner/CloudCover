const mongoose = require("mongoose");

var ccSchema = new mongoose.Schema({
    names: String,
    cname: String,
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("CC", ccSchema);