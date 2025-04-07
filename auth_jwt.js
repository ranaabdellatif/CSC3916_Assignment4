var passport        =  require( 'passport' );
var JwtStrategy     =  require( 'passport-jwt' ).Strategy;
var ExtractJwt      =  require( 'passport-jwt' ).ExtractJwt;
var userController  =  require( './usercontroller' );
require( 'dotenv' ).load( );

var opts             =  { };
opts.jwtFromRequest  =  ExtractJwt.fromAuthHeaderWithScheme( "jwt" );
opts.secretOrKey     =  process.env.SECRET_KEY;

// JWT Authentication
passport.use(
	new JwtStrategy(
		opts, 
		function( jwt_payload , done ) 
		{
			// Token Extraction
			userController.findUserById( jwt_payload )
				.then(
					function( user )
					{
						// Authenticate
						if ( user )
							done( null , user );
						
						// Fail otherwise
						else
							done( null , false );
					});
		}
	));

exports.isAuthenticated  =  passport.authenticate( 'jwt' , { session : false } );
exports.secret           =  opts.secretOrKey ;