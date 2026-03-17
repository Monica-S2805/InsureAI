-- Procedure to get high earners
DELIMITER //
CREATE PROCEDURE GetHighEarners(IN min_salary DECIMAL(10,2))
BEGIN
  SELECT emp_name, salary FROM employees WHERE salary > min_salary;
END //
DELIMITER ;
