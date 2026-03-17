-- Trigger to enforce uppercase names
CREATE TRIGGER before_employee_insert
BEFORE INSERT ON employees
FOR EACH ROW
SET NEW.emp_name = UPPER(NEW.emp_name);
