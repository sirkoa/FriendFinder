var mysql = require('mysql');

// Create connection (CHANGE TO YOUR CREDENTIALS)
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'friend_finder',
  port: 3306
});

// Initiate MySQL Connection.
connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
  console.log('connected as id ' + connection.threadId);
});

// ===============================================================================
// ROUTING
// ===============================================================================

module.exports = function(app) {
  // API GET Requests
  // Below code handles when users "visit" a page.
  // In each of the below cases when a user visits a link
  // (ex: localhost:PORT/api/admin... they are shown a JSON of the data in the table)
  // ---------------------------------------------------------------------------

  app.get('/api/tables', function(req, res) {
    connection.query('SELECT * FROM reservations', function(err, reservation) {
      if (err) throw err;

      res.json(reservation);
    });
  });

  app.get('/api/waitlist', function(req, res) {
    connection.query('SELECT * FROM waitinglist', function(err, waitlist) {
      if (err) throw err;

      res.json(waitlist);
    });
  });

// Creates Delete Route that passes in data from frontend (table & id specifically)
  app.delete('/api/delete/:table/:id', function(req, res) {

    // Grab table
    var queryTable = req.params.table;
    // Grab id of row to delete in table
    var reservationId = parseInt(req.params.id);

    // Delete from (queryTable) where (id = reservationId)
    connection.query('DELETE FROM ?? WHERE ?', 
    [
      // Pass in query table (in ??)
      queryTable,
      {
        // Pass in id
        id: reservationId
      }
    ], function(err) {
      if (err) throw err;

      console.log("It worked!");
      // Send back true to let them know it worked
      res.json(true);
    });
  });

  // API POST Requests
  // Below code handles when a user submits a form and thus submits data to the server.
  // In each of the below cases, when a user submits form data (a JSON object)
  // ...the JSON is pushed to the appropriate JavaScript array
  // (ex. User fills out a reservation request... this data is then sent to the server...
  // Then the server saves the data to the tableData array)
  // ---------------------------------------------------------------------------

  app.post('/api/newfriend', function(req, res) {
    // Note the code here. Our "server" will respond to requests and let users know if they have a table or not.
    // It will do this by sending out the value "true" have a table
    // req.body is available since we're using the body-parser middleware
    var newfriend = req.body;

    

    // Query current reservations
    connection.query('SELECT * FROM reservations', function(err, reservation) {
      if (err) throw err;
      
      // if there are less than 5 current reservations, add into reservations
      if (reservation.length < 5) {
        connection.query("INSERT INTO reservations SET ?", reservationData, function(error) {
          if (error) throw error;
          console.log("Reservation made!");

          res.json(true);
        });
      }
      // if there are 5+ reservations, add new reservation to waiting list 
      else {
        connection.query("INSERT INTO waitinglist SET ?", reservationData, function(error) {
          if (error) throw error;
          console.log("No more reservations, you've been added to the waiting list!");
          res.redirect(false);
        });
      }
    });
  });

  // ---------------------------------------------------------------------------
  // I added this below code so you could clear out the table while working with the functionality.
  // Don"t worry about it!

  app.post('/api/clear', function() {
    // Empty out the arrays of data
    tableData = [];
    waitListData = [];

    console.log(tableData);
  });
};