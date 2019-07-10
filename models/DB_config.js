const admin = require("firebase-admin");
const serviceAccount = require("../config/serviceAccountKey.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://gochat-c297e.firebaseio.com/"
});

const DB = admin.database()
module.exports = DB