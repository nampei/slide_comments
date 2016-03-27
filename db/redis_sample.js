var redis = require("redis"),
client = redis.createClient();

// コネクションの作成。defaultで127.0.0.1:6379を使う。
console.log("-- connection open.");
var client = redis.createClient();

// onメソッドによるerrorイベント時の処理。
client.on("error", function(err) {
  console.log("Error:" + err);
});

// password認証。redis.confでrequirepassにredispassを設定。
console.log("-- auth");
client.auth("redispass");

// 全てのkeyを削除。
console.log("-- flushdb");
client.flushdb();

// 文字列のkey-valueとして値を格納。key:key1、value:val1
client.set("key1", "val1");

// 格納した値を取得。 key: key1
client.get("key1", function(err, obj) {
  console.log("get key1: " + obj);
});

// リストの保持。key: lkey、value: lval1, lval2
client.lpush("lkey1", "lval1");
client.lpush("lkey1", "lval2");

// 格納したリスト値を取得。key:lkey1
client.lrange("lkey1", 0, -1, function(err, obj) {
  console.log("get list lkey1: " + obj);
});

// ハッシュの保持。key: hkey1、value: hfld1:hval1, hfld2:hval2
client.hset("hkey1", "hfld1", "hval1");
client.hset("hkey1", "hfld2", "hval2");

// 格納したハッシュ値を取得。 key:hkey1
client.hgetall("hkey1", function(err, obj) {
  console.log("get hash hkey1");
  console.log(obj);
});


// トランザクションその１。成功。
multi = client.multi();
multi.set("mkey1", "mval1");
multi.set("mkey2", "mval2");
multi.exec(function(err, obj) {
  client.get("mkey1", function(err, rep1) {
    console.log("get mkey1: " + rep1);
  });
  client.get("mkey2", function(err, rep2) {
    console.log("get mkey2: " + rep2);
  });

  // トランザクションその２。watchの値が更新されて失敗。
  client.set("wkey1", "wval1");
  client.watch("wkey1");
  client.set("wkey1", "wval-upd");
  multi = client.multi();
  multi.set("mkey1", "mval3");
  multi.set("mkey2", "mval4");
  multi.exec(function(err, obj) {
    client.get("mkey1", function(err, rep1) {
      console.log("get mkey1: " + rep1);
    });
    client.get("mkey2", function(err, rep2) {
      console.log("get mkey2: " + rep2);
      console.log("-- connection close.");
      client.quit();
    });
  });
});
