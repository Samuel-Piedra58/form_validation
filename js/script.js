/*
    Adding Form Validation and Interactivity with Javascript/jQuery
    Developer: Samuel Piedra
    Date Started: 05/26/2019
    Last Modiefied: 06/16/2019
*/
// Get Form Elements -- Global Variables
const nameInput = $("#name");
const emailInput = $("#mail");
const jobRoleSelection = $("#title");
const otherJobRoleInput = $("#other-title");
const tShirtDesignSelection = $("#design");
const tShirtColorSelection = $("#color");
const registerForActivitiesFieldset = $("fieldset.activities");
const registerForActivitiesLegend = $("fieldset.activities legend");
const registerForActivitiesCheckboxes = $(
  'fieldset.activities input[type="checkbox"]'
);
const paymentFieldset = $("form fieldset:nth-child(4)");
const paymentSelection = $("#payment");
const paymentCreditCardDiv = $("#credit-card");
const paymentPaypalDiv = paymentFieldset.find("div").eq(4);
const paymentBitcoinDiv = paymentFieldset.find("div").eq(5);
const paymentCardNumberInput = $("#cc-num");
const paymentZipCodeInput = $("#zip");
const paymentCvvInput = $("#cvv");
let isCostParagraphDisplayed = false;

// Force Reset of Fields - Executed @ end of script
function resetForm() {
  nameInput.focus();
  otherJobRoleInput.hide();
  jobRoleSelection.val("full-stack js developer");
  tShirtDesignSelection.val("default");
  hideShirtColorSelection();
  paymentPaypalDiv.hide();
  paymentBitcoinDiv.hide();
  paymentCreditCardDiv.show();
}

/*
 *********************************************
 ***Job Role Input Section
 *********************************************
 */
jobRoleSelection.change(function() {
  if ($(this).val() === "other") {
    otherJobRoleInput.show();
  } else {
    otherJobRoleInput.hide();
  }
});

/*
 *********************************************
 ***T-Shirt Info Section
 *********************************************
 */
tShirtDesignSelection.change(function() {
  $("#color option").each(function() {
    filterColorOption($(this));
  });
  setDefaultShirtColorOption();
  showShirtColorSelection();
});

function filterColorOption(color) {
  const regex = /JS Puns shirt only/;
  if (tShirtDesignSelection.val() === "js puns") {
    regex.test(color.text()) ? color.show() : color.hide();
  } else {
    regex.test(color.text()) ? color.hide() : color.show();
  }
}

function setDefaultShirtColorOption() {
  if (tShirtDesignSelection.val() === "js puns") {
    tShirtColorSelection.val("cornflowerblue");
  } else {
    tShirtColorSelection.val("tomato");
  }
}

function showShirtColorSelection() {
  tShirtColorSelection.show();
  tShirtColorSelection.prev().text("Color:");
}

function hideShirtColorSelection() {
  tShirtColorSelection.hide();
  tShirtColorSelection.prev().text("Please select a T-shirt theme");
}

/*
 *********************************************
 ***Register for Activities Section
 *********************************************
 */

registerForActivitiesFieldset.on("change", 'input[type="checkbox"]', function(
  event
) {
  const changedActivityLabelText = event.target.parentNode.textContent;
  const changedActivity = createActivityObject(changedActivityLabelText);
  const changedActivity_isChecked = $(this).prop("checked");
  let totalCost = 0;

  registerForActivitiesCheckboxes.each(function() {
    const otherActivityCheckbox = $(this);
    const otherActivityLabel = $(this).parent();
    const otherActivityLabelText = otherActivityLabel.text();
    const otherActivity = createActivityObject(otherActivityLabelText);
    const otherActivity_isChecked = otherActivityCheckbox.prop("checked");
    const labelsMatch = activityLabelsMatch(
      otherActivityLabelText,
      changedActivityLabelText
    );
    const timesOverlap = activityTimesOverlap(otherActivity, changedActivity);

    if (!labelsMatch && timesOverlap && changedActivity_isChecked) {
      disableActivityCheckbox(otherActivityLabel, otherActivityCheckbox);
    } else {
      enableActivityCheckbox(otherActivityLabel, otherActivityCheckbox);
    }

    if (otherActivity_isChecked) {
      totalCost += otherActivity.cost;
    }
  });

  if (totalCost > 0) {
    if (!isCostParagraphDisplayed) {
      addCostInfoAddCostParagraph(totalCost);
    } else {
      updateCostInfo(totalCost);
    }
  } else {
    removeCostInfoRemoveCostParagraph();
  }
});

function createActivityObject(activityText) {
  const event_regex = /^(\D*)\s+?—\s+?(\r\n|\r|\n)?(Tuesday|Wednesday)?\s*?(\r\n|\r|\n)?(\d\d?)?(am|pm)?-?(\d\d?)?(am|pm)?,?\s*?\$(\d{3})$/;

  function replaceText(regexGroup) {
    return activityText
      .replace(event_regex, regexGroup)
      .trim()
      .toLowerCase();
  }

  const conferenceActivity = {
    title: replaceText("$1"),
    day: replaceText("$3"),
    start_time: parseInt(replaceText("$5")),
    start_ampm: replaceText("$6"),
    end_time: parseInt(replaceText("$7")),
    end_ampm: replaceText("$8"),
    cost: parseInt(replaceText("$9"))
  };

  function normalizeActivityTimes(activity) {
    if (activity.start_time != "12" && activity.start_ampm === "pm") {
      activity.start_time += 12;
    }
    if (activity.end_time != "12" && activity.end_ampm === "pm") {
      activity.end_time += 12;
    }
    return activity;
  }

  return normalizeActivityTimes(conferenceActivity);
}

function activityLabelsMatch(labelA, labelB) {
  if (labelA === labelB) {
    return true;
  }
}
function activityTimesOverlap(a, b) {
  if (
    a.day === b.day &&
    ((b.start_time <= a.start_time && a.start_time <= b.end_time) ||
      (b.start_time <= a.end_time && a.end_time <= b.end_time))
  ) {
    return true;
  }
}

function disableActivityCheckbox(label, checkbox) {
  label.css("color", "grey");
  checkbox.prop("disabled", true);
}

function enableActivityCheckbox(label, checkbox) {
  label.css("color", "#000");
  checkbox.prop("disabled", false);
}

function createParagraph() {
  return $(document.createElement("p"));
}

function getParagraphFromActivitiesFieldset() {
  return registerForActivitiesFieldset.find("p");
}

function appendParagraphToActivitiesFieldset() {
  const paragraphToAppend = createParagraph();
  registerForActivitiesFieldset.append(paragraphToAppend);
  return getParagraphFromActivitiesFieldset();
}

function removeParagraphFromActivitiesFieldset() {
  const paragraph = getParagraphFromActivitiesFieldset();
  paragraph.remove();
}

function addCostInfoAddCostParagraph(cost) {
  const costInfo = `Total Cost: $${cost}`;
  const costParagraph = appendParagraphToActivitiesFieldset();
  costParagraph.text(costInfo);
  isCostParagraphDisplayed = true;
}

function updateCostInfo(cost) {
  const costInfo = `Total Cost: $${cost}`;
  const costParagraph = getParagraphFromActivitiesFieldset();
  costParagraph.text(costInfo);
}

function removeCostInfoRemoveCostParagraph() {
  removeParagraphFromActivitiesFieldset();
  isCostParagraphDisplayed = false;
}

/*
 *********************************************
 ***Payment Info Section
 *********************************************
 */
paymentSelection.change(function() {
  const payChoice = $(this).val();
  if (payChoice === "credit card") {
    togglePayment(paymentCreditCardDiv, paymentPaypalDiv, paymentBitcoinDiv);
  } else if (payChoice === "paypal") {
    togglePayment(paymentPaypalDiv, paymentCreditCardDiv, paymentBitcoinDiv);
    clearCreditCardData();
  } else {
    togglePayment(paymentBitcoinDiv, paymentCreditCardDiv, paymentPaypalDiv);
    clearCreditCardData();
  }
});

function togglePayment(sPayment, hPayment1, hPayment2) {
  sPayment.show();
  hPayment1.hide();
  hPayment2.hide();
}

function clearCreditCardData() {
  clearFormInput(paymentCardNumberInput);
  clearFormInput(paymentZipCodeInput);
  clearFormInput(paymentCvvInput);
}
function clearFormInput(targetElement) {
  targetElement.val("");
  toggleErrBorder(targetElement, true);
  toggleErrLabel(targetElement.prev(), true);
}

/*
 *********************************************
 ***Form Validators Section
 *********************************************
 */
function isValidName(name) {
  return /\w+/.test(name);
}

function isValidEmail(email) {
  return /^[^@]+@[^@.]+\.[a-z]+$/i.test(email);
}

function isValidActivities(registerForActivitiesCheckboxes) {
  let valid = false;
  registerForActivitiesCheckboxes.each(function() {
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
function toggleErrBorder(element, isValid) {
  isValid ? element.removeClass("err-border") : element.addClass("err-border");
}

function toggleErrLabel(element, isValid) {
  isValid ? element.removeClass("err-label") : element.addClass("err-label");
}

/*
 *********************************************
 ***Adding Event Listeners
 *********************************************
 */

nameInput.on("input focusout", createHandler(isValidName));

emailInput.on("input focusout", createHandler(isValidEmail));

paymentCardNumberInput.on("input focusout", createHandler(isValidCreditCard));

paymentZipCodeInput.on("input focusout", createHandler(isValidZip));

paymentCvvInput.on("input focusout", createHandler(isValidCvv));

registerForActivitiesFieldset.on("change", function() {
  const valid = isValidActivities(registerForActivitiesCheckboxes);
  toggleErrLabel(registerForActivitiesLegend, valid);
});

function createHandler(validator) {
  return function() {
    const text = $(this).val();
    const valid = validator(text);
    toggleErrBorder($(this), valid);
    toggleErrLabel($(this).prev(), valid);
  };
}

function isFormValid() {
  if (
    !isValidName(nameInput.val()) ||
    !isValidEmail(emailInput.val()) ||
    !isValidActivities(registerForActivitiesCheckboxes) ||
    (paymentSelection.val() === "credit card" &&
      (!isValidCreditCard(paymentCardNumberInput.val()) ||
        !isValidZip(paymentZipCodeInput.val()) ||
        !isValidCvv(paymentCvvInput.val())))
  ) {
    return false;
  }
  return true;
}

function triggerEventsHandlers() {
  nameInput.trigger("input");
  emailInput.trigger("input");
  paymentCardNumberInput.trigger("input");
  paymentZipCodeInput.trigger("input");
  paymentCvvInput.trigger("input");
  registerForActivitiesFieldset.trigger("change");
}

$("form").on("submit", function(event) {
  const validationSuccess = isFormValid();
  triggerEventsHandlers();
  if (!validationSuccess) {
    event.preventDefault();
  }
});

resetForm();
