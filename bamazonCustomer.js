var mysql = require("mysql");
var inquirer = require("inquirer");
require("console.table");


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
      	buy();
      }else{
      	exit()
      }
    });
}

function postInventory(){
  inquirer
	.prompt({
		name:"inventory",
		type
	})
}

function buy(){

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
      		if(isNan(value) === false){
      			return true;
      		}
      		return false;
      	}
      }
    ])
    .then(function(answer) {
    	//Inserting data into the table based on answers provided
      connection.query(
        "INSERT INTO products SET ?",
        {
          product_name: answer.product,
          category: answer.category,
          price: answer.price,
          quantity: answer.quantity
        },
        function(err) {
          if (err) throw err;
          console.log("Your " + answer.product + "is now available for purchase!");
          start();
        }
      );
    });
}