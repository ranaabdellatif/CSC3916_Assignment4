var passport       =  require( 'passport' );
var BasicStrategy  =  require( 'passport-http' ).BasicStrategy;
var userController =  require( './usercontroller' );
var crypto         =  require( 'crypto' );

// Authentication
passport.use(
	new BasicStrategy(
		function( username , password , done ) 
		{
			// Retrieve
			userController.findUserByLogin( username , password )
				.then(
					function( user )
					{
						// Found
						if ( user )
						{
							return done( null , { name: user.username } );
						}
						// Fail otherwise
						else
						{
							return done( null , false );
						}
					});
		}
	));

exports.isAuthenticated  =  passport.authenticate( 'basic' , { session : false } );