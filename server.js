var express            =  require( 'express' );
var http               =  require( 'http' );
var bodyParser         =  require( 'body-parser' );
var passport           =  require( 'passport' );
var authController     =  require( './auth' );
var authJwtController  =  require( './auth_jwt' );
var jwt                =  require( 'jsonwebtoken' );
var User               =  require( './user' );
var Movie              =  require( './movie' );
var userController     =  require( './usercontroller' );
var movieController    =  require( './moviecontroller' );
var reviewController    =  require( './reviewcontroller' );
var cors = require('cors');
require( './db.js' );


var app  =  express( );

app.use( bodyParser.json( ) );
app.use( bodyParser.urlencoded( { extended : false } ) );

app.use( passport.initialize( ) );
app.use(cors());

var router  =  express.Router( );



function getMoviesJSONObject( req , msg )
{
	var json = {
					status   :  200,
					message  :  msg,
					headers  :  "No Headers",
					query    :  "No Query String",
					env      :  process.env.UNIQUE_KEY
				};
	
	if ( req.query != null )
		json.query  =  req.query; 

	if ( req.headers != null )
		json.headers  =  req.headers;
	
	return json;
}

function getJSONObject( req ) 
{
    var json = {
					headers  :  "No Headers",
					key      :  process.env.UNIQUE_KEY,
					body     :  "No Body"
				};

    if ( req.body != null ) 
        json.body  =  req.body;
	
    if ( req.headers != null ) 
        json.headers  =  req.headers;

    return json;
}

// BadRoutes function
function getBadRouteJSON( req , res , route )
{
	res.json(	{	
					success:  false, 
					msg:      req.method + " requests are not supported by " + route
				});
}


router.route('/post')
    .post(
		authController.isAuthenticated, 
		function ( req , res ) 
		{
            console.log( req.body );
            res  =  res.status( 200 );
            if ( req.get( 'Content-Type' ) ) 
			{
                console.log( "Content-Type: " + req.get( 'Content-Type' ) );
                res  =  res.type( req.get( 'Content-Type' ) );
            }
            var o  =  getJSONObject( req );
            res.json( o );
        });

router.route( '/postjwt' )
    .post(
		authJwtController.isAuthenticated, 
		function ( req , res )
		{
            console.log( req.body );
            res  =  res.status( 200 );
            if ( req.get( 'Content-Type' ) ) 
			{
                console.log( "Content-Type: " + req.get( 'Content-Type' ) );
                res  =  res.type( req.get( 'Content-Type' ) );
            }
            res.send( req.body );
        }
    );
	
router.route( '/findallusers' )
    .post( userController.findAllUsers );

router.route( '/signup' )
	// POST
	.post( userController.signUp )
	// BadReqs
	.all(
		function( req , res )
		{ 
			getBadRouteJSON( req , res , "/signup" ); 
		});

		
router.route( '/signin' )
	// POST
	.post( userController.signIn )
	// BadReqs
	.all(
		function( req , res )
		{ 
			getBadRouteJSON( req , res , "/signin" ); 
		});


router.route( '/movies' )
	// GET
	.get(
			authJwtController.isAuthenticated, 
			movieController.getMovies 
		)
	// POST
	.post(
			authJwtController.isAuthenticated,
			movieController.postMovie
		)
	// PUT
	.put(
			authJwtController.isAuthenticated, 
			movieController.putMovie
		)
	// DELETE
	.delete(
			authJwtController.isAuthenticated, 
			movieController.deleteMovie
		)
	// BadReqs
	.all(
		function( req , res )
		{ 
			getBadRouteJSON( req , res , "/movies" );
		});


router.route( '/review' )
	// GET
	.get( reviewController.getReview )
	
	// POST
	.post(
			authJwtController.isAuthenticated,
			reviewController.postReview 
		)
	// BadReqs
	.all(
		function( req , res )
		{ 
			getBadRouteJSON( req , res , "/movies" );
		});


app.use( '/' , router );

app.use(
	function( req , res )
	{ 
		getBadRouteJSON( req , res , "this URL path" ); 
	});

app.listen( process.env.PORT || 8080 );

module.exports  =  app; // for testing