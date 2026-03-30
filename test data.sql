USE projeto3;

-- Users
INSERT INTO users (name, email, status) VALUES
('Alice Santos', 'alice@example.com', 1),
('Bruno Costa', 'bruno@example.com', 1),
('Carla Mendes', 'carla@example.com', 0),
('Diego Lima', 'diego@example.com', 1),
('Eva Rocha', 'eva@example.com', 1);

-- Tags
INSERT INTO tags (name) VALUES
('bug'),
('feature'),
('urgent'),
('backend'),
('frontend'),
('database'),
('documentation');

-- Tasks
INSERT INTO tasks (title, done) VALUES
('Fix login page crash on mobile', 0),
('Add dark mode support', 0),
('Write API documentation', 1),
('Optimize database queries', 0),
('Implement password reset flow', 1),
('Create unit tests for auth module', 0),
('Deploy staging environment', 1),
('Fix broken image uploads', 0),
('Add pagination to user list', 0),
('Update README with setup instructions', 1);

-- Task Tags
INSERT INTO task_tags (taskId, tagId) VALUES
(1, 1),  -- Fix login crash -> bug
(1, 3),  -- Fix login crash -> urgent
(1, 5),  -- Fix login crash -> frontend
(2, 2),  -- Dark mode -> feature
(2, 5),  -- Dark mode -> frontend
(3, 7),  -- API docs -> documentation
(4, 4),  -- Optimize queries -> backend
(4, 6),  -- Optimize queries -> database
(5, 2),  -- Password reset -> feature
(5, 4),  -- Password reset -> backend
(6, 4),  -- Unit tests -> backend
(7, 4),  -- Deploy -> backend
(8, 1),  -- Fix uploads -> bug
(8, 3),  -- Fix uploads -> urgent
(9, 2),  -- Pagination -> feature
(9, 4),  -- Pagination -> backend
(10, 7); -- README -> documentation

-- User Tasks

INSERT INTO user_task (userId, taskId) VALUES
(1, 1),  -- Alice -> Fix login page crash on mobile
(2, 2),  -- Bruno -> Add dark mode support
(5, 3),  -- Eva -> Write API documentation
(2, 4),  -- Bruno -> Optimize database queries
(4, 5),  -- Diego -> Implement password reset flow
(1, 6),  -- Alice -> Create unit tests for auth module
(3, 7),  -- Carla -> Deploy staging environment
(4, 8),  -- Diego -> Fix broken image uploads
(2, 9),  -- Bruno -> Add pagination to user list
(5, 10); -- Eva -> Update README with setup instructions



USE projeto3;
select * from users WHERE id= 5;