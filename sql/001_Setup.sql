-- Drop tables if they exist --
DROP TABLE IF EXISTS account;


-- Create all tables --
CREATE TABLE account
(
	account_id int NOT NULL AUTO_INCREMENT,
	email varchar(254) NOT NULL,
	first_name varchar(64) NOT NULL,
	last_name varchar(64) NOT NULL,
	date_of_birth date NOT NULL,
	street varchar(64) NOT NULL,
	street2 varchar(64) NOT NULL,
	house_number varchar(8) NOT NULL,
	registration_date date NOT NULL DEFAULT CURRENT_DATE,
	password varchar(64) NOT NULL,
	PRIMARY KEY(account_id, email)
);

-- Create constrains if necessary --
ALTER TABLE account ADD UNIQUE unique_account_email(email);
