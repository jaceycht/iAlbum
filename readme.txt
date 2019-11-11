COMP3322 Modern Technologies on World Wide Web 
Assignment 3 

Created by: Cheung Hiu Tung (UID:3035189934)

Synopsis:
A simple single-page social photo sharing application iAlbum is developed using the MEAN stack (MongoDB, Express.JS, AngularJS, and Node.js). 

Files/folders included:
app.js
	- Load the router module implemented in ./routes/albums.js; 
	- Add the middleware to specify that all requests for http://localhost:3000/ will be handled by this router;
	- Add necessary code for loading the MongoDB database created, creating an instance of the database, and passing the database instance for usage of all middlewares;
	- Load other modules and add other middlewares;
	-Add the middleware to serve requests for static files in the public folder
package.json 
	- Add dependencies for MongoDB
./routes/albums.js
	- Implement the router module with middlewares to handle the following endpoints:
		1. HTTP GET requests for http://localhost:3000/init
		2. HTTP POST requests for http://localhost:3000/login
		3. HTTP GET requests for http://localhost:3000/logout
		4. HTTP GET requests for http://localhost:3000/getalbum/:userid
		5. HTTP POST request for http://localhost:3000/uploadphoto
		6.  HTTP DELETE requests for http://localhost:3000/deletephoto/:photoid
		7. HTTP PUT requests for http://localhost:3000/updatelike/:photoid
./public/index.html 
	- Link to the external JavaScript file directory ./public/javascripts/ and the stylesheet directory ./public/stylesheets/
	- Include one header area contains “iAlbum” and two divisions underneath
./public/javascripts/myscripts.js 
	- Implement the code which works together with index.html to achieve the following functionalities:
		1. Page load
		2. Log in 
		3. Log out
		4. Display an album
		5. Upload a photo
		6. Delete a photo
		7. Like a photo
		8. Display enlarged photo
./public/stylesheets/mystyles.css
	- Style page views nicely using CSS rules

Tests:
This application is tested with Google Chrome web browser on MacBook Pro with OS X 10.11.6 environment.



