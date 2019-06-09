/*
    Adding Form Validation and Interactivity with Javascript/jQuery
    Developer: Samuel Piedra
    Date: 05/26/2019
*/
// Global Variables;
let totalCalculated = false;

$(document).ready(function() {
  $("#name").focus();
  $("#other-title").hide();
  $("#title").val("full-stack js developer");
  $("#design").val("default");
  hideColorDropDown(true);
  const paymentFieldset = $("form fieldset:nth-child(4)");
  paymentFieldset.find("#payment").val("credit card");
  paymentFieldset.find("#credit-card").show();
  paymentFieldset
    .find("div")
    .eq(4)
    .hide();
  paymentFieldset
    .find("div")
    .eq(5)
    .hide();
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
  const chkboxLabel = e.target.parentNode.textContent;
  const clickedEvent = extractEventDetail(chkboxLabel);
  const clickedEvent_isChecked = $(this).prop("checked");
  let totalCost = 0;

  $('fieldset.activities input[type="checkbox"]').each(function() {
    const otherChkbox = $(this);
    const otherChkboxLabel = $(this).parent();
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
        otherChkboxLabel.css("color", "grey");
        otherChkbox.prop("disabled", true);
      } else {
        otherChkboxLabel.css("color", "#000");
        otherChkbox.prop("disabled", false);
      }
    }
    // Get total cost from all checked items
    if (otherChkbox.prop("checked")) {
      totalCost = totalCost + otherEvent.event_cost;
    }
  });
  if (!totalCalculated) {
    $("fieldset.activities").append(
      $(document.createElement("p")).text(`Total: $${totalCost}`)
    );
    totalCalculated = true;
  } else {
    $("fieldset.activities p").text(`Total: $${totalCost}`);
  }
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

$("#payment").change(function() {
  const paymentFieldset = $("form fieldset:nth-child(4)");
  const paymentSelection = paymentFieldset.find("#payment");
  const paymentCreditCard = paymentFieldset.find("#credit-card");
  const paymentsPaypal = paymentFieldset.find("div").eq(4);
  const paymentsBitcoin = paymentFieldset.find("div").eq(5);

  if (
    paymentSelection.val() === "credit card" ||
    paymentSelection.val() === "select_method"
  ) {
    paymentCreditCard.show();
    paymentsPaypal.hide();
    paymentsBitcoin.hide();
  } else if (paymentSelection.val() === "paypal") {
    paymentCreditCard.hide();
    paymentsPaypal.show();
    paymentsBitcoin.hide();
  } else {
    paymentCreditCard.hide();
    paymentsPaypal.hide();
    paymentsBitcoin.show();
  }
});

$('button[type="submit"').click(function(e) {
  e.preventDefault();
});

/*
  ***********************
  Form Field VAlidators
  ***********************
*/
function isValidName(name) {
  return /\w+/.test(name);
}

function isValidEmail(email) {
  return /^[^@]+@[^@.]+\.[a-z]+$/i.test(email);
}

function isValidActivities(activities) {
  let valid = false;
  activities.each(function() {
    if (this.checked) {
      valid = true;
    }
  });
  return valid;
}

// Change form input to notify user if input is invalid
function fieldAlert(field, isValid) {
  if (isValid) {
    field.css("border", "solid #c1deeb 2px");
  } else {
    field.css("border", "solid red 4px");
  }
}
