-- Transaction example
START TRANSACTION;
UPDATE employees SET salary = salary * 1.05 WHERE dept_id = 2;
DELETE FROM employees WHERE dept_id = 3;
COMMIT;
