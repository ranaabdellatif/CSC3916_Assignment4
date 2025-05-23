//Require the dev-dependencies
let envPath = __dirname + "/../.env"
require('dotenv').config({path:envPath})
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('./server');
let should = chai.should();

chai.use(chaiHttp);


let login_details = {
    'username': 'username',
    'password': 'password'
}

//Our parent block
describe('Register, Login and check token', () => {
    beforeEach((done) => { //Before each test we empty the database
        db.userList = [];
        done();
    });
    /*
      * Test the /GET route
      */
    describe('/signup ', () => {
        it('it should Register, Login, and check token', (done) => {
            chai.request(server)
                .post('/signup')
                .send(login_details)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.success.should.be.eql(true);

                    // follow up with login
                    chai.request(server)
                        .post('/signin')
                        .send(login_details)
                        .end((err, res) => {
                            console.log('this was run the login part');
                            res.should.have.status(200);
                            res.body.should.have.property('token');

                            let token = res.body.token;
                            console.log(token);
                            // follow up with requesting user protected page
                            chai.request(server)
                                .post('/postjwt')
                                // we set the auth header with our token
                                .set('Authorization', token)
                                .send({ echo: '' })
                                .end((err, res) => {
                                    res.should.have.status(200);
                                    res.body.should.have.property('echo')
;
                                    done(); // Don't forget the done callback to indicate we're done!
                                })
                        });
                });
        });
    });
});