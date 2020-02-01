const mysql = require("mysql");
const inquirer = require("inquirer");

// Define the mySQL conncection
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "!@Galaxy",
  database: "top_songs"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
});

// Prompt user for what kind of search they wish to start.

function userInputPrompt() {
    inquirer.prompt([{
        type: 'list',
        name: 'filter',
        message: 'What kind of search would you like to do?',
        choices: ['By Artist' , 'By Song Count', 'By Year Range' , 'By Song Name']
    }
    ]).then(function(input) {
        console.log('User Selected' + input.filter);

        if (input.filter === 'By Artist') {
            artistQuery();
        } else if (input.filter === 'By Song Count')  {
            songcountQuery();
        } else if (input.filter === 'By Year Range') {
            yearRangeQuery();
        } else if (input.filter === 'By Song Name') {
            songNameQuery();
        }
    })
}

// Function to handle the Artist Query
function artistQuery(){
    inquirer.prompt([{
        type: 'input',
        name: 'artist',
        message: 'What artist are you looking for?'
    }
    ]).then(function(input){
        queryStr = 'SELECT * FROM top5000 WHERE ?'
    connection.query(queryStr, {artist: input.artist}, function(err,data) {
        if(err) throw err;

        console.log('Artist Returned');
        console.log('...................\n');

        for(var i = 0; i < data.length; i++) {
            console.log([
                data[i].position,
                data[i].artist,
                data[i].song,
                data[i].year

            ].join("|"));
        }

        console.log("\n---------------------------------------------------------------\n");
        connection.end();
    })   
})
}

// Funtion to handle the Song Count Query
function songcountQuery(){
    inquirer.prompt([{
        type:'input',
        name: 'count',
        message: 'Please enter the miniumum count calue for artist appearance.'
    }
    ]).then(function(input) {
        queryStr = 'SELECT artist FROM top5000 GROUP BY artist HAVING COUNT(*) > ' + input.count;
        connection.query(queryStr, function(err,data) {
            if(err) throw err

            for(var i = 0; i < data.length; i++) {
                console.log([
                    data[i].artist].join("|"));
            }
            console.log("\n---------------------------------------------------------------\n");
            connection.end();
        })
    })
}

// Function to handle a year range Query
function yearRangeQuery(){
    inquirer.prompt([{
        type:'inout',
        name: 'begin',
        message:"Please enter your start year."

    },
    {
        type:"input",
        name:"end",
        message:"Please enter your end year",
    }
    ]).then(function(input) {
        queryStr = 'SELECT * FROM topp500 Where year BETWEEN ? and ? ';
        connection.query(queryStr, function(err,data) {
            if(err) throw err

            for(var i = 0; i < data.length; i++) {
                console.log([
                    data[i].position,
                    data[i].artist,
                    data[i].song,
                    data[i].year
    
                ].join("|"));
            }
            console.log("\n---------------------------------------------------------------\n");
            connection.end();
        })
    })
}

// Function to handle Sone Name Query 
function songNameQuery() {
    inquirer.prompt([{
        type: "input",
        name: "song",
        message:"Please enter the song you are looking for."
    }
    ]).then(function(input) {
        queryStr = 'SELECT song FROM top5000 WHERE ?';
        connection.query(queryStr, function(err,data) {
            if(err) throw err

            for(var i = 0; i < data.length; i++) {
                console.log([
                    data[i].position,
                    data[i].artist,
                    data[i].song,
                    data[i].year
    
                ].join("|"));
            }
            console.log("\n---------------------------------------------------------------\n");
            connection.end();
        })
    })
}

userInputPrompt();