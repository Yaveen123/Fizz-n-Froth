/*
Download SQLite Tools from https://www.sqlite.org/.

$ sqlite3
sqlite> .open fizz.db
sqlite> .read fizz.sql
sqlite> .exit
*/

CREATE TABLE IF NOT EXISTS items (
    id integer primary key autoincrement,
    code text unique not null,
    name text,
    description text,
    image text,
    price integer,
    womped_womped boolean -- sold out
);

CREATE TABLE IF NOT EXISTS orders (
    id integer primary key autoincrement,
    order_key text unique,
    ip text,
    name text,
    status integer, -- 0 = not scanned; 1 = locked; 2 = scanned; 3 = completed
    approved_on integer
);

CREATE TABLE IF NOT EXISTS order_details (
    order_id integer,
    item_id integer,
    quantity integer,
    FOREIGN KEY (order_id) REFERENCES orders(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
    FOREIGN KEY (item_id) REFERENCES items(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

INSERT INTO items (code, name, description, image, price, womped_womped) VALUES
    ('au', 'Australia', 'desc here australia<br><p class="p_main_drink_ingredients">Ingredients</p><ul class="p_main_drink_list" id="p_main_drink_list"><li>sdflsdjf</li></ul>', 'DRINK1.png', 5, 1),
    ('in', 'India', 'desc here india<br><p class="p_main_drink_ingredients">Ingredients</p><ul class="p_main_drink_list" id="p_main_drink_list"><li>sdflsdjf</li></ul>', 'DRINK2.png', 5, 0),
    ('fj', 'Fiji', 'desc here fiji<br><p class="p_main_drink_ingredients">Ingredients</p><ul class="p_main_drink_list" id="p_main_drink_list"><li>sdflsdjf</li></ul>', 'DRINK3.png', 5, 0),
    ('kr', 'Korea', 'desc here korea<br><p class="p_main_drink_ingredients">Ingredients</p><ul class="p_main_drink_list" id="p_main_drink_list"><li>sdflsdjf</li></ul>', 'DRINK4.png', 5, 0),
    ('ps', 'Palestine', 'desc here palestine<br><p class="p_main_drink_ingredients">Ingredients</p><ul class="p_main_drink_list" id="p_main_drink_list"><li>sdflsdjf</li></ul>', 'DRINK5.png', 5, 0);
