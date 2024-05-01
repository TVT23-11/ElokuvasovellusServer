let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
chai.use(chaiHttp);


var user = {token: '', id: 0, name: '', email: ''};

describe('Create user', () => {
    //Success
    it('Should create a new user (TestaajanUseri with password 1234)', (done) => {
        chai.request(server)
            .post('/user/register')
            .send({username: 'TestaajanUseri', password: '1234', email: 'testaajanMaili@testi.fi'})
            .end((err, res) => {
                chai.expect(res).to.have.status(200);
                chai.expect(res.body).equal('ok');
                done();
            });
    }).timeout(5000);

    //Fail
    it('Should fail to create a new user (TestaajanUseri, User already exists)', (done) => {
        chai.request(server)
            .post('/user/register')
            .send({username: 'TestaajanUseri', password: '1234', email: 'testaajanMaili@testi.fi'})
            .end((err, res) => {
                chai.expect(res).to.have.status(401).and.to.be.json;
                chai.expect(res.body).have.property('error').with.equal('username not avaialbe');
                done();
            });
    }).timeout(5000);
    it('Should fail to create a new user (empty username)', (done) => {
        chai.request(server)
            .post('/user/register')
            .send({username: '', password: '1234', email: 'testaajanMaili@testi.fi'})
            .end((err, res) => {
                chai.expect(res).to.have.status(401).and.to.be.json;
                chai.expect(res.body).have.property('error').with.equal('incomplete user data');
                done();
            });
    });
    it('Should fail to create a new user (empty password)', (done) => {
        chai.request(server)
            .post('/user/register')
            .send({username: 'TestaajanUseri', password: '', email: 'testaajanMaili@testi.fi'})
            .end((err, res) => {
                chai.expect(res).to.have.status(401).and.to.be.json;
                chai.expect(res.body).have.property('error').with.equal('incomplete user data');
                done();
            });
    });
    it('Should fail to create a new user (empty email)', (done) => {
        chai.request(server)
            .post('/user/register')
            .send({username: 'TestaajanUseri', password: '123', email: ''})
            .end((err, res) => {
                chai.expect(res).to.have.status(401).and.to.be.json;
                chai.expect(res.body).have.property('error').with.equal('incomplete user data');
                done();
            });
    });
    it('Should fail to create a new user (no username)', (done) => {
        chai.request(server)
            .post('/user/register')
            .send({password: '1234', email: 'testaajanMaili@testi.fi'})
            .end((err, res) => {
                chai.expect(res).to.have.status(401).and.to.be.json;
                chai.expect(res.body).have.property('error').with.equal('incomplete user data');
                done();
            });
    });
    it('Should fail to create a new user (no password)', (done) => {
        chai.request(server)
            .post('/user/register')
            .send({username: 'TestaajanUseri', email: 'testaajanMaili@testi.fi'})
            .end((err, res) => {
                chai.expect(res).to.have.status(401).and.to.be.json;
                chai.expect(res.body).have.property('error').with.equal('incomplete user data');
                done();
            });
    });
    it('Should fail to create a new user (no email)', (done) => {
        chai.request(server)
            .post('/user/register')
            .send({username: 'TestaajanUseri', password: '1234'})
            .end((err, res) => {
                chai.expect(res).to.have.status(401).and.to.be.json;
                chai.expect(res.body).have.property('error').with.equal('incomplete user data');
                done();
            });
    });
});
describe('Login testit', () => {
    
    //Success
    it('Should get login token', (done) => {
        chai.request(server)
            .post('/user/login')
            .send({username: 'TestaajanUseri', password: '1234'})
            .end((err, res) => {
                chai.expect(res).to.have.status(200).and.to.be.json;
                chai.expect(res.body).have.property('jwtToken').and.length.greaterThan(25);
                //Otetaan tokeni talteen myöhempiä testejä varten
                user.token = JSON.parse(res.text).jwtToken;
                done();
            });
    });
    
    //Fail
    it('Should fail to get login token (wrong username)', (done) => {
        chai.request(server)
            .post('/user/login')
            .send({username: 'Admina', password: 'asd'})
            .end((err, res) => {
                chai.expect(res).to.have.status(404).and.to.be.json;
                chai.expect(res.body).have.property('error').with.equal('wrong password');
                done();
            });
    });
    it('Should fail to get login token (wrong password)', (done) => {
        chai.request(server)
            .post('/user/login')
            .send({username: 'Admin', password: 'a'})
            .end((err, res) => {
                chai.expect(res).to.have.status(401).and.to.be.json;
                chai.expect(res.body).have.property('error').with.equal('wrong password');
                done();
            });
    });
    it('Should fail to get login token (no username nor password)', (done) => {
        chai.request(server)
            .post('/user/login')
            .send({username: null, password: null})
            .end((err, res) => {
                chai.expect(res).to.have.status(404).and.to.be.json;
                chai.expect(res.body).have.property('error').with.equal('wrong password');
                done();
            });
    });
    it('Should fail to get login token (no post data)', (done) => {
        chai.request(server)
            .post('/user/login')
            .end((err, res) => {
                chai.expect(res).to.have.status(404).and.to.be.json;
                chai.expect(res.body).have.property('error').with.equal('wrong password');
                done();
            });
    });
});

describe('/GET checkUsername',() =>{
    //Success
    it('Should get not available (TestaajanUseri)', (done) => {
        chai.request(server)
            .get('/user/checkUsername?username=TestaajanUseri')
            .end((err, res) => {
                chai.expect(res).to.have.status(401);
                chai.expect(res.body).equal('not available');
                done();
            });
    }).timeout(5000);

    //Fail
    it('Should get available (random string as username)', (done) => {
        chai.request(server)
            .get('/user/checkUsername?username=TestaajanUseridsadadasasffgfgh23463475')
            .end((err, res) => {
                chai.expect(res).to.have.status(200);
                chai.expect(res.body).equal('available');
                done();
            });
    });
    //Fail
    it('Should get available (no variable)', (done) => {
        chai.request(server)
            .get('/user/checkUsername')
            .end((err, res) => {
                chai.expect(res).to.have.status(404).and.to.be.json;
                chai.expect(res.body).have.property('error').with.equal('data not found');
                done();
            });
    });
});

describe('/GET getUsername', () =>{
    //Success
    it('Should get username (TestaajanUseri)', (done) => {
        chai.request(server)
            .get('/user/getUsername/?token='+user.token)
            .end((err, res) => {
                chai.expect(res).to.have.status(200).and.to.be.json;
                chai.expect(res.body).have.property('username').with.equal('TestaajanUseri');
                user.name = JSON.parse(res.text).username
                done();
            });
    });

    //Fail
    it('Should fail to get username (no token)', (done) => {
        chai.request(server)
            .get('/user/getUsername/?token=')
            .end((err, res) => {
                chai.expect(res).to.have.status(404).and.to.be.json;
                chai.expect(res.body).have.property('error').with.equal('user not found');
                done();
            });
    });

    it('Should fail to get username (no variable)', (done) => {
        chai.request(server)
            .get('/user/getUsername/')
            .end((err, res) => {
                chai.expect(res).to.have.status(404).and.to.be.json;
                chai.expect(res.body).have.property('error').with.equal('user not found');
                done();
            });
    });
});
describe('/GET getUserId', () => {
    //Success
    it('Should get userId (1)', (done) => {
        chai.request(server)
        .get('/user/getUserid/?token='+user.token)
        .end((err, res) => {
            chai.expect(res).to.have.status(200).and.to.be.json;
            chai.expect(res.body).have.property('iduser');
            
            user.id = JSON.parse(res.text).iduser
            done();
        });
    });

    //Fail
    it('Should fail to get userId (no token)', (done) => {
        chai.request(server)
        .get('/user/getUserid/?token=')
        .end((err, res) => {
            chai.expect(res).to.have.status(404).and.to.be.json;
            chai.expect(res.body).have.property('error').with.equal('user not found');
            done();
        });
    });
    //Fail
    it('Should fail to get userId (no variable)', (done) => {
        chai.request(server)
        .get('/user/getUserid/')
        .end((err, res) => {
            chai.expect(res).to.have.status(404).and.to.be.json;
            chai.expect(res.body).have.property('error').with.equal('user not found');
            done();
        });
    });
});
describe('/GET getEmail', () => {
    //Success
    it('Should get email (TestaajanUseri)', (done) => {
        chai.request(server)
        .get('/user/getEmail/?token='+user.token)
        .end((err, res) => {
            chai.expect(res).to.have.status(200).and.to.be.json;
            chai.expect(res.body).have.property('email');
            user.email = JSON.parse(res.text).email;
            done();
        });
    });

    //Fail
    it('Should fail to get email (no token)', (done) => {
        chai.request(server)
        .get('/user/getEmail/?token=')
        .end((err, res) => {
            chai.expect(res).to.have.status(404).and.to.be.json;
            chai.expect(res.body).have.property('error').with.equal('user not found');
            done();
        });
    });
    //Fail
    it('Should fail to get email (no variable)', (done) => {
        chai.request(server)
        .get('/user/getEmail/')
        .end((err, res) => {
            chai.expect(res).to.have.status(404).and.to.be.json;
            chai.expect(res.body).have.property('error').with.equal('user not found');
            done();
        });
    });
});
describe('/GET checkEmail',() =>{
    //Success
    it(`Should get not available (${user.name}, ${user.email}) `, (done) => {
        chai.request(server)
            .get('/user/checkEmail?email='+user.email)
            .end((err, res) => {
                chai.expect(res).to.have.status(401);
                chai.expect(res.body).equal('not available');
                done();
            });
    });

    //Fail
    it('Should get available (random string as email)', (done) => {
        chai.request(server)
            .get('/user/checkEmail?email=Adminadsadadasasffgfgh23463475')
            .end((err, res) => {
                chai.expect(res).to.have.status(200);
                chai.expect(res.body).equal('available');
                done();
            });
    });
    //Fail
    it('Should get available (no variable)', (done) => {
        chai.request(server)
            .get('/user/checkEmail')
            .end((err, res) => {
                chai.expect(res).to.have.status(404).and.to.be.json;
                chai.expect(res.body).have.property('error').with.equal('data not found');
                done();
            });
    });
});

describe('/PUT changeEmail', () => {
    //Success
    it('Should update users email ('+user.name+', '+user.email+' to testi@tes.ti)', (done) => {
        chai.request(server)
            .put('/user/changeEmail?id='+user.token+'&newEmail=testi@tes.ti')
            .end((err, res) => {
                chai.expect(res).to.have.status(200);
                chai.expect(res.body).equal('Sähköposti vaihdettu onnistuneesti');
                done();
            });
    });

    //Fail
    it('Should fail to update users email (email in use)', (done) => {
        chai.request(server)
            .put('/user/changeEmail?id='+user.token+'&newEmail=testi@tes.ti')
            .end((err, res) => {
                chai.expect(res).to.have.status(401);
                chai.expect(res.body).equal('Uusi sähköposti on jo käytössä');
                done();
            });
    });
    it('Should fail to update users email (new email is empty)', (done) => {
        chai.request(server)
            .put('/user/changeEmail?id='+user.token+'&newEmail=')
            .end((err, res) => {
                chai.expect(res).to.have.status(404).and.to.be.json;;
                chai.expect(res.body).have.property('error').with.equal('incomplete data');
                done();
            });
    });
    it('Should fail to update users email (token is empty)', (done) => {
        chai.request(server)
            .put('/user/changeEmail?id=&newEmail=asd@asd.es')
            .end((err, res) => {
                chai.expect(res).to.have.status(404).and.to.be.json;;
                chai.expect(res.body).have.property('error').with.equal('incomplete data');
                done();
            });
    });
    it('Should fail to update users email (has no email)', (done) => {
        chai.request(server)
            .put('/user/changeEmail?id='+user.token)
            .end((err, res) => {
                chai.expect(res).to.have.status(404).and.to.be.json;;
                chai.expect(res.body).have.property('error').with.equal('incomplete data');
                done();
            });
    });
    it('Should fail to update users email (has no token)', (done) => {
        chai.request(server)
            .put('/user/changeEmail?newEmail=asd@asd.es')
            .end((err, res) => {
                chai.expect(res).to.have.status(404).and.to.be.json;;
                chai.expect(res.body).have.property('error').with.equal('incomplete data');
                done();
            });
    });
 });

 describe('/DELETE user', () => {
    //Success
    it('Should delete user '+user.name, (done) => {
        chai.request(server)
            .delete('/user/?id='+user.token)
            .end((err, res) => {
                chai.expect(res).to.have.status(200);
                chai.expect(res.body).equal('Käyttäjätili poistettiin onnistuneesti');
                done();
            });
    });

    //Fail
    it('Should fail to delete delete user (user not found) ', (done) => {
        chai.request(server)
            .delete('/user/?id='+user.token)
            .end((err, res) => {
                chai.expect(res).to.have.status(404);
                chai.expect(res.body).equal('Käyttäjätiliä ei löytynyt');
                done();
            });
    });
    it('Should fail to delete delete user (token is empty) ', (done) => {
        chai.request(server)
            .delete('/user/?id=')
            .end((err, res) => {
                chai.expect(res).to.have.status(404);
                chai.expect(res.body).equal('Käyttäjätiliä ei löytynyt');
                done();
            });
    });
    it('Should fail to delete delete user (no token) ', (done) => {
        chai.request(server)
            .delete('/user/')
            .end((err, res) => {
                chai.expect(res).to.have.status(404);
                chai.expect(res.body).equal('Käyttäjätiliä ei löytynyt');
                done();
            });
    });
 });