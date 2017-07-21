var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");

// var table = new Table({
//     head: ['ID', 'Product', 'Dept', 'Price', 'Qty'],
//     colWidths: [7, 40, 30, 10, 10]
// });

// Creating the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "inventory_db"
});

connection.connect(function(err) {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
  start();
});

// function which prompts the user for what action they should take
function start() {
  inquirer
    .prompt({
      name: "select",
      type: "list",
      message: "What would you like to do?",
      choices: ["Check current inventory", "Buy something", "Place item up for sale", "Exit"]
    })
    .then(function(answer) {
      // based on their answer, either call the bid or the post functions
      if (answer.select.toUpperCase() === "CHECK CURRENT INVENTORY") {
        postInventory();
      }else if(answer.select.toUpperCase() === "PLACE ITEM UP FOR SALE") {
        sell();
      }else if(answer.select.toUpperCase() === "BUY SOMETHING"){
      	buyItem();
      }else{
      	exit()
      }
    });
}

function postInventory(){

	connection.query('SELECT * FROM products', function(err, res) {
    var table = new Table({
      head: ['Item ID', 'Product', 'Department', 'Price', 'Stock Qty'],
      colWidths: [10, 35, 30, 10, 12]
    });

    for (var i = 0; i < res.length; i++) {
      table.push(
        [res[i].id, res[i].product_name, res[i].category,
        res[i].price, res[i].stock_quantity]);
    }

    console.log(table.toString());
    start();
  });

}

function buyItem(){
	   inquirer.prompt([
    { 
		type: 'input', //default type is input if type left out
		message: 'Which product would you like to purchase? [ID]',
		name: 'productID'
    },
    { 
		type: 'input', //default type is input if type left out
		message: 'How many would you like to purchase?',
		name: 'quantityToBuy'
    }
	]).then(function(answer) {
    var query = "SELECT * FROM products WHERE ?";
    connection.query(query, { id: answer.productID }, function(err, res) {
      if (err) throw err;

      if (parseInt(answer.quantityToBuy) > res[0].stock_quantity) {
        console.log('Insufficient quantity, please select fewer');
        buyItem();
      }
      else {
        var itemTable = new Table({
          head: ['Item ID', 'Product', 'Department', 'Price', 'Stock Qty'],
          colWidths: [10, 35, 30, 10, 12]
        });

        connection.query(
          "UPDATE products SET ? WHERE ?",
          [
            {
              stock_quantity: res[0].stock_quantity - parseInt(answer.quantityToBuy)
            },
            {
              id: answer.productID
            }
          ],
          function(error) {
            if (error) throw error;
            var totalCost = answer.quantityToBuy * res[0].price;

            console.log("Item purchased successfully!");
            connection.query(query, { id: answer.productID }, function(err, res) {
              if (err) throw err;
              itemTable.push(
              [res[0].id, res[0].product_name, res[0].category,
              res[0].price, res[0].stock_quantity]);

              console.log(itemTable.toString());
              console.log('Your total comes out to be $' + totalCost.toString() +
                '\nThank you for shopping with us!')
              start();
            });
          }
        );
      }      
    });
  });
}

function sell(){
	inquirer
    .prompt([
      {
        name: "product",
        type: "input",
        message: "What is the item you would like to sell?"
      },
      {
        name: "category",
        type: "input",
        message: "What category would you like to place your item in?"
      },
      {
        name: "price",
        type: "input",
        message: "How much does this product cost?",
        validate: function(value) {
          if (isNaN(value) === false){
            return true;
          }
          return false;
        }
      },
      {
      	name: "quantity",
      	type: "input",
      	message: "How many would you like to sell?",
      	validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      }
    ])
    .then(function(answer) {
    	console.log(answer.quantity);
    	//Inserting data into the table based on answers provided
      connection.query(
        "INSERT INTO products SET ?",
        {
          product_name: answer.product,
          category: answer.category,
          price: answer.price,
          stock_quantity: answer.quantity
        },
        function(err) {
          if (err) throw err;
          console.log("Your " + answer.product + " is now available for purchase!");
          start();
        }
      );
    });
}
function exit(){
	console.log("Come back soon!")
	process.exit(0);

}