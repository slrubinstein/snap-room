Snaproom allows you to create a temporary space to collaborate with anyone nearby. It was built using AngularJS, Node.js/Express, and Mongoose/MongoDB, and is hosted at snaproom.herokuapp.com

You can create a room to split a check, vote on what to eat for lunch,
play a game of backgammon, or just chat.

Snaproom was created by Steve Rubinstein and Navid Karimeddiny, while
students at Fullstack Academy in NYC. All aspects of the project were a collaborative effort, except for the Split-a-Check room, which was made by Steve, and the Backgammon room, which was made by Navid.

Details on how the app works:


When user accesses main page:


1.) User’s latitude/longitude are determined using the HTML5 geolocation API, then rounded to the hundredth’s place, and the ‘joinGeoroom’ socket event is emitted in order to place user in a socket room (which we refer to as a geoRoom) corresponding to that location. 

2.) A geoRoomArray is created that has the user’s lat/lon pair and the 8 lat/lon pairs surrounding the user’s location. When user creates a room, the room’s db document will have the entire geoRoomArray as a field. 

3.) A get request is sent to the database (by roomCreationService.get) to find rooms which have one associated lat/long pair that matches user’s own lat/long pair. This get request is also made whenever the ‘refreshRoomList’ socket event is received by a client. This event is emitted by the server whenever a room is created or expired, and it is emitted to that room’s 9 associated geoRooms.

4.) The assignRoomColorAndNum function iterates through the array of availableRooms, and if there is more than one room with a particular color, adds a number: red2, red3, etc. 

5.) assignRoomColorAndNum calls setRoomToCreateColor, which determines the color to assign to the next room that the user creates. 

6.) The name property of usernameVal (an AngularJS value) is checked, and if it’s false, nameGeneratorServer.getName generates a random name, and usernameVal.name is set to this name.

7.) Auth.isLoggedInAsync is called, and if the user is logged in with Facebook, a get request is sent to the database to get the user’s name and url link to their profile picture. usernameVal.name and usernameVal.picture are then set accordingly.


When creating a room:


1.) A generic room is created. A generic room is represented by a Room document in the database. Note: raw latitude and longitude readings (not rounded to the hundredth place) are stored for use in the Foursquare API call. 

2.) A specific type of room (lunch, chat, etc.) is created. The specific rooms have their own database models, and store the _id of the generic Room document that they’re associated with.

3.) ‘createRoom’ socket event is emitted by client, and server sends ‘refeshRoomList’ event to clients in the same geoRoom and 8 surrounding geoRooms, which causes clients to query database for available rooms in the area, and to see the new room on the main page.


When entering a room (either just after creating the room to enter, or entering an already-created room):


1.) roomService.get method is called in order to retrieve the room name (if one was provided) and the amount of time left before the room expires, as well as to start interval that runs the timer.

2.) personCounterService.listen is called, to instantiate listener for ‘countPeople’ socket event.

3.) roomSocketsService.listen is called, which emits ‘join’ socket event to server along with the roomId and the username, and instantiates listener for ‘updateRoom’ socket event. On the server-side, the ‘join’ event causes: 
    
a.) the user to join a socket room identified by the roomId
    
b.) the user’s socket to be assigned a nickname (username)  and roomId
    
c.) the names of the other users in that room to be found and sent to all users in that room, along with the ‘countPeople’ event

4.) A room-specific get method is called.

5.) room-specific socket event listeners are instantiated.

Note: real-time updating in rooms happens in one of two ways:

1.) In a lunch room or chat room, when messages or votes are submitted, the ‘updateRoom’ socket event is emitted by the client along with the roomId, room data, and info about what type of data was submitted ("chat" or "vote"). That data is then sent back to clients in that room. 

2.) In a backgammon or split-a-check room, updates to that room’s db document cause the server to emit an event to clients in that room, along with room data.


When time expires in a room:


1.) Any client that ever entered that room has a timer for that room which will expire, causing the ‘timeUp’ event to be emitted to the server, along with the roomId.

2.) The first ‘timeUp’ event to be received by the server for a specific room causes the event handler to find the db document for that room, set the ‘expired’ property to true, emit the ‘updateRoom’ event to all users in that room, and emit the ‘refreshRoomList’ event to users in the 9 geoRooms associated with that room. 

3.) Later-arriving ‘timeUp’ events will cause the event handler to find the room document, but not emit socket events, because the ‘expired’ property is set to true.


When navigating to the main page from a room:


1.) ‘onMainPage’ socket event is emitted by the client (code is in app.js, in the callback for the $stateChangeStart listener). On the server-side, the ‘onMainPage’ event handler finds the user’s socket.roomId property and:

a.) removes the user from that socket room

b.) finds the names of the other users in that room and sends the names to all users in that room, along with the ‘countPeople’ event

Note: ‘onMainPage’ is also emitted when a user first lands at the main page, but serves no purpose in that case 

Note: When you leave a room and then enter another room, the socket listeners from the old room don't go away. That's why each of the socket listeners have an if-statement to check if the eventRoomId matches the roomId, so they’re not responding to events that took place in other rooms


When refreshing the browser from inside a room, or hard-coding the url for a room:


1.) Since usernameVal.name will be an empty string, the user will be redirected to the main page (code is in app.js, in the callback for the $stateChangeStart listener).


Animations:


1.) “Snaproom” animation on main page was implemented using animate.css library. The h1 element containing “Snaproom” has ‘animated’ and ‘zoomIn’ classes. Animation parameters for all animate.css animations are set in main.scss in the CSS rule with the .animated selector.

2.) Animation when list of restaurants from Foursquare is added to lunchroom page was also implemented using animate.css. The div containing the restaurant list has ‘animated’ and ‘fadeInDownBig’ classes.

3.) When a Foursquare restaurant is selected as a choice, the ‘animated’ and ‘fadeOutUp’ classes are added to the p element containing the restaurant name and info. li elements in the .restList div have the ‘animated’ and ‘fadeInUp’ classes. 

4.) The animation when opening/closing the list of people in a room, and the animation when the list is open and a user enter/leaves the room, were both implemented using the ng-animate module.




