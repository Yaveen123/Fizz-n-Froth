function undo(id) {
    window.location.href = '/mchistory.php?mode=undo&order_id=' + id;
}

function del(id) {
    if (confirm(`Are you sure you want to DELETE order ${id}?`)) {
        window.location.href = '/mchistory.php?mode=delete&order_id=' + id;
    }
}