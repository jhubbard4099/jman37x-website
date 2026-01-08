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
                    Message: ${donation.message}`;
  }
  else
  {
    donationString = "ERROR: Undefined Donation!"
  }

  if (RECORD_DEBUG) console.log(donationString);
  
  return donationString
}


// -------------------- //
//  CREATION FUNCTIONS  //
// -------------------- //

// Object representing a vinyl record
// Parameters: donator  - string representing the name of the donator
//             amount   - float representing the amount of the donation
//             message  - string representing the message attached to the donation
class Donation {
  constructor(donator, amount, message) {
    this.donator = donator;
    this.amount = amount;
    this.message = message;
  }
}

// Create a donation object from input spreadsheet row
// Parameters: row - spreadsheet row to convert to a Donation object
// Returns:    a new Donation object
//
// Note: assumes the following row format:
//    Donator - Amount - Message
function createDonation(row)
{
  // Fetch album, artist, and location strings
  var curDonator = row[0].v;
  var curAmount = row[1].v;
  var curMessage = row[2].v;

  // Build and return a Record object
  return new Record(curDonator, curAmount, curMessage);
}
