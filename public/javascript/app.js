$(".btn-success").on("click", function() {
    displayResults();
});

$(document).on("keypress", function(event) {
    if (event.which === 13) {
        displayResults();
    };
});

function displayResults() {
    if ($(".search").val() == "") {
        console.log("Nah bruh");
    } else {
    $(".searchResults").slideDown("slow");

    fetch("/api/new")
        .then(function(response) {
            $(".searchResults").innerHTML(response);
        })
        .catch(function(error) {
            console.log(error);
        });

    };
};

$("#searchBox").focus();