// include the Express module
var express = require('express');
// require the body-parser module, and create a JSON parser
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

/* create an add method for your Storage prototype, so that .add() will be available on all future instances */
var Storage = {
  add: function (name) {
    var item = {
      name: name,
      id: this.setId
    };
    this.items.push(item);
    this.setId += 1;
    return item;
  },

  // DELETE method-----------
  remove: function (id) {

    //return this.items.splice((id - 1), 1);
    id = Number(id);

    for (var i = 0; i < this.items.length; i++) {
      if (id === this.items[i].id) {

        return this.items.splice(i, 1);
      }
    }
  },

  // PUT method--------------
  update: function (id, name) {
    id = Number(id);

    for (var i = 0; i < this.items.length; i++) {
      if (id === this.items[i].id) {

        return this.items[i].name = name;
      }
    }
  }
};

/* make a factory function createStorage which you can use to create any number of objects that inherit from Storage. These objects start their life with an empty items array and a record of the latest unique id (setId) for each item */
var createStorage = function () {
  var storage = Object.create(Storage);
  storage.items = [];
  storage.setId = 1;
  return storage;
};

// add some "mock" data to your storage object 
var storage = createStorage();

storage.add('Broad beans');
storage.add('Tomatoes');
storage.add('Peppers');

/* create the app object and then tell it to use the express.static middleware. This tells express to serve any static content contained in the public folder. When a request is made to the server for a static file (like, your CSS file), Express will look for it in the directory you specify. Also, if your server doesn't have a route that handles the request, it will look for a corresponding HTML file in that folder. Notice that the code above has no root (/) route. When the browser requests the root, Express will look for index.html in the public directory. */
var app = express();
app.use(express.static('public'));

/* single GET route for get requests to the /items URL. In the route you return the storage.items list as JSON.*/
app.get('/items', function (request, response) {
  response.json(storage.items);
});

// add a POST route
/*second argument to the post method is jsonParser. This tells express to use the jsonParser middleware when requests for the route are made. The middleware adds a new attribute, request.body, to the request object. If the name property is missing from the request body you use response.sendStatus to indicate a 400 Bad Request.*/
app.post('/items', jsonParser, function (request, response) {
  if (!('name' in request.body)) {
    return response.sendStatus(400);
  }
  /*On the other hand, if the body contains the item name, then you simply add the item to the shopping list, and return a 201 Created status, along with the item.*/

  var item = storage.add(request.body.name);
  response.status(201).json(item);
});

// adding a DELETE endpoint ---------
app.delete('/items/:id', jsonParser, function (request, response) {
  var deleteIdRequest = request.params.id;
  if (!request.body) {
    return response.sendStatus(404);
  }

  var itemDeleted = storage.remove(deleteIdRequest);
  response.status(200).json(itemDeleted);
});

// adding a PUT endpoint
app.put('/items/:id', jsonParser, function (request, response) {

  if (!request.body) {
    return response.sendStatus(404);
  }

  var putId = request.params.id;
  var putName = request.body.name;


  var itemPut = storage.update(putId, putName);
  response.status(200).json(itemPut);
});

// extending API to USERS------
var createUser = function (username) {
  user = {};
  useritem = [];
  var randomItem = storage.items[Math.floor(Math.random() * storage.items.length)];
  useritem.push(randomItem);
  user.name = username;
  user.items = useritem;
  return user;
};
// USER endpoint -------
app.get('/users/:username', function (request, response) {
  var getUser = request.params.username;
  response.json(createUser(getUser));
});

app.listen(process.env.PORT || 8080, process.env.IP);

exports.app = app;
exports.storage = storage;