DROP PROCEDURE IF EXISTS `RegisterAccount`;

DELIMITER //

CREATE PROCEDURE RegisterAccount
(
	in email varchar(254),
	in first_name varchar(64),
	in last_name varchar(64),
	in date_of_birth date,
	in street varchar(64),
	in street2 varchar(64),
	in house_number varchar(8),
	in password varchar(64)
)
BEGIN
	
	DECLARE exit handler FOR SQLEXCEPTION
	BEGIN
		ROLLBACK;
	END;
	
	START TRANSACTION;
	
	-- Insert rows that account depends on here
	-- Use LAST_INSERT_ID() to get the id of that row

	INSERT INTO account(email, first_name, last_name, date_of_birth, street, street2, house_number, password)
	VALUES(email, first_name, last_name, date_of_birth, street, street2, house_number, password);
	
	COMMIT;
END //

DELIMITER ;