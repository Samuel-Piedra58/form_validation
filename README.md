# Form Validation Project

This project is the Unit 03 Project of the Treehouse Full Stack Javascript Techdegree.

The javascript file adds form validation and interactivity to the various inputs throughout
the form found in index.html. The code provides real-time notifications (through color changes) on the validity of
input as the user is entering data.

If the user attempts to submit the form without inputting valid data into the available fields
the user is notified with each invalid input element changing color and background color (where applicable).Also, for any invalid input submission the user is notified with an error message box detailing the issue. Once the user successfully enters valid data into each available input field, the form may be submitted.

## Form validation criteria:
    
   (1) Name: The user must input a string at least one character long. If the user fails to enter a single character string the user is notified by the input element recieving a red-border with a red background color along with the input label turning red.
    
   (2) Email: The user must input a valid email matching a given regular expression. If the user fails to enter a valid email the user is notified by the input element recieving a red-border with a red background color along with the input label turning red.
    
   (3) Register for Activities: The user must select at least one activity from the available options. The user is not allowed to select multiple activities that occur during the same day and at the same time. If the user fails to select at least one activity checkbox the legend of the "Register for Activites" fieldset will be colored red. If the user selects an activity for which there is another activity or set of activities that occur during the same day and time those alternative activities are disabled and the user is unable to select those alternative options until the initial activity is unchecked.
    
   (4) Payment Info: This form validation is only applicable if the user selects the "Credit Card" option from the "I'm going to pay with:" select drop down. The user must enter a valid card number 13-16 digits in length, a valid zip code 5 digits in length and a valid cvv 3 digits in length. If the user fails to enter data correctly into any of these input elements the user is notified by the each input element recieving a red-border with a red background color along with the input label turning red.


## Additional Form Interactivity:
   
   (1) Job Role: The user will be able to select a job role from the "Job Role" select drop down. If the user selects "Other" an input element will appear below the drop down for the user to enter their "Other" job role.
    
   (2) T-Shirt Info: The user will be able to select one of two availble t-shirt designs, whereby once a design is selected a color dropdown will display right of the t-shirt design selection. The availble color options are filtered dependent on the user's t-shirt design selection.
    
   (3) Register for Activities: When the user selects an activity from the "Register for Activities" section a "Total Cost: $$" value will appear below the last checkbox and will update real-time as the user makes changes/updates to their selected activities.
    
   (4) Payment Info: When the user selects a payment option the applicable payment option will display in the form and provide additional information to the user. On page load, the credit card payment option is the defualt option. 
    
    
    
