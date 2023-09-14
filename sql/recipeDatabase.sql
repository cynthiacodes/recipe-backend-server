DROP TABLE IF EXISTS RECIPES

CREATE TYPE MEAL_TIME AS ENUM ('Breakfast', 'Lunch', 'Dinner', 'Snack');


CREATE TABLE RECIPES(
    id serial primary key,
    title varchar(255) not null,
    meal_type MEAL_TIME,
    cuisine varchar(100) not null,
    video_url varchar(255) not null
    );

INSERT INTO RECIPES (title, meal_type, cuisine, video_url)
VALUES
    ('Sukuma Wiki with Ugali', 'Dinner', 'Kenyan', 'https://www.youtube.com/watch?v=7seIPgxQOY0&ab_channel=InfoodsSpecials'),
    
    ('Mahamri', 'Breakfast', 'Kenyan', 'https://www.youtube.com/watch?v=IwKwztK8Yow&ab_channel=RukiaLaltia'),

    ('Matoke', 'Dinner', 'Kenyan', 'https://www.youtube.com/watch?v=RWJ4uRVLlE0&ab_channel=CookingTastyAfricanDishes'),
    
    ('Samosa', 'Breakfast', 'Kenyan', 'https://www.youtube.com/watch?v=S-j-LxKB-Eg&ab_channel=AtasteofhomewithViv');



