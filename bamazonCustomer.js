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
    
    displayItems()
  });


////////////////////DISPLAY ITEMS////////////////////////////////////////////////////////////////////

  function displayItems() {
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
          console.log(res[i].id + " | " + res[i].product_name + " | " + "$" + res[i].price);
        }
        console.log("-----------------------------------");
        purchaseItem()
      }); 
  }

/////////////////////////////////PURCHASE ITEM//////////////////////////////////////////////////////////

  function purchaseItem() {
      inquirer
        .prompt([
            {
                name: "id",
                type: "input",
                message: "What is the ID of the item you would like to buy?"
            },
            {
                name: "quantity",
                type: "input",
                message: "How many would you like to buy?",
                validate: function(value) {
                    if (isNaN(value) === false) {
                      return true;
                    }
                    return false;
                  }
            }
        ])
        .then(function (answer) {
            connection.query("SELECT * FROM products WHERE id=?", [answer.id], function(err, res) {
                if (err) throw err;
                var amountLeft = res[0].stock_quantity

                if (res[0].stock_quantity > answer.quantity) {
                    amountLeft -= answer.quantity
                    connection.query(
                        "UPDATE products SET ? WHERE ?",
                        [
                          {
                            stock_quantity: amountLeft
                          },
                          {
                            id: answer.id
                          }
                        ],
                        function(error) {
                          if (error) throw err;
                          var total = answer.quantity * res[0].price
                          displayCost(answer.quantity, res[0].price)
                          addToSales(answer.id, total)

                        }
                      );
                } else {
                    displayItems()
                    console.log('Insufficient amount in inventory. Please try a different order.')
                }
            })
        })
  }

  ////////////////////////////DISPLAY TOTAL COST////////////////////////////////////////////////////////

  function displayCost(quantity, price) {
      console.log('Your order has been fufilled! Your total cost is $' + (quantity * price))
  
  }

  //////////////////////////// ADD TO PRODUCT SALES //////////////////////////////////////////////////////

  function addToSales(id, total) {
        
        connection.query("UPDATE products SET product_sales = IFNULL(product_sales, 0) + ? WHERE id=?", [total, id], function(err, res) {
                  if (err) throw err
                  connection.end()

        })
  }