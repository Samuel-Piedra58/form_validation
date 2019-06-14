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
const registerButton = $('button[type="submit"');
let totalCalculated = false;

// Force Reset of Fields - Executed @ end of script
function resetForm() {
  nameField.focus();
  otherJobField.hide();
  jobField.val("full-stack js developer");
  tShirtDesignField.val("default");
  toggleColorDropDown(true);
  paymentsPaypal.hide();
  paymentsBitcoin.hide();
  paymentCreditCard.show();
}

// Show or hide "Other Job Field"
jobField.change(function() {
  const selectedTitle = $("#title option:selected");
  selectedTitle.val() === "other" ? otherJobField.show() : otherJobField.hide();
});

/*
  ************************
  T-Shirt Info Section
  ************************
*/
// Toggle T-Shirt Options, pending the user's selection of the Design
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
  toggleColorDropDown(false);
});

// Toggle the display of "Color:" dropdown"
function toggleColorDropDown(isHidden) {
  if (isHidden) {
    colorDropDown.hide();
    colorDropDown.prev().text("Please select a T-shirt theme");
  } else {
    colorDropDown.show();
    colorDropDown.prev().text("Color:");
  }
}

/*
  ************************
  Register for Activities Section
  ************************
*/

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

// Function will intake the string of the label of the checkbox and parse the information to return an event object
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

// Function will convert the event start/event end times to a 24 hour time
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

/*
  ************************
  Payment Info Section
  ************************
*/

paymentSelection.change(function() {
  const payChoice = $(this).val();
  if (payChoice === "credit card") {
    togglePayment(paymentCreditCard, paymentsPaypal, paymentsBitcoin);
  } else if (payChoice === "paypal") {
    togglePayment(paymentsPaypal, paymentCreditCard, paymentsBitcoin);
  } else {
    togglePayment(paymentsBitcoin, paymentCreditCard, paymentsPaypal);
  }
});

function togglePayment(sPayment, hPayment1, hPayment2) {
  sPayment.show();
  hPayment1.hide();
  hPayment2.hide();
}

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
  - Class styling added under "Helper Classes"
  ***********************
*/

function valBorder(element, isValid) {
  isValid ? element.removeClass("err-border") : element.addClass("err-border");
}

function valText(element, isValid) {
  isValid ? element.removeClass("err-label") : element.addClass("err-label");
}

/*
  ***********************
  Add Event Listeners Event
  ***********************
*/

const runListeners = function() {
  nameField.on("input focusout", createHandler(isValidName));

  emailField.on("input focusout", createHandler(isValidEmail));

  if (paymentSelection.val() === "credit card") {
    paymentCardNumber.on("input focusout", createHandler(isValidCreditCard));
  }

  paymentZipCode.on("input focusout", createHandler(isValidZip));

  paymentCvv.on("input focusout", createHandler(isValidCvv));

  activitiesField.on("change", function() {
    activitiesCheckboxes;
    const valid = isValidActivities(activitiesCheckboxes);
    valText(activitiesLegend, valid);
  });

  function createHandler(validator) {
    return function() {
      const text = $(this).val();
      const valid = validator(text);
      valBorder($(this), valid);
      valText($(this).prev(), valid);
    };
  }
};

resetForm();
runListeners();
