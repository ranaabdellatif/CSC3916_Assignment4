// require any models
require("./user");
const mongoose  =  require( "mongoose" );
const dbURI     =  process.env.DB_URL;

const options = {
	  dbName: "test"
	};

mongoose
	.connect( dbURI , options )
	.then(
		() => {
				console.log( "Database connection established!" );
			  },
		err => {
					console.log( "Error connecting Database instance due to: " , err );
			   }
	);
