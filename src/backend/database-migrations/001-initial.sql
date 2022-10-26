create table user
(
    id         integer primary key autoincrement,
    email      varchar(255) not null unique,
    passwd     varchar(255) default null,
    first_name varchar(255) default null,
    last_name  varchar(255) default null,
    login_id   int(11) null
);

-- Remove this once we added the registration functionality
insert into user (email, first_name, last_name, passwd)
values ('test@test.com', 'Test', 'User', '$2b$10$dhEWK8jwci0g5eGBdpCvv.lZ3SpEdH/h.VYZhCi/H7qinjDO5lJES');
