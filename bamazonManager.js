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
        message: "Please select an option below",
        choices: ["VIEW PRODUCTS FOR SALE", "VIEW LOW INVENTORY", "ADD TO INVENTORY", "ADD NEW PRODUCT", "EXIT"]
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
        } else if (answer.menu === "EXIT") {
            connection.end()
        }
      });
  }

  ////////////////////////////VIEW PRODUCTS//////////////////////////////////////////////////////////

  function viewProducts() {
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
          console.log(res[i].id + " | " + res[i].product_name + " | " + "$" + res[i].price + " | " + res[i].stock_quantity + " left");
        }
        console.log("-----------------------------------");
        start()
      }); 
  }

  //////////////////////////// VIEW LOW INVENTORY ////////////////////////////////////////////////////

  function viewLowInventory() {
      connection.query("SELECT * FROM products WHERE stock_quantity<5", function(err, res) {
            if (err) throw err;
            console.log('-----------------------------------------')
            for (var i = 0; i < res.length; i++) {
                
                console.log("id: " + res[i].id + " | " + res[i].product_name + " | " + res[i].stock_quantity + " left")
                
            }
            console.log('-----------------------------------------')
            start()
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
                console.log('-----------------------------------------')
                console.log('You added ' + answer.amount + ' units to the item ' + answer.product)
                console.log('-----------------------------------------')
                start()
            })
        })
  }



  /////////////////////////////////ADD NEW PRODUCT/////////////////////////////////////////////////////

  function addNewProduct() {
    var departments = []
    connection.query("SELECT department_name FROM products GROUP BY department_name", function (err, res) {
      for (var i = 0; i < res.length; i++) {
        var obj = res[i]
        var key = Object.keys(obj)[0]
        var value = obj[key]
        departments.push(value)
      }
    })
      inquirer
        .prompt([
            {
                name: 'product',
                type: 'input',
                message: 'What product do you want to add to your inventory?'
            },
            {
                name: 'department',
                type: 'list',
                message: 'Please select which department this product will be in',
                choices: departments
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
                console.log('-----------------------------------------')
                console.log(answer.quantity + ' ' + answer.product + ' where added to the '  + answer.department + ' department.')
                console.log('-----------------------------------------')
                start()
            })
        })
  }