var redis = require("redis");
var crypto = require('crypto');

// リスト型 <key: slide_id, value: comment_id, comment_id, comment_id, ...>
user_client = redis.createClient();

// 初期化
user_client.flushdb();

user = {
  'user_id': 1,
  'user_name': 'buddha',
  'user_type': 'super'
}

// ユーザデータをセット
function set_user(user) {
  user_client.hmset(
    user.user_id,
    'name', user.user_name,
    'type', user.user_type
  );
}

// function get_user(user) {
//   user_client.get('user_id', function(err, data){
//     console.log(data);
//   });
// }

function get_users(user) {
  user_client.hgetall(user.user_id, function(err, obj) {
    console.log("user_id: " + user.user_id);
    console.log(obj);
  });
}

set_user(user);
// get_user(user);
get_users(user);

// 文字列のkey-valueとして値を格納。key:key1、value:val1
user_client.set("user_id", "1");

// 格納した値を取得。 key: key1
user_client.get("user_id", function(err, obj) {
  console.log("get key1: " + obj);
});

user_client.quit();
