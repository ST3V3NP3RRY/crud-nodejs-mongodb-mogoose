Step 1: Setting Up the Project

  1. Create a new project directory.(wherever you want as Location)
  eg. C:\Users\gaura\Desktop\ITPT\Fullstack\NodeJS
  Inside this NodeJS directory, I have created CRUD_Node_MongoDB directory/folder.
                            OR
  Open cmd, and create a directory. Create an empty directory with name 'CRUD_Node_MongoDB'.
    $C:\Users\gaura\Desktop\ITPT\Fullstack\NodeJS\> mkdir CRUD_Node_MongoDB

  2. Navigate to the newly created directory.
    $cd CRUD_Node_MongoDB
    Now, Your directory cmd is like,
    $C:\Users\gaura\Desktop\ITPT\Fullstack\NodeJS\CRUD_Node_MongoDB>
                              OR
    If you have created a directory with UI(like by clicking on the New folder)
    $cd C:\Users\gaura\Desktop\ITPT\Fullstack\NodeJS\CRUD_Node_MongoDB

  3. Initialize the npm project
    $npm init

  4. install express package
    $npm install express

  5. install ejs package
      $npm install ejs



Step 1 - Configuring with server.js file
    Create a new file server.js and open it with your atom editor and add the require things:
    //Code to add
    var express = require('express');
    var app= express();
    // set the view engine to ejs
    app.set('view engine', 'ejs');

    // use res.render to load up an ejs view files
    app.get('/', function(req, res){
      res.render('index')
    });

    app.listen(3001);
    console.log('Server is listening on port 3001')

  Step 2 - Creating the EJS Partials
      Create an empty directory name 'views' and inside views create partials directory
      $mkdir views
      $cd views
      $mkdir partials
      Open code editor and Create head.ejs, header.ejs and footer.ejs inside views/partials
      (CRUD_Node_MongoDB/views/partials/head.ejs)
      Code inside the file.

  Step 3 - Adding the EJS Partials to Views
      Create an empty directory named 'pages' inside 'views' folder.
      $mkdir pages
      Create two files index.ejs and about.ejs

  Step 4 - Passing Data to Views and Partials
    You can add data into the server.js file and render it to the index.ejs file.
    server.js
                        res.render('pages/index', {
                          std_data: data, // json data in array
                          tagline: tagline // simple string value
                        });
    index.ejs
                        // taking a value only
                        <%= tagline %>

                        // for loop
                        <ul>
                          <% for(var i = 0; i < std_data.length; i++) { %>
                              <li>
                                <span>
                                  <%= std_data[i].first_name %>
                                </span>
                              </li>
                          <% } %>
                        </ul>

    
