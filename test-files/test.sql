SELECT u.id, u.name, o.order_id, o.total
FROM users u
JOIN orders o ON u.id = o.user_id
WHERE o.total > 100
AND u.created_at > '2024-01-01'
ORDER BY o.total DESC;

-- Duplicate query
SELECT u.id, u.name, o.order_id, o.total
FROM users u
JOIN orders o ON u.id = o.user_id
WHERE o.total > 100
AND u.created_at > '2024-01-01'
ORDER BY o.total DESC;
