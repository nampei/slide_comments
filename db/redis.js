var redis = require("redis");

client = redis.createClient();
client.flushdb();

var room = "hogeroom";
var user_id = "1";
var comment = "hogecomment1";
var user_id2 = "2";
var comment2 = "hogecomment2"

function set_comment(room, user_id, comment) {
  client.hmset(room, 'user_id', user_id, 'comment', comment);
}

function get_room_comments(room) {
  client.hgetall(room, function(err, obj) {
    console.log("room: " + room);
    console.log(obj);
  });
}

set_comment(room, user_id, comment);
get_room_comments(room);
set_comment(room, user_id2, comment2);
get_room_comments(room);

client.quit();
