var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");

var table = new Table({
    head: ['ID', 'Product', 'Dept', 'Price', 'Qty'],
    colWidths: [7, 40, 30, 10, 10]
});

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

	connection.query("SELECT * FROM products", function(err, res){
		if(err) throw err;
		for(var i = 0; i < res.length; i++){
			table.push([res[i].id, res[i].product_name, res[i].category, '$' + res[i].price, res[i].stock_quantity]);
		};

		console.log(table.res);
		start();
	})

}

function buyItem(){
	 inquirer.prompt([
        {
            name: "purchase",
            message: "Which product would you like to purchase?",
            type: "input",
            validate: function(input){
                var check = input.replace(/\D/g, "");
                if (!input || parseInt(input) > items.length || check === "") {
                    return false
                } else {
                    return true
                }
            }
        },
        {
            name: "quantity",
            message: "How many would you like?",
            type: "input",
            validate: function(input){
                var check = input.replace(/\D/g, "");
                if (!input || check === "") {
                    return false
                } else {
                    return true
                }
            }
        }
    ]).then(function(response) {
        // checks to see if the value the customer wants is in stock
        var chosenItem = response.purchase -1;
        var amount = parseInt(response.quantity)
        var item = items[chosenItem];

        if (parseInt(amount) > item.stock_quantity) {
            console.log("Insufficient inventory in stock, please select a smaller quantity.");
            letsShop(items)
        } else {
            console.log("Your total is: " + item.price * response.quantity)
            connection.query("UPDATE products SET stock_quantity = ? WHERE id = ?", [parseInt(item.stock_quantity) - parseInt(response.quantity), item.id], function(err) {
                if (err) throw err;
            })
            // Redirects the user to try again
            inquirer.prompt([
                {
                    name: "again",
                    message: "Would you like to buy something else?",
                    type: "confirm",
                    default:false
                }
            ]).then(function(response) {
                switch(response.again){
                    case true:
                        buyItem()
                    break;
                    case false:
                    	exit();
                }
            })
        }
    })
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