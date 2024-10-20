let express=require("express");
let mongo=require("mongoose");
let app=express();
app.use(express.json());
app.use(express.urlencoded({extended:false}));
let port=3000;
let localhostip="127.0.0.1:5500";
mongo.connect("mongodb://127.0.0.1:27017/realestate").then((data)=>{
    if(data.STATES.connected){
        console.log("connected to database");
    }
    else{
        console.log("db connection failed");
    }
})
let registerScema = new mongo.Schema({
    name: String,
    emailid: String,
    password: String
})
let register = mongo.model("UserData", registerScema)
let tenateschema=new mongo.Schema({
    name : String,
    contact : Number,
    email : String,
    property :String,
    propertyname : String
})
let tenate=mongo.model("TenateData",tenateschema);
app.get("/",(req,res)=>{
    console.log("server is accessed");
    res.write("server start");
    res.end();
})
app.post("/submit",(req,res)=>{
    let name=req.body.tenateName;
    let number=req.body.tenateContact;
    let email=req.body.tenateEmail;
    let property=req.body.tenateProperty;
    let propertyname=req.body.propertyName;
    console.log(`name = ${name}\nnumber= ${number}\nemail = ${email}\nproperty = ${property}\n property name = ${propertyname}`);
    let newtenate=new tenate({
        name : name,
        contact  : number,
        email : email,
        property : property,
        propertyname : propertyname
    })
    newtenate.save().then((data)=>{
        console.log(data);
    })
    console.log("form submited");
    res.json({
        "message" : "form submitted",
        "status":200
    })

})
app.post('/register', (req, res) => {
    let getname = req.body.name;
    let getemailid = req.body.emailid;
    let getpassword = req.body.password;
    let existcheck = register.find({ emailid: getemailid });
    existcheck.then((result) => {
        let length1 = result.length;
        if (length1 == 0) {
            let registered = new register({
                'name': getname,
                'emailid': getemailid,
                'password': getpassword
            });
            registered.save()
                .then(() => {
                    console.log('User Account created successfuly');
                    res.send(`<script>alert('Account Created Successful');window.location.href = 'http://${localhostip}/login.html';</script>`)
                })
                .catch((err) => {
                    console.log("error occurs in data adding to database")
                });
        } else {
            res.send(`<script>alert('Account already exists with this mailid');window.location.href='http://${localhostip}/index.html'</script>`);
        }
    });
})
app.post('/login', (req, res) => {
    let getmailid = req.body.emailid
    let getpassword = req.body.password;
    register.find({ emailid: getmailid, password: getpassword })
        .then((result) => {
            length1 = result.length;
            let loginedname = "";
            let loginedemailid = "";
            if (length1 == 0) {
                res.send(`<script>alert('Invalid Email Id or Password');window.location.href='http://${localhostip}/login.html'</script>`)
            }
            else {
                res.send(`<script>alert('Login Sucessful');window.location.href='http://${localhostip}/main.html'</script>`)
            }
        })
        .catch((err) => {
            console.log("Error Occurs in Login" + err);
            res.send(`<script>alert("Error Occurs in Login");window.location.href="https://${localhostip}/login.html"</script>`)
        })
})
app.listen(port,(err)=>{
    if(err){
        console.log("Error occurs at server");
    }
    else{
        console.log("Server running at port "+port)
    }
})

process.on("uncaughtException",(err)=>{
    console.log(`Error Occurs at the server side\n ${err}`)
})