$(".btn-success").on("click", function() {
    displayResults();
});

$(document).on("keypress", function(event) {
    if (event.which === 13) {
        displayResults();
    };
});

document.getElementById("searchButton").addEventListener("click", function(event) {
    const searchBox = document.getElementById("searchBox").value;
    fetch('/api/new/' + searchBox)
     .then(function(res) {
         return res.json();
     })
     .then(function(myJson) {
         console.log(myJson);
         document.querySelector(".searchResults").innerHTML = myJson;
     })
});

function displayResults() {
    if ($(".search").val() == "") {
        console.log("Nah bruh");
    } else {
    $(".searchResults").slideDown("slow");
    };
};