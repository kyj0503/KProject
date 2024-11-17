CREATE TABLE User (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Place (
    place_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    address VARCHAR(255) NOT NULL,
    description TEXT,
    opening_hours VARCHAR(100),
    latitude DECIMAL(18, 15) NOT NULL,
    longitude DECIMAL(18, 15) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Review (
    review_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    place_id INT,
    rating INT CHECK(rating BETWEEN 1 AND 10),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE,
    FOREIGN KEY (place_id) REFERENCES Place(place_id) ON DELETE CASCADE
);

INSERT INTO User (username, password, email) VALUES
('user1', 'hashed_password1', 'user1@example.com'),
('user2', 'hashed_password2', 'user2@example.com'),
('user3', 'hashed_password3', 'user3@example.com'),
('user4', 'hashed_password4', 'user4@example.com'),
('user5', 'hashed_password5', 'user5@example.com'),
('user6', 'hashed_password6', 'user6@example.com'),
('user7', 'hashed_password7', 'user7@example.com'),
('user8', 'hashed_password8', 'user8@example.com'),
('user9', 'hashed_password9', 'user9@example.com'),
('user10', 'hashed_password10', 'user10@example.com');

INSERT INTO Place (name, address, description, opening_hours, latitude, longitude) VALUES
('Cafe A', '123 Main St', 'A cozy cafe with a nice atmosphere.', '9:00 - 21:00', 37.5665, 126.9780),
('Cafe B', '456 Maple Ave', 'Great coffee and pastries.', '7:00 - 19:00', 37.5700, 126.9820),
('Library C', '789 Oak Rd', 'Quiet library with a lot of study space.', '8:00 - 22:00', 37.5712, 126.9845),
('Workspace D', '101 Pine St', 'Modern workspace with high-speed internet.', '8:00 - 18:00', 37.5675, 126.9750),
('Cafe E', '202 Birch Ln', 'A cafe with a view of the river.', '10:00 - 20:00', 37.5690, 126.9760),
('Cafe F', '303 Cedar Blvd', 'Organic coffee and a great ambiance.', '8:00 - 22:00', 37.5645, 126.9795),
('Library G', '404 Spruce Dr', 'Public library with various resources.', '9:00 - 18:00', 37.5630, 126.9770),
('Workspace H', '505 Palm Ct', 'Perfect for freelancers and remote workers.', '7:00 - 22:00', 37.5660, 126.9800),
('Cafe I', '606 Elm Ave', 'Best espresso in town.', '6:00 - 18:00', 37.5625, 126.9815),
('Library J', '707 Redwood St', 'Library with private study rooms.', '10:00 - 20:00', 37.5685, 126.9825);

INSERT INTO Review (user_id, place_id, rating, comment) VALUES
(1, 1, 4, 'Nice and cozy cafe with good coffee.'),
(2, 2, 5, 'Best pastries I have ever had!'),
(3, 3, 3, 'Quiet but could use more study tables.'),
(4, 4, 5, 'Great workspace, fast internet, and good lighting.'),
(5, 5, 4, 'Beautiful view but coffee is just average.'),
(6, 6, 5, 'Loved the organic coffee here!'),
(7, 7, 4, 'Good resources but a bit crowded.'),
(8, 8, 5, 'Perfect for freelancers, great vibe.'),
(9, 9, 3, 'Espresso was okay, but a bit overpriced.'),
(10, 10, 4, 'Nice study rooms, good for group study.');