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
    };
};