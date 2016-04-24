var redis = require("redis");
var crypto = require('crypto');

// リスト型 <key: slide_id, value: comment_id, comment_id, comment_id, ...>
user_data_client = redis.createClient();
user_id_client = redis.createClient();

// ユーザID: セット型(重複を許さない)
// user_id_set = [
  // user_id: 101,
  // user_id: 102,
  // user_id: 103,
// ];

// ユーザ属性: ハッシュ型
// user_data = {
  // 101(ユーザID),
  // 'user_name': 'buddha',
  // 'user_type': 'super'
// }

function isMember(member) {
  var ismember = user_id_client.sismember("user_id_set", member);
  console.log("ismember", ismember);
  return ismember;
}

function getUniqueUserID() {
  var i = 0;
  while (i < 10) {
    var dn = Date.now();
    if (!isMember(dn)) {
      return dn;
    } else {
      i++;
    }
  }
}

// ユーザデータをセット
function hmsetUserData(user_data) {
  user_data_client.hmset(
    user_data.user_id,
    'name', user_data.user_name,
    'type', user_data.user_type
  );
}

// ユーザ情報を全て取得
function hgetallUserData(user_id) {
  user_data_client.hgetall(user_id, function(err, data){
    console.log("err=", err);
    console.log("data=", data);
    return data
  });
}

exports.isMember = isMember;
exports.getUniqueUserID = getUniqueUserID;
exports.hmsetUserData = hmsetUserData;
exports.hgetallUserData = hgetallUserData;
