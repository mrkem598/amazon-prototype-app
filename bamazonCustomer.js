// Declare the required module for the app
var mysql = require('mysql');
var inquirer = require('inquirer');
var prompt = require('prompt');
var Promise = require('bluebird');
// create the connection information for the sql database
var connection = mysql.createConnection({
	database: "bamazon_DB",
	host: "localhost",
	user: "root",
	port: 3306,
	password: "root"
});
// connect to the mysql server and sql database
connection.connect(function(err) {
	if (err) throw err;
	//console.log("Connected as ID " + connection.threadID);
});

console.log("------WELCOME TO BAMAZON STORE-------");
// a function that will prompt the user to explore the store or no
var start = function() {
	inquirer.prompt({
		name: "exploreOrNot",
		message: "Would you like to [Explore] the store or [Not] to explore?",
		choices: ["Explore", "Not"]
		//based on the user answer
	}).then(function(answer) {
		//the user will explore the store or Exit(not)
		if (answer.exploreOrNot.toUpperCase() === "EXPLORE") {
			exploreStore();
		}
		//If not let go the user and close the app
		else{
			console.log("Thank you for reaching out but we would like to see you again to explore our store soon!");
		}
	});
		function exploreStore() {
			var query = "SELECT * FROM products";
			var products = [];

				connection.query(query, function(err, res) {
					if (err) throw err;
					console.log("success");
					for ( var i = 0 ; i <= res.length; i++){
						products.push(res[i].product_name);
						//console.log(res[i]);
					};
					console.log(products);
					/*inquirer.prompt({
				name: "action",
				type: "list",
				choices: ["Blanket","Sofa","TV","Book","Pen", "Curtaine","iPhone7 +", "iPhone 7","Soda 12 Pack","Water 12 Pack"],
				message: "Which item would you be interested to make a purchase now?"
			
			}).then(function(answer) {
				//console.log(answer.item);
			})
				*/	
				})
			/*inquirer.prompt({
				name: "action",
				type: "list",
				choices: ["Blanket","Sofa","TV","Book","Pen", "Curtaine","iPhone7 +", "iPhone 7","Soda 12 Pack","Water 12 Pack"],
				message: "Which item would you be interested to make a purchase now?"
			
			}).then(function(answer) {
				//console.log(answer.item);
			})*/
		}

};

start();
//connection.connect();