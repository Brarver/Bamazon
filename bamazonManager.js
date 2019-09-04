var inquirer = require('inquirer')
var mysql = require('mysql')

var connection = mysql.createConnection({
    host: "localhost",
  
    port: 3306,
  
    user: "root",
  
    password: "addison73",
    database: "bamazon"
  });

  connection.connect(function(err) {
    if (err) throw err;
    
    start()
  });

  /////////////////////////START FUNCTION////////////////////////////////////////////////////////

  function start() {
    inquirer
      .prompt({
        name: "menu",
        type: "list",
        message: "Please select an option below \n --------------------------------------",
        choices: ["VIEW PRODUCTS FOR SALE", "VIEW LOW INVENTORY", "ADD TO INVENTORY", "ADD NEW PRODUCT"]
      })
      .then(function(answer) {
        if (answer.menu === "VIEW PRODUCTS FOR SALE") {
          viewProducts();
        } else if (answer.menu === "VIEW LOW INVENTORY") {
          viewLowInventory();
        } else if (answer.menu === "ADD TO INVENTORY") {
          addToInventory()
        } else if (answer.menu === "ADD NEW PRODUCT") {
          addNewProduct()
        } else {
            connnection.end()
        }
      });
  }

  ////////////////////////////VIEW PRODUCTS//////////////////////////////////////////////////////////

  function viewProducts() {
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
          console.log(res[i].id + " | " + res[i].product_name + " | " + "$" + res[i].price);
        }
        console.log("-----------------------------------");
        connection.end()
      }); 
  }

  //////////////////////////// VIEW LOW INVENTORY ////////////////////////////////////////////////////

  function viewLowInventory() {
      connection.query("SELECT * FROM products WHERE stock_quantity=?", [5, 4, 3, 2, 1, 0] , function(err, res) {
            if (err) throw err;
            console.log(res[0])
            connection.end()
      })
  }

  ///////////config low inventory query