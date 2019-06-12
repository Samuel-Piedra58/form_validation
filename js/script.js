/*
    Adding Form Validation and Interactivity with Javascript/jQuery
    Developer: Samuel Piedra
    Date: 05/26/2019
*/
// Global Variables;
const nameField = $("#name");
const emailField = $("#mail");
const jobField = $("#title");
const otherJobField = $("#other-title");
const colorDropDown = $("#color");
const tShirtDesignField = $("#design");
const activitiesField = $("fieldset.activities");
const activitiesLegend = $("fieldset.activities legend");
const activitiesCheckboxes = $('fieldset.activities input[type="checkbox"]');
const paymentFieldset = $("form fieldset:nth-child(4)");
const paymentSelection = paymentFieldset.find("#payment");
const paymentCreditCard = paymentFieldset.find("#credit-card");
const paymentCardNumber = $("#cc-num");
const paymentZipCode = $("#zip");
const paymentCvv = $("#cvv");
const paymentsPaypal = paymentFieldset.find("div").eq(4);
const paymentsBitcoin = paymentFieldset.find("div").eq(5);
let totalCalculated = false;

// Force Reset of Fields
nameField.focus();
otherJobField.hide();
jobField.val("full-stack js developer");
tShirtDesignField.val("default");
hideColorDropDown(true);
paymentsPaypal.hide();
paymentsBitcoin.hide();
paymentCreditCard.show();

jobField.change(function() {
  const selectedTitle = $("#title option:selected");
  selectedTitle.val() === "other" ? otherJobField.show() : otherJobField.hide();
});

tShirtDesignField.change(function() {
  const selectedDesign = $("#design option:selected").val();
  const colorOptions = $("#color option");
  const regex = /JS Puns shirt only/;
  colorOptions.each(function() {
    const currentColor = $(this).text();
    if (selectedDesign === "js puns") {
      colorDropDown.val("cornflowerblue");
      regex.test(currentColor) ? $(this).show() : $(this).hide();
    } else {
      colorDropDown.val("tomato");
      regex.test(currentColor) ? $(this).hide() : $(this).show();
    }
  });
  hideColorDropDown(false);
});

function hideColorDropDown(isHidden) {
  if (isHidden) {
    colorDropDown.hide();
    colorDropDown.prev().text("Please select a T-shirt theme");
  } else {
    colorDropDown.show();
    colorDropDown.prev().text("Color:");
  }
}

activitiesField.on("change", 'input[type="checkbox"]', function(e) {
  const cbLabel = e.target.parentNode.textContent;
  const cEvent = extractEventDetail(cbLabel);
  const cEvent_isChecked = $(this).prop("checked");
  let totalCost = 0;

  activitiesCheckboxes.each(function() {
    const oBox = $(this);
    const obLabel = $(this).parent();
    const oEvent = extractEventDetail(obLabel.text());
    if (
      cbLabel != obLabel.text() &&
      oEvent.event_day === cEvent.event_day &&
      ((oEvent.event_start_time >= cEvent.event_start_time &&
        oEvent.event_start_time <= cEvent.event_end_time) ||
        (oEvent.event_end_time <= cEvent.event_end_time &&
          oEvent.event_end_time >= cEvent.event_start_time))
    ) {
      if (cEvent_isChecked) {
        obLabel.css("color", "grey");
        oBox.prop("disabled", true);
      } else {
        obLabel.css("color", "#000");
        oBox.prop("disabled", false);
      }
    }
    // Get total cost from all checked items
    if (oBox.prop("checked")) {
      totalCost = totalCost + cEvent.event_cost;
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
  if (
    paymentSelection.val() === "credit card" ||
    paymentSelection.val() === "select_method"
  ) {
    paymentsPaypal.hide();
    paymentsBitcoin.hide();
    paymentCreditCard.show();
  } else if (paymentSelection.val() === "paypal") {
    paymentCreditCard.hide();
    paymentsBitcoin.hide();
    paymentsPaypal.show();
  } else {
    paymentCreditCard.hide();
    paymentsPaypal.hide();
    paymentsBitcoin.show();
  }
});

/*
  ***********************
  Form Field Validators
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

function isValidCreditCard(number) {
  return /^\d{13,16}$/.test(number);
}

function isValidZip(number) {
  return /^\d{5}$/.test(number);
}

function isValidCvv(number) {
  return /^\d{3}$/.test(number);
}

/*
  ***********************
 Validation Styling
  ***********************
*/

function formAlert(isValid, elementInput = 0, elementLegend = 0) {
  if (elementInput !== 0) {
    errorFormatInput(elementInput, isValid);
  }
  if (elementLegend !== 0) {
    errorFormatLegend(elementLegend, isValid);
  }
}

function errorFormatInput(element, isValid) {
  if (isValid) {
    element.css("border", "solid #c1deeb 2px");
  } else {
    element.css("border", "solid red 2px");
  }
}

function errorFormatLegend(element, isValid) {
  if (isValid) {
    element.css("color", "#000");
    element.css("fontWeight", "400");
  } else {
    element.css("color", "red");
    element.css("fontWeight", "600");
  }
}

$('button[type="submit"').click(function(e) {
  e.preventDefault();

  formAlert(isValidName(nameField.val()), nameField, nameField.prev());
  formAlert(isValidEmail(emailField.val()), emailField, emailField.prev());
  formAlert(isValidActivities(activitiesCheckboxes), 0, activitiesLegend);
  if (paymentSelection.val() == "credit card") {
    formAlert(
      isValidCreditCard(paymentCardNumber.val()),
      paymentCardNumber,
      paymentCardNumber.prev()
    );
    formAlert(
      isValidZip(paymentZipCode.val()),
      paymentZipCode,
      paymentZipCode.prev()
    );
    formAlert(isValidCvv(paymentCvv.val()), paymentCvv, paymentCvv.prev());
  }
});
