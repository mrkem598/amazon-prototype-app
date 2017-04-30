// displaying all the items that the customer can buy which are available in products table
function getResponse() {

	return new Promise(function(resolve, reject) {
		connection.query('SELECT * FROM products', function(err, res) {
			console.log('--------------------------------------------------------------------')
			console.table(res);
				console.log('--------------------------------------------------------------------')
				resolve();
				if( err ) {
					reject( err );
				}
		});
	});
}


// prompts for the user get the order placed and once the order is placed it would be updated in the products table for the manager
// to see the remaining stock quantity in the inventory. Set timeout displaying the message that the order is placed and table is updated.
function processUserOrder() {

	inquirer.prompt([{
		name: 'itemID',
		type: 'input',
		message: 'ID of the product you would like to buy.'
	}, {
		name: 'units',
		type: 'input',
		message: 'how many units of the product you would like to buy.',
		validate: function(answer) {
			if(answer > 0 ) {
				return true;
			}
		}
	}]).then(function(answer) {
		var queryResponse;
		var query = 'SELECT * FROM products WHERE ?'

		connection.query(query, {ItemID: answer.itemID}, function(err, res) {
			if (err) throw err;
			queryResponse = res[0];

			if (queryResponse.StockQuantity < answer.units) {
				console.log('Insufficient quantity!');
				connection.end();

			} else {

				console.log('Order placed');

				setTimeout(function() {
					var query = 'UPDATE products SET StockQuantity = ? WHERE ItemID = ?'
					var stockQuantity = queryResponse.StockQuantity - answer.units;
					connection.query(query, [stockQuantity, answer.itemID], function(err, res) {
						if (err) throw err;
						var totalCost = answer.units * queryResponse.Price;
						console.log('-----------------------------------')
						console.log('Order Updated')
						console.log('Your total cost is ', '\nTotal cost: ' + totalCost);
						updateDepartments(totalCost, queryResponse);
					})
				}, 1000);

			}
		})
	})
}

// this function is updating the departments table
/*  @param {
			totalCost: is the total cost of the orde that the customer had placed.
			queryResponse is the reponse that e get from the products table when the customer places an order. It returns an object from the
			table that matched with that order item ID.
}*/

function updateDepartments(totalCost, queryResponse) {
	connection.query('SELECT * FROM departments', function(err, res) {
			if (err) throw err;
			res.forEach(function(ele) {
					if (queryResponse.DepartmentName === ele.DepartmentName) {
						var queryEle = ele.TotalSales;
						var query = 'UPDATE departments SET TotalSales = ? WHERE DepartmentName = ?'
						var totalSales = queryEle + totalCost;
						connection.query(query, [totalSales, ele.DepartmentName], function(err) {
							if (err) throw err;
						})
						connection.query('SELECT * FROM departments', function(err, res) {
							if (err) throw err;
						})
					}

				})

			})
	}

// this is a promise for running the functions so that the data is displayed one after the other
	getResponse()
		.then( processUserOrder )
		.catch( function (err) {
			console.log( err );
		});