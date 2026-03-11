// Website for browsing & selecting from my vinyl record collection
// This file contains all the functions related to Record objects
// Note: relies on RECORD_DEBUG variable from the main javascript.js file


// ------------------ //
//  HELPER FUNCTIONS  //
// ------------------ //

// Convert record to a printable string, which is also sent to the console
// Parameters: record - a Record object to convert to a string
// Returns:    a string representation of a record
function donationToString(donation)
{
  var donationString = "";

  if(donation !== undefined)
  {
    donationString = `Donator: ${donation.donator}
                    Amount: ${donation.amount}
                    Type: ${donation.type}
                    Message: ${donation.message}
                    Hair Type: ${donation.hairType}
                    Hair Length: ${donation.hairLength}
                    Hair Color: ${donation.hairColor}`;
  }
  else
  {
    donationString = "ERROR: Undefined Donation!"
  }

  if (DONATION_DEBUG) console.log(donationString);
  
  return donationString
}


// -------------------- //
//  CREATION FUNCTIONS  //
// -------------------- //

// Object representing a donation
// Parameters: donator    - string representing the name of the donator
//             amount     - float representing the amount of the donation
//             type       - string represnting the kind of donation (sub, bits, etc.)
//             message    - string representing the message attached to the donation
//             hairType   - string representing the hair type for this donation (hair/beard)
//             hairLength - string representing if it should be cut or not (longer/shorter)
//             hairColor  - string representing the desired color to dye it
class Donation {
  constructor(donator, amount, type, message, hairType, hairLength, hairColor) {
    this.donator = donator;
    this.amount = amount;
    this.type = type;
    this.message = message;
    this.hairType = hairType;
    this.hairLength = hairLength;
    this.hairColor = hairColor;
  }
}

// Create a donation object from input spreadsheet row
// Parameters: row - spreadsheet row to convert to a Donation object
// Returns:    a new Donation object
//
// Note: assumes the following row format:
//    Donator - Amount - Type - Message - X - X - X - Hair Type - Hair Length - Hair Color
function createDonation(row)
{
  // Fetch donator, amount, type, and message strings
  var curDonator = (row[0] === null) ? "" : row[0].v;
  var curAmount = (row[1] === null) ? "" : row[1].v;
  var curType = (row[2] === null) ? "" : row[2].v;
  var curMessage = (row[3] === null) ? "" : row[3].v;

  // Fetch hair-related strings
  var curHairType = (row[7] === null) ? "" : row[7].v;
  var curHairLength = (row[8] === null) ? "" : row[8].v;
  var curHairColor = (row[9] === null) ? "" : row[9].v;

  // Build and return a Record object
  return new Donation(curDonator, curAmount, curType, curMessage, curHairType, curHairLength, curHairColor);
}
