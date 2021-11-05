
const mysql = require('mysql')
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "chatter",
    multipleStatements: true
})
con.connect(function(err) {
    if (err) throw err
    console.log('connected!')
    /*var sql = "CREATE TABLE groups ("+
    "id INT AUTO_INCREMENT PRIMARY KEY, " + 
    "name VARCHAR(255))"*/
    

    /*var sql = "CREATE TABLE group_user (" +
    "user_id INT NOT NULL, "+
    "group_id INT NOT NULL, "+
    "FOREIGN KEY (user_id) REFERENCES users(id), "+
    "FOREIGN KEY (group_id) REFERENCES groups(id))"*/

    //CREATE TABLE FRIEND_REQUESTS
    /*var sql = "CREATE TABLE friend_requests ("+
        "id INT AUTO_INCREMENT, "+
        "user_id1 INT NOT NULL, "+
        "user_id2 INT NOT NULL, "+
        "status VARCHAR(255), "+
        "PRIMARY KEY (id), "+
        "FOREIGN KEY (user_id1) REFERENCES users(id), "+
        "FOREIGN KEY (user_id2) REFERENCES users(id))"
    
    */
    /*
    var sql = "CREATE TABLE friends ("+
    "id INT NOT NULL, "+ 
    "user_id1 INT NOT NULL, "+
    "user_id2 INT NOT NULL, "+
    "FOREIGN KEY (id) REFERENCES friend_requests(id), "+
    "FOREIGN KEY (user_id1) REFERENCES users(id), "+
    "FOREIGN KEY (user_id2) REFERENCES users(id))"
    */
    /*  SEARCH FRIENDS QUERY
    var sql = 
    "SELECT "+
    "alias.username, alias.id AS id "+
    "FROM users JOIN friends "+
    "ON (friends.user_id1 = users.id OR friends.user_id2 = users.id) "+ 
    "JOIN users AS alias ON (friends.user_id2 = alias.id OR friends.user_id1 = alias.id) WHERE users.id = 3 AND alias.id != 3;"
    */


    con.query(sql, function (err, result) {
        if(err) throw err
        console.log(result)
    })
})


