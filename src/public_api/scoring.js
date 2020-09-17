let mysql = require('mysql');
let connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'bluecssr_sign'
});

// connect to the MySQL server

  let createTodos = `TRUNCATE zft_temp`;
  connection.query(createTodos) 

  let innercon=`select zft_program.p_id,zft_program.cas_pidsum,zft_program.cas_sum,zft_article_title.ati_id,zft_article_title.ati_title,zft_article_title.ati_content,zft_article_title.a_score_type,zft_article_title.ati_zon from zft_program
  INNER join zft_article_title where cas_pidsum>0 limit 0,100`;
  let stmt = "INSERT INTO zft_temp SELECT * FROM ("+innercon+") AS conn;"
  connection.query(stmt) ;
