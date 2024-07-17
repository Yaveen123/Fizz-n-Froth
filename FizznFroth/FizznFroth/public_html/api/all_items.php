<?php
function allItems($db) {
    $results = $db->query('SELECT * FROM items');

    $items = array();

    while ($row = $results->fetchArray()) {
        $entry = array(
            'id' => $row[0],
            'code' => $row[1],
            'name' => $row[2],
            'description' => $row[3],
            'image' => $row[4],
            'price' => $row[5]
        );

        array_push($items, $entry);
    }

    return $items;
}