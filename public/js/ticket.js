// Jack's Code
$(document).ready(() => {
    const ticketCreateForm = $("form#ticketCreate");
    const serviceInput = $("input#serviceName");
    const descriptionInput = $("input#description");
    const postCodeInput = $("input#postcode");
    $.get("/api/user_data").then(data => {
        $(".member-name").text(data.email);
      });
    console.log({ticketCreateForm});
    ticketCreateForm.on("submit", event => {
        event.preventDefault();
        const ticketData = {
            service: serviceInput.val().trim(),
            description: descriptionInput.val().trim(),
            postcode: postCodeInput.val().trim()
        };
        if (!ticketData.service || !ticketData.description || !ticketData.postcode) {
            return;
        }
        createTicket(ticketData.service, ticketData.description, ticketData.postcode);
        serviceInput.val("");
        descriptionInput.val("");
        postCodeInput.val("");
    });

    function createTicket(service, description, postcode) {
        $.get("/api/user_data").then(data => {
            return data.id;
        }).then((userId) => {
            return $.post("/api/tickets", {
                service: service,
                description: description,
                postcode: postcode,
                status: "Pending",
                // createdById: userId,
                receivedUserId: 0,
            })
        })
        .then((response) => {
            console.log("SUCCESS");
            console.log(response);
        })
        .catch(err => {
            console.log(err);
        });
    }
});