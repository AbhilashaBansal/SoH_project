const express = require('express');
const app = express();

//database
const {db, Hospital, Hospital_Slots, User_Appts} = require('./db');
const session = require('express-session');

app.use(session({
    secret: 'kdbfefwefascbasvafjdsvblsdjvlsfvsdjk',
    resave: false,
    saveUninitialized: true
}))


//middlewares for data exchange in proper format, in post requests
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.set('view engine', 'hbs');

app.use("/", express.static(__dirname + '/public'));


// requests

// admin login
app.post('/admin_login', (req,res)=>{
    if(req.body.email && req.body.pass){
        if(req.body.email=="abhilasha@gmail.com" && req.body.pass=="abhilasha"){
            // res.send("ADMIN PAGE");
            res.sendFile(__dirname + '/public/admin_page.html');
        }    
        else{
            return res.render('error', {error: "Invalid E-mail or Password! Please try logging in again with correct details."});
        }
    }
    else{
        res.render('error', {error: "Please enter all details to login!"});
    }
})

// add hospital
app.post('/add_hospital', (req,res)=>{
    if(req.body.id && req.body.name && req.body.city && req.body.locality && req.body.phone && req.body.contact_person){
        Hospital.create({
            id: req.body.id,
            name: req.body.name,
            city: req.body.city,
            locality: req.body.locality,
            contact_person: req.body.contact_person,
            phone: req.body.phone
        }).then((user)=>{
            req.session.admin_logged_in = true;
            res.sendFile(__dirname + '/public/admin_page.html');
        }).catch((error)=>{
            //throw error;
            return res.render('error', {error, text: "Some error occured, while adding! Please try again."});
        })
    }
    else{
        return res.render('error', {error: "Please enter all details to add a hospital!"});
    }
})

// view all hospitals on admin end
app.get('/show_hospitals', (req,res)=>{
    Hospital.findAll()
    .then((data)=>{
        return res.send(data);
    })
    .catch((err)=>{
        res.render('error', {err});
    })
})

// view partiular hospital details
app.get('/hosp', (req,res)=>{
    User_Appts.findAll({
        where: {hospital_id: req.query.id}
    })
    .then((data)=>{
        return res.render('hosp', {data});
    }).catch((err)=>{
        return res.render('error', {err});
    })
})

// add slots for hosp if possible
app.post('/add_slots', (req,res)=>{
    if(req.body.date && req.body.id){
        Hospital_Slots.findOne({
            where: {hospital_id: req.body.id, date: req.body.date}
        })
        .then((data)=>{
            if(!data){
                Hospital.findOne({where: {id: req.body.id}})
                .then((hosp)=>{
                    Hospital_Slots.create({
                        hospital_id: hosp.id,
                        name: hosp.name,
                        city: hosp.city,
                        locality: hosp.locality,
                        date: req.body.date
                    }).then((s)=>{
                        //
                    }).catch((error)=>{
                        //throw error;
                        return res.render('error', {error, text: "Some error occured, while adding! Please try again."});
                    })
                })
                .catch((error)=>{
                    //throw error;
                    return res.render('error', {error, text: "Some error occured, while adding! Please try again."});
                })
            }
            return res.send("Success!");
        }).catch((err)=>{
            return res.render('error', {err});
        })
    }
    else{
        res.render('error', {error: "Please enter all details to add slots!"});
    }
})

// get slots
app.post('/getslots', (req,res)=>{
    if(req.body.hosp_id && req.body.apt_date){
        Hospital_Slots.findOne({
            where: {hospital_id: req.body.hosp_id, date: req.body.apt_date}
        })
        .then((data)=>{
            console.log(data);
            if(!data){
                return res.send("111111111111");
            }
            return res.send(data.slots);
        })
        .catch((err)=>{
            return res.render('error', {err});
        })
    }
    else{
        return res.render('error', {error: "Please enter all details to find slots!"});
    }
})

// add user (take appointment)
app.post('/add_user', (req,res)=>{
    if(req.body.name && req.body.city && req.body.dob && req.body.email && req.body.phone && req.body.aadhaar && req.body.pass
        && req.body.hospital_name && req.body.date && req.body.slot && req.body.hospital_id && req.body.hospital_city){
        User_Appts.create({
            name: req.body.name,
            city: req.body.city,
            dob: req.body.dob,
            phone: req.body.phone,
            email: req.body.email,
            aadhaar: req.body.aadhaar,
            password: req.body.pass,
            hospital_name: req.body.hospital_name,
            hospital_city: req.body.hospital_city,
            hospital_id: req.body.hospital_id,
            appt_date: req.body.date,
            appt_slot: req.body.slot
        }).then((apt)=>{
            //update slot info
            Hospital_Slots.findOne({
                where: {hospital_id: req.body.hospital_id, date: req.body.date}
            })
            .then((hosp_slot)=>{
                slot_string = hosp_slot.slots;
                new_string = slot_string.substring(0, req.body.slot-1) + '1' + slot_string.substring(req.body.slot);
                Hospital_Slots.update({ slots: new_string }, {
                    where: {
                        hospital_id: req.body.hospital_id, date: req.body.date
                    }
                });
                return red.send("Success!");
            })
            .catch((error)=>{
                return res.render('error', {error});
            })

            // return red.send("Success!");
            // res.sendFile(__dirname + '/public/admin_page.html');
        }).catch((error)=>{
            //throw error;
            return res.render('error', {error, text: "Some error occured! Please try again."});
        })
    }
    else{
        return res.render('error', {error: "Please enter all details to book vaccination appointment!"});
    }
})

// user login
app.post('/user_login', (req,res)=>{
    if(req.body.email && req.body.pass){
        User_Appts.findOne({
            where: {email: req.body.email}
        }).then((user)=>{
            if(!user){
                return res.render('error', {error: "No appointment exists! Please try logging in again with correct email."});
            }
            else if(user.password==req.body.pass){
                // sab kuch shi hai, then we should create a cookie with userID and redirect to profile
                res.render('appt', {user});
            }
            else{
                return res.render('error', {error: "Invalid E-mail or Password! Please try logging in again with correct details."});
            }
        }).catch((error)=>{
            console.log(error);
            return res.render('error', {error, text: "Some error occurred! Please try logging in again."});
        })
    }
    else{
        res.render('error', {error: "Please enter all details to login!"});
    }
})

//syncing db
db.sync()
    .then(()=>{
        app.listen(4444, ()=>{
            console.log("Server started successfully at http://localhost:4444 ");
        })
})
