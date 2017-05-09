// Declare the required module for the app
var mysql = require('mysql');
var inquirer = require('inquirer');
var prompt = require('prompt');

// create the connection information for the sql database
var connection = mysql.createConnection({
	database: "bamazon_DB",
	host: "localhost",
	user: "root",
	port: 3306,
	password: " "
});
// connect to the mysql server and sql database
connection.connect(function(err) {
	if (err) throw err;
	
});
console.log("------------------------------------------");
console.log("       WELCOME TO BAMAZON STORE");
console.log("-------------------------------------------");
// a function that will prompt the user to explore the store or not
var findStore = function() {
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
//After the user prompt to explore the following function query the database
	function exploreStore() {
		var query = "SELECT * FROM products";
		var items = [];

		connection.query(query, function(err, res) {
			if (err) throw err;
			console.log("success");
			for ( var i = 0 ; i <= res.length; i++){
				items.push(res[i]);

			};
			//lists all the products where the user be sble to select one
			console.log(items);
			inquirer.prompt([{
				name: "action",
				type: "list",
				choices: ["Blanket","Sofa","TV","Book","Pen", "Curtaine","iPhone7 +", "iPhone 7","Soda 12 Pack","Water 12 Pack"],
				message: "Which item would you be interested to make a purchase now?"

			}, {
				//the user will set the number of items he / she want for the selected product above
				name: "units",
				type: "input",
				message: "How many units of the product you would like to order?",
				// we will going to validate the user input inorder to order anything morethan zero(0)
				validate: function(answer) {
					if(answer > 0) {
						return true;
					}
				}
			}])
			/*once we have the user selection with quantity 
			the order will be processed if the user order 
			bellow or just the stock quantity we have*/
			.then(function(answer) {
				var queryResponse;
				var query = 'SELECT * FROM products WHERE ?'
				connection.query(query, {product_name: answer.action}, function(err, res) {
					if (err) throw err;
					queryResponse = res[0];

					if (queryResponse.stock_quantity < answer.units) {
						console.log("Insufficient Quantity!");
						connection.end();
					} 
					else {
						console.log('Order Placed!');
				/*The setTimeout function will excute and 
				display the result after 4 seconds.*/
						setTimeout(function() {
							var query = 'UPDATE products SET stock_quantity = ?  WHERE product_name = ?'
							var stock_quantity = queryResponse.stock_quantity - answer.units;
							connection.query(query, [stock_quantity, answer.product_name], function(err, res) {
								if (err) throw err;
								var totalCost = answer.units * queryResponse.price;
								console.log("---------------------------------------------------------------");
								console.log("Order Updated");
								console.log('Your total cost is ', '\nTotal cost: ' + totalCost);
								console.log("---------------------------------------------------------------");
								console.log("       Thanks for your order! Your satisfaction is Guaranted!    ");

							})
						}, 4000);
					}
				})
			})

		});
	};
};
/*after the purchase the store will be 
updated with the right quantity we have to sell*/
function updatedStore(totalCost, queryResponse) {
	connection.query('SELECT * FROM products', function(err, res) {
		if (err) throw err;
		res.forEach(function(products) {
			if (queryResponse.department_name === products.department_name) {
				var queryProducts = products.totalCost;
				var query = 'UPDATE department_name SET totalCost = ? WHERE department_name = ?'
				var totalCost = queryProducts + totalCost;
				connection.query(query, [totalCost, products.department_name], function(err, res) {
					if (err) throw err;
				})
				connection.query('SELECT * FROM department_name', function(err, res) {
					if(err) throw err;

				})
			}
		})
	})
}
findStore();
