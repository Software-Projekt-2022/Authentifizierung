DROP PROCEDURE IF EXISTS `PrepareTestEnv`;

DELIMITER //

CREATE PROCEDURE PrepareTestEnv()
BEGIN

	-- Truncate all tables
	SET FOREIGN_KEY_CHECKS = 0;
	TRUNCATE TABLE account;
	SET FOREIGN_KEY_CHECKS = 1;
	
	-- Passwords: TestPW1, TestPW2, TestPW3
	CALL RegisterAccount('test.user1@test.org', 'First1', 'Last1', '2022-05-25', 'TestStreet1', 'TestStreetExtra1', '1a', '$2a$10$0ejxgRPM2Uq2r3C7kBrJ8uGjLUH4OOYnm.toDgqXr1wtjcYSD2zqC');
	CALL RegisterAccount('test.user2@test.org', 'First2', 'Last2', '2022-05-25', 'TestStreet2', 'TestStreetExtra2', '2b', '$2a$10$lSFw6MWXdhuF43V2UVbrc.LStuFB93XHx0VAijRL.exZXGU4R7Umm');
	CALL RegisterAccount('test.user3@test.org', 'First3', 'Last3', '2022-05-25', 'TestStreet3', 'TestStreetExtra3', '3c', '$2a$10$JD4biE.ybv8ugzHknMdMgu9GAcQEhvyWTS11Tn2NlPLnVxDobNrA2');
	
END //

DELIMITER ;