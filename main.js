function doGet(e) {
  var action = e.parameter.action;

  if (action == "get") {
    return getQuantity(e);
  } else if (action == "edit") {
    return editQuantity(e);
  } else {
    return ContentService.createTextOutput("Unknown action");
  }
}

function getQuantity(e) {
  var id = e.parameter.id;

  if (!id) {
    return ContentService.createTextOutput("Please provide 'id' parameter");
  }

  var spreadsheet = SpreadsheetApp.openById("1V_atHkeoGnpbx6TjyTHaqHieoSrONE3iiEhUXi_UIYY");
  var sheet = spreadsheet.getSheetByName("Sheet");

  var dataRange = sheet.getDataRange();
  var values = dataRange.getValues();

  for (var i = 1; i < values.length; i++) {
    if (values[i][0] == id) {
      var quantity = values[i][1];
      return ContentService.createTextOutput("Quantity for ID " + id + ": " + quantity);
    }
  }

  return ContentService.createTextOutput("ID not found");
}

function editQuantity(e) {
  try {
    var id = e.parameter.id;
    var amount = e.parameter.amount;

    if (!id || !amount) {
      return ContentService.createTextOutput("Please provide 'id' and 'amount' parameters");
    }

    var spreadsheet = SpreadsheetApp.openById("1V_atHkeoGnpbx6TjyTHaqHieoSrONE3iiEhUXi_UIYY");
    var sheet = spreadsheet.getSheetByName("Sheet");

    var dataRange = sheet.getDataRange();
    var values = dataRange.getValues();

    for (var i = 1; i < values.length; i++) {
      if (values[i][0] == id) {
        var currentQuantity = values[i][1];

        // Ensure the subtraction does not result in a negative quantity
        if (currentQuantity >= amount) {
          var newQuantity = parseInt(currentQuantity) - parseInt(amount);

          // Update the quantity in the sheet
          sheet.getRange(i + 1, 2).setValue(newQuantity);

          return ContentService.createTextOutput("Quantity for ID " + id + " updated to: " + newQuantity);
        } else {
          return ContentService.createTextOutput("Cannot subtract " + amount + " from ID " + id + ". Insufficient quantity.");
        }
      }
    }

    return ContentService.createTextOutput("ID not found");
  } catch (error) {
    return ContentService.createTextOutput("Error: " + error.message);
  }
}
