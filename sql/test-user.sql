DELETE FROM user;
DELETE FROM task;
DELETE FROM task_label;
DELETE FROM note;
DELETE FROM task_note;

INSERT INTO user(username,email,oauth,picture) VALUES('default','default@nomail.org','#',NULL);

INSERT INTO task(id,author,name,description,start,end,allDay,done) VALUES(1,'default','Task 1','Generic description','2022-05-19','2022-05-19',0,0);
INSERT INTO task(id,author,name,description,start,end,allDay,done) VALUES(2,'default','Task 2','Generic description','2022-05-19','2022-05-19',0,0);
INSERT INTO task(id,author,name,description,start,end,allDay,done) VALUES(3,'default','Task 3','Generic description','2022-05-19','2022-05-19',0,1);

INSERT INTO task_label(taskId, label) VALUES(1,'Label');
INSERT INTO task_label(taskId, label) VALUES(2,'Label');
INSERT INTO task_label(taskId, label) VALUES(3,'Label2');

INSERT INTO note(id,author,title,content) VALUES(1,'default','Note 1', 'Hello World!');