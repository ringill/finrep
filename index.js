let { getData, appendData } = require('./spreadsheet');
let authentication = require("./authentication");

authentication.authenticate().then((auth) => {
    getData(auth);
});

// authentication.authenticate().then((auth)=>{
//     appendData(auth);
// });

// authentication.authenticate().then((auth)=>{
//     addSheet(auth);
// });
