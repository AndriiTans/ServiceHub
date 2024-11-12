CREATE DATABASE IF NOT EXISTS authdb;
CREATE DATABASE IF NOT EXISTS universitydb;

GRANT ALL PRIVILEGES ON authdb.* TO 'root'@'%';
GRANT ALL PRIVILEGES ON universitydb.* TO 'root'@'%';
FLUSH PRIVILEGES;
