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
    colorLabel.text("Please select a T-shirt theme");
  } else {
    colorDropDown.show();
    colorLabel.text("Color:");
  }
}

// using the parent node is a challenge. The event will bubble/delegate to unexpected objects when using the parent node attribute.
// Checkbox not working...
//
$("fieldset.activities").on("change", 'input[type="checkbox"]', function(e) {
  const userCheckedBoxParentLabel = e.target.parentNode.textContent;
  const checkedEvent = extractEventDetail(userCheckedBoxParentLabel);
  const isChecked = $(this).prop("checked");
  $('fieldset.activities input[type="checkbox"]').each(function() {
    const otherCheckbox = $(this).parent();
    const otherCheckboxParentLabel = otherCheckbox.text();
    const otherEvent = extractEventDetail(otherCheckboxParentLabel);
    if (
      isChecked &&
      userCheckedBoxParentLabel != otherCheckboxParentLabel &&
      otherEvent.event_day === checkedEvent.event_day &&
      ((otherEvent.event_start_time >= checkedEvent.event_start_time &&
        otherEvent.event_start_time <= checkedEvent.event_end_time) ||
        (otherEvent.event_end_time <= checkedEvent.event_end_time &&
          otherEvent.event_end_time >= checkedEvent.event_start_time))
    ) {
      otherCheckbox.css("text-decoration", "line-through");
    } else {
      otherCheckbox.css("text-decoration", "none");
    }
  });
});

function extractEventDetail(string) {
  const event_regex = /^(\D*)\s+?—\s+?(\r\n|\r|\n)?(Tuesday|Wednesday)?\s*?(\r\n|\r|\n)?(\d\d?)?(am|pm)?-?(\d\d?)?(am|pm)?,?\s*?\$(\d{3})$/;
  return updateEventTime({
    event_title: string.replace(event_regex, "$1").trim(),
    event_day: string
      .replace(event_regex, "$3")
      .trim()
      .toLowerCase(),
    event_start_time: parseInt(string.replace(event_regex, "$5")),
    event_start_merid: string
      .replace(event_regex, "$6")
      .trim()
      .toLowerCase(),
    event_end_time: parseInt(string.replace(event_regex, "$7")),
    event_end_merid: string
      .replace(event_regex, "$8")
      .trim()
      .toLowerCase(),
    event_cost: parseInt(string.replace(event_regex, "$9"))
  });
}

function updateEventTime(obj) {
  // calculate start time
  if (obj.event_start_merid === "pm" && obj.event_start_time != "12") {
    obj.event_start_time = obj.event_start_time + 12;
  }
  // calculate end time
  if (obj.event_end_merid === "pm" && obj.event_end_time != "12") {
    obj.event_end_time = obj.event_end_time + 12;
  }
  return obj;
}
