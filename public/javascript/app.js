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

                let html = "<ul>";

                myJSON.forEach(function(entry) {
                   html += "<li>" + entry + "</li>";
                });

                html += "</ul>";

                $(".searchResults").html(html);

            });

        };
};

$("#searchBox").focus();