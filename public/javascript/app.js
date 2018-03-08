$(".btn-success").on("click", function() {
    displayResults();
});

$(document).on("keypress", function(event) {
    if (event.which === 13) {
        displayResults();
    };
});

function displayResults() {
    if ($("#searchBox").val() == "") {
        swal({
            type: "error",
            title: "Slow down captain.",
            text: "You cannot request an empty domain."
            });
    } else {
    $(".searchResults").slideDown("slow");

        const searchBox = $("#searchBox").val();

        fetch("/new/" + searchBox)
            .then(function(response) {
                return response.json();
            })
            .then(function(myJSON) {
                $(".searchResults").html("<ul>");

                myJSON.forEach(function(entry) {
                    $(".searchResults").append("<li>" + entry + "</li>");
                });
                $(".searchResults").append("</ul>");
            });

        };
};

$("#searchBox").focus();