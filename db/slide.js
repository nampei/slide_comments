var redis = require("redis");
var crypto = require('crypto');

slide_id_client = redis.createClient();
slide_client = redis.createClient();

function getrandom() {
  var current_date = Date.now() + '';
  var random = Math.random().toString();
  var hash = crypto.createHash('sha1').update(current_date + random).digest('hex');
  return hash;
}

// スライドID: セット型
// slide_id = [
  // slide_id: 148gre3022,
  // slide_id: f3h5253jf
// ]

// スライドバージョン: ソート済みセット型
// slide_version = [
  // 148gre3022(key: slide_id),
  // 352748257(score: 時間)
// ]

// スライドデータ: ハッシュ型
// slide_data = {
//   148gre3022(key: slide_id);,
//
//   ----- 以下 vals -----
//   'body':,
//   'user_id':,
// }

function isMember(member) {
  var ismember = user_id_client.sismember("user_id_set", member);
  console.log("ismember", ismember);
  return ismember;
}

function getUniqueSlideID() {
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

function setSlide(slide) {
  console.log(' ----- setSlide >>>>>');
  slide_client.zadd(
    slide.slide_id, Date.now(), JSON.stringify({
    'version_id': slide.version_id,
    'body': slide.body,
    'user_id': slide.user_id,
    'datetime': slide.datetime
    })
  );
  console.log(' <<<<< setSlide -----');
}

function getSlide(slide_id, version) {
  console.log(' ----- getSlide >>>>>');
  var result;
  slide_client.zrevrange(slide_id, 0, 0, function(err, obj) {
    result = JSON.parse(obj);
  });

  console.log(' <<<<< getSlide -----');
  return result;
}

/**
 * 最新のスライドを取得します。
 * @param  {String} slide_id [description]
 * @return {Promise}          [description]
 */
function getLatestSlide(slide_id) {
  console.log(' ----- getLatestSlide >>>>>');
  return new Promise(function(resolve){
    slide_client.zrevrange(slide_id, 0, 0, function(err, obj) {
      if (obj.length) {
        resolve(JSON.parse(obj[0]));
      } else {
        resolve(null);
      }
      console.log(' <<<<< getLatestSlide -----');
    });
  });
}

function getAllSlides() {
  console.log(' ----- getAllSlide >>>>>');
    slide_id_client.smembers('slide_id_test', function(err, obj) {
      console.log("slide_id_test of members=", obj);
      return obj;
      console.log(' <<<<< getAllSlide -----');
    });
}

// module.exports = room;
exports.getSlide = getSlide;
exports.getLatestSlide = getLatestSlide;
exports.setSlide = setSlide;
exports.getAllSlides = getAllSlides;
