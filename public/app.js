
$(document).on("click", "#savenote", () => {
    const thisId = $(this).attr("data-id");
    // console.log("this ID:",thisId)
  
    $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
        title: $("#titleinput").val(),
        body: $("#bodyinput").val()
      }
    })
      .then(data => {
        console.log(data);
        $("#notes").empty();
      });
  
    $("#titleinput").val("");
    $("#bodyinput").val("");
  
  });