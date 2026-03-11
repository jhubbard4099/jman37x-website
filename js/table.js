// Website for browsing & selecting from my vinyl record collection
// This file contains all the functions related to building the HTML table
// Note: relies on TABLE_DEBUG variable from the main javascript.js file


// ---------------- //
//  MAIN FUNCTIONS  //
// ---------------- //

// Opens an HTML table, builds headers, and opens the body
// Returns: HTML representing the header rows of the table
function beginDonationTable()
{
  // Initialize
  var tableHTML = "<table>"

  // 1st header: section labels
  // tableHTML += `<tr>
  //                   <th colspan="10">DONATION</th>
  //                   <th colspan="3">DATA</th>
  //                </tr>`;

  // 2nd header: donation info
  tableHTML += `<thead>`;
  tableHTML += `<tr>
                  <th colspan="2">Donator</th>
                  <th colspan="1">Amount</th>
                  <th colspan="2">Type</th>
                  <th colspan="5">Message</th>
                </tr>`;
  
  // tableHTML += `<tr>
  //                 <th colspan="2">Donator</th>
  //                 <th colspan="1">Amount</th>
  //                 <th colspan="1">Type</th>
  //                 <th colspan="5">Message</th>
  //                 <th colspan="1">Hair Type</th>
  //                 <th colspan="1">Hair Length</th>
  //                 <th colspan="1">Hair Color</th>
  //               </tr>`;

  // Open table body
  tableHTML += `</thead>
                 <tbody>`;

  return tableHTML;
}

// Converts a donation to HTML to be added to the full table
// Parameters: donation - donation object to convert
function donationToTable(donation)
{
  if (TABLE_DEBUG) donationToString(donation);

  var donationHTML = `<tr class='tblBody'>`;
  if(donation !== undefined)
  {
    // Add current record to the table
    donationHTML += `<td colspan="2">${donation.donator}</td>
                    <td colspan="1">$${donation.amount}</td>
                    <td colspan="2">${donation.type}</td>
                    <td colspan="5">${donation.message}</td>`;

    // donationHTML += `<td colspan="2">${donation.donator}</td>
    //                 <td colspan="1">$${donation.amount}</td>
    //                 <td colspan="1">${donation.type}</td>
    //                 <td colspan="5">${donation.message}</td>
    //                 <td colspan="1">${donation.hairType}</td>
    //                 <td colspan="1">${donation.hairLength}</td>
    //                 <td colspan="1">${donation.hairColor}</td>`;
  }
  donationHTML += "</tr>";

  return donationHTML;
}

// Closes an HTML table's body and the main table
function endDonationTable()
{
  // Close table body
  tableHTML = `</tbody>
                </table>`;
  
  return tableHTML;
}
