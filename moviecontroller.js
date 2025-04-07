const Movie  =  require( "./movie" );

exports.putMovie = 
	( req , res ) =>
	{
		// validate that all fields exist
		if ( !req.body.title )
		{
			res.status( 400 ).send({ msg: 'title is required' });
			return;
		}
		else if ( !req.body.yearReleased )
		{
			res.status( 400 ).send({ msg: 'year released is required' });
			return;
		}
		else if ( !req.body.genre || ! Movie.schema.path('genre').enumValues.includes(req.body.genre))
		{
			res.status( 400 ).send({ msg: 'genre is required', options: Movie.schema.path('genre').enumValues });
			return;
		}
		else if ( !req.body.actors || req.body.actors.length < 3)
		{
			res.status( 400 ).send({ msg: 'movie must have at least three actors' });
			return;
		}
		else if ( !req.body.actors.every(function(actor){return actor.actorName && actor.characterName;}) )
		{
			res.status( 400 ).send({ msg: 'actors must have a name and a character' });
			return;
		}
		else
		{
			// request data validated successfully, check if movie already exists
			Movie.findOne(
				{ title : req.body.title },
				( err , movie ) =>
				{
					if ( err )
					{
						req.status( 500 ).send( err );
						return;
					}
					
					if ( movie )
					{
						movie.title         =  req.body.title;
						movie.yearReleased  =  req.body.yearReleased;
						movie.genre         = req.body.genre;
						movie.actors        =  req.body.actors;
						movie.save(
							( err , movie ) => 
							{
								if ( err )
								{
									res.status( 500 ).send( err );
									return;
								}
								res.status( 200 ).json({ 
															success : true,
															msg     : 'movie updated successfully'
													});
							});
						return
					}
					else
					{
						toSave = new Movie({
											title        : req.body.title,
											yearReleased : req.body.yearReleased,
											genre        : req.body.genre,
											actors       : req.body.actors
										});
						toSave.save(
							( err , movie ) =>
							{
								if ( err )
								{
									res.status( 500 ).send( err );
									return;
								}
								res.status( 200 ).json({ 
															success : true, 
															msg     : "movie added successfully"
														});
							});
					}
				});	
		}
	};

exports.postMovie = 
	( req , res ) =>
	{
		// validate that all fields exist
		if ( !req.body.title )
		{
			res.status( 400 ).send({ msg: 'title is required' });
			return;
		}
		else if ( !req.body.yearReleased )
		{
			res.status( 400 ).send({ msg: 'year released is required' });
			return;
		}
		else if ( !req.body.genre || ! Movie.schema.path('genre').enumValues.includes(req.body.genre))
		{
			res.status( 400 ).send({ msg: 'genre is required', options: Movie.schema.path('genre').enumValues });
			return;
		}
		else if ( !req.body.actors || req.body.actors.length < 3)
		{
			res.status( 400 ).send({ msg: 'movie must have at least three actors' });
			return;
		}
		else if ( !req.body.actors.every(function(actor){return actor.actorName && actor.characterName;}) )
		{
			res.status( 400 ).send({ msg: 'actors must have a name and a character' });
			return;
		}
		else
		{
			// request data validated successfully, check if movie already exists
			Movie.findOne(
				{ title : req.body.title },
				( err , movie ) =>
				{
					if ( err )
					{
						req.status( 500 ).send( err );
						return;
					}
					else if ( movie )
					{
						res.status( 401 ).send( { msg : 'Movie with that tile already exists' } );
						return
					}
					else
					{
						toSave = new Movie({
											title        : req.body.title,
											yearReleased : req.body.yearReleased,
											genre        : req.body.genre,
											actors       : req.body.actors
										});
						toSave.save(
							( err , movie ) =>
							{
								if ( err )
								{
									res.status( 500 ).send( err );
									return;
								}
								res.status( 200 ).json({ 
															success : true, 
															msg     : "movie saved successfully"
														});
							});
					}
				});	
		}
	};

exports.getMovies =
	async function( req , res )
	{
		
		// Request WITH review
		// Basically sees if the URL contains "review"
		review = req.query.review;
		if (review && review.toLowerCase()=='true')
		{
			query = req.query;
			delete query.review;
			
			movies = await Movie.aggregate([
											{
												$match:		query
											},
											{
												$lookup:	{
																from         : 'reviewers',
																localField   : 'title',
																foreignField : 'movieTitle',
																as           : 'review'
															}
											},
											{
												$project:	{
																title: 1,
																yearReleased: 3,
																genre: 9,
																actors: 4,
																imageUrl:2,
																review:'$review'
																//avgRating: { $avg : "$review.rating" }
															}
											},
											{
												$sort:		{ avgRating : -1 }
											}
										]);
			res.status( 200 ).send( movies );
		}			
		// Normal request WITHOUT review
		else
		{
			// === Prepare Query === //
			// query = req.query;
			// delete query.review;
			
			// NORMAL movie getRequest
			Movie.find(
				req.query,
				( err , movie ) =>
				{
					if ( err )
					{
						res.status( 500 ).send( err );
					}
					res.status(200).send( movie );
				});
		}
	};
	
exports.deleteMovie =
	( req , res ) =>
	{
		if ( !req.body.title )
		{
			res.status( 401 ).send({ 
										success : false, 
										msg     : 'please include title of movie to delete'
									});
			return;
		}
		Movie.deleteOne(
			{ title : req.body.title },
			( err , movie) =>
			{
				if ( err )
				{
					res.status( 500 ).send( err );
					return;
				}
				res.status( 200 ).send({
											success : true,
											msg     : 'movie removed successfully'
										});
			});
	}
	