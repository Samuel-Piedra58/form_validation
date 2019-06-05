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
  // Get Text content of check box options
  const chkboxLabel = e.target.parentNode.textContent;
  // Pass the text to the extract event detail function to capture the important details for text
  const clickedEvent = extractEventDetail(chkboxLabel);
  // Get whether or not the checkbox is checked
  const clickedEvent_isChecked = $(this).prop("checked");
  let totalCost = 0;
  $('fieldset.activities input[type="checkbox"]').each(function() {
    // Get the parent label element of the checkbox element
    const otherChkbox = $(this);
    // extract the label text
    const otherChkboxLabel = $(this).parent();
    // extract the details from the event text
    const otherEvent = extractEventDetail(otherChkboxLabel.text());
    if (
      chkboxLabel != otherChkboxLabel.text() &&
      otherEvent.event_day === clickedEvent.event_day &&
      ((otherEvent.event_start_time >= clickedEvent.event_start_time &&
        otherEvent.event_start_time <= clickedEvent.event_end_time) ||
        (otherEvent.event_end_time <= clickedEvent.event_end_time &&
          otherEvent.event_end_time >= clickedEvent.event_start_time))
    ) {
      if (clickedEvent_isChecked) {
        otherChkboxLabel.css("text-decoration", "line-through");
        otherChkbox.prop("disabled", true);
      } else {
        otherChkboxLabel.css("text-decoration", "none");
        otherChkbox.prop("disabled", false);
      }
    }
    // Get total cost from all checked items
    if (otherChkbox.prop("checked")) {
      totalCost = totalCost + otherEvent.event_cost;
    }
  });
  console.log(totalCost);
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
