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
      connection.query("SELECT * FROM products WHERE stock_quantity<5", function(err, res) {
            if (err) throw err;
            for (var i = 0; i < res.length; i++) {
                console.log(res[i])
            }
            connection.end()
      })
  }

  /////////////////////////////ADD TO INVENTORY ////////////////////////////////////////////////////////

  function addToInventory() {
      inquirer
        .prompt([
            {
                name: 'product',
                type: 'input',
                message: 'What item would you like to add inventory to?'
            },
            {
                name: 'amount',
                type: 'input',
                message: 'How many would you like to add to inventory?'
            }
        ])
        .then(function (answer) {
            // connection.query("SELECT stock_quantity FROM products WHERE product_name=?", [answer.product], function (err, res) {
                connection.query("UPDATE products SET stock_quantity= stock_quantity + ? WHERE product_name=?", [answer.amount, answer.product], function (err, res) {
                if (err) throw err
                console.log('You added ' + answer.amount + ' units to the item ' + answer.product)
                connection.end()
            })
        })
  }



  /////////////////////////////////ADD NEW PRODUCT/////////////////////////////////////////////////////

  function addNewProduct() {
      inquirer
        .prompt([
            {
                name: 'product',
                type: 'input',
                message: 'What product do you want to add to your inventory?'
            },
            {
                name: 'department',
                type: 'input',
                message: 'What department will your product be in?'
            },
            {
                name: 'price',
                type: 'input',
                message: 'What is the price of your product?'
            },
            {
                name: 'quantity',
                type: 'input',
                message: 'How many are you adding to your inventory?'
            }
        ])
        .then(function(answer) {
            connection.query("INSERT INTO products SET ?",
            {
                product_name: answer.product,
                department_name: answer.department,
                price: answer.price,
                stock_quantity: answer.quantity
            },
            function(err, res) {
                if (err) throw err
                console.log(answer.quantity + ' ' + answer.product + '\'s where added to the '  + answer.department + ' department.')
                connection.end()
            })
        })
  }