var redis = require("redis");
var crypto = require('crypto');

// リスト型 <key: room_id, value: comment_id, comment_id, comment_id, ...>
room_client = redis.createClient();

// ハッシュ型 <key: comment_id, value: user_id: "1", comment_text: "こんにちは", datetime: 346732362116>
comment_client = redis.createClient();

// 初期化
comment_client.flushdb();
room_client.flushdb();

function getrandom() {
  var current_date = Date.now() + '';
  var random = Math.random().toString();
  var hash = crypto.createHash('sha1').update(current_date + random).digest('hex');
  return hash;
}

var room = {
  'room_id';,
  'version_id':,
  'body':,
  'user_id':,
  'datatime':
}

var room_id = "1";

var comment1 = {
  comment_id: getrandom(),
  user_id: "1",
  comment_text: "comment_text1",
  datetime: Date.now() + ''
}
var comment2 = {
  comment_id: getrandom(),
  user_id: "2",
  comment_text: "comment_text2",
  datetime: Date.now() + ''
}

// room_clientにコメントidをプッシュする
// key: room_id、value: comment_id,,,
function push_comment_id(comment_id) {
  room_client.lpush(room_id, comment_id);
}

//
function set_comment(comment) {
  comment_client.hmset(
    comment.comment_id,
    'user_id', comment.user_id,
    'comment_text', comment.comment_text,
    "datetime", comment.datetime
  );
}

//
function get_room_comments(comment) {
  comment_client.hgetall(comment, function(err, obj) {
    console.log("comment_id: " + comment);
    console.log(obj);
  });
}

function get_room_comments_id_list (room_id) {
  room_client.lrange(room_id, 0, -1, function(err, obj) {
    console.log("get comment_id list "+ room_id +": " + obj);
  });
}

// コメントidをルームにプッシュ
push_comment_id(comment1.comment_id);

// コメントデータをセット
set_comment(comment1);

// コメントデータをゲット
get_room_comments(comment1.comment_id);

push_comment_id(comment2.comment_id);
set_comment(comment2);
get_room_comments(comment2.comment_id);

// ルームのコメントidのリストを表示
get_room_comments_id_list(room_id);

// 終了
comment_client.quit();
room_client.quit();
