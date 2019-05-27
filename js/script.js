/*
    Adding Form Validation and Interactivity with Javascript/jQuery
    Developer: Samuel Piedra
    Date: 05/26/2019
*/
$(document).ready(function() {
  $("#name").focus();
  $("#other-title").hide();
  $("#title").val("full-stack js developer");
  $("#design").val("default");
  hideColorDropDown(true);
});

$("#title").change(function() {
  const selectedTitle = $("#title option:selected");
  if (selectedTitle.val() === "other") {
    $("#other-title").show();
  } else {
    $("#other-title").hide();
  }
});

$("#design").change(function() {
  const selectedDesign = $("#design option:selected");
  const colorSelect = $("#color");
  const colorOptions = $("#color option");
  const regex = /JS Puns shirt only/;
  hideColorDropDown(false);
  colorOptions.each(function() {
    if (selectedDesign.val() === "js puns") {
      colorSelect.val("cornflowerblue");
      regex.test($(this).text()) ? $(this).show() : $(this).hide();
    } else if (selectedDesign.val() === "heart js") {
      colorSelect.val("tomato");
      !regex.test($(this).text()) ? $(this).show() : $(this).hide();
    } else {
      $(this).show();
    }
  });
});

function hideColorDropDown(isHidden) {
  const colorDropDown = $("#color");
  const colorLabel = colorDropDown.prev();
  if (isHidden) {
    colorDropDown.hide();
    colorLabel.text("Please Select a T-Shirt theme");
  } else {
    colorDropDown.show();
    colorLabel.text("Color:");
  }
}
