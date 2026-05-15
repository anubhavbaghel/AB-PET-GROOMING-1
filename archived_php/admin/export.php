<?php
require_once '../config/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    die('Invalid request');
}

$type = $_POST['type'] ?? 'bookings';
$search = $_POST['search'] ?? '';
$date_from = $_POST['date_from'] ?? '';
$date_to = $_POST['date_to'] ?? '';
$status = $_POST['status'] ?? '';

function sanitize($data) {
    if (is_null($data)) return '';
    return str_replace([',', '"', "\n", "\r"], [' ', ' ', ' ', ' '], trim($data));
}

function formatDate($date) {
    if (!$date) return '';
    return date('Y-m-d', strtotime($date));
}

switch ($type) {
    case 'bookings':
        $headers = ['ID', 'Customer Name', 'Email', 'Phone', 'City', 'Pet Name', 'Pet Type', 'Breed', 'Service', 'Date', 'Time', 'Status', 'Price', 'Notes', 'Created At'];
        
        $sql = "SELECT b.id, c.name as customer_name, c.email, c.phone as customer_phone, c.city, 
                p.name as pet_name, p.pet_type, p.breed, s.name as service_name, 
                b.booking_date, b.start_time, b.status, b.total_price, b.notes, b.created_at
                FROM bookings b
                LEFT JOIN customers c ON b.customer_id = c.id
                LEFT JOIN pets p ON b.pet_id = p.id
                LEFT JOIN services s ON b.service_id = s.id
                WHERE 1=1";
        
        $params = [];
        $types = '';
        
        if ($search) {
            $sql .= " AND (c.name LIKE ? OR c.phone LIKE ? OR p.name LIKE ? OR b.id LIKE ?)";
            $searchParam = "%{$search}%";
            $params[] = $searchParam;
            $params[] = $searchParam;
            $params[] = $searchParam;
            $params[] = $searchParam;
            $types .= 'ssss';
        }
        
        if ($status) {
            $sql .= " AND b.status = ?";
            $params[] = $status;
            $types .= 's';
        }
        
        if ($date_from) {
            $sql .= " AND b.booking_date >= ?";
            $params[] = $date_from;
            $types .= 's';
        }
        
        if ($date_to) {
            $sql .= " AND b.booking_date <= ?";
            $params[] = $date_to;
            $types .= 's';
        }
        
        $sql .= " ORDER BY b.id DESC";
        
        $stmt = $conn->prepare($sql);
        if ($params) {
            $stmt->bind_param($types, ...$params);
        }
        $stmt->execute();
        $result = $stmt->get_result();
        
        $rows = [];
        while ($row = $result->fetch_assoc()) {
            $rows[] = [
                $row['id'],
                sanitize($row['customer_name']),
                sanitize($row['email']),
                sanitize($row['customer_phone']),
                sanitize($row['city']),
                sanitize($row['pet_name']),
                sanitize($row['pet_type']),
                sanitize($row['breed']),
                sanitize($row['service_name']),
                formatDate($row['booking_date']),
                $row['start_time'],
                $row['status'],
                $row['total_price'],
                sanitize($row['notes']),
                formatDate($row['created_at'])
            ];
        }
        break;
        
    case 'customers':
        $headers = ['ID', 'Name', 'Email', 'Phone', 'Address', 'City', 'Created At'];
        
        $sql = "SELECT * FROM customers ORDER BY id DESC";
        $result = mysqli_query($conn, $sql);
        
        $rows = [];
        while ($row = $result->fetch_assoc()) {
            $rows[] = [
                $row['id'],
                sanitize($row['name']),
                sanitize($row['email']),
                sanitize($row['phone']),
                sanitize($row['address']),
                sanitize($row['city']),
                formatDate($row['created_at'])
            ];
        }
        break;
        
    case 'boarding':
        $headers = ['ID', 'Customer Name', 'Phone', 'Pet Name', 'Check-in Date', 'Check-in Time', 'Check-out Date', 'Check-out Time', 'Status', 'Price', 'Notes', 'Created At'];
        
        $sql = "SELECT * FROM boarding ORDER BY id DESC";
        $result = mysqli_query($conn, $sql);
        
        $rows = [];
        while ($row = $result->fetch_assoc()) {
            $rows[] = [
                $row['id'],
                sanitize($row['customer_name'] ?? $row['id']),
                sanitize($row['owner_phone'] ?? ''),
                sanitize($row['pet_name'] ?? $row['id']),
                formatDate($row['check_in_date']),
                $row['check_in_time'],
                formatDate($row['check_out_date']),
                $row['check_out_time'],
                $row['status'],
                $row['total_price'],
                sanitize($row['notes']),
                formatDate($row['created_at'])
            ];
        }
        break;
        
    default:
        die('Invalid export type');
}

// Generate CSV
header('Content-Type: text/csv');
header('Content-Disposition: attachment; filename="' . $type . '_export_' . date('Y-m-d') . '.csv"');
header('Pragma: no-cache');
header('Expires: 0');

$output = fopen('php://output', 'w');

// Write BOM for Excel UTF-8 compatibility
fprintf($output, chr(0xEF).chr(0xBB).chr(0xBF));

// Write headers
fputcsv($output, $headers);

// Write rows
foreach ($rows as $row) {
    fputcsv($output, $row);
}

fclose($output);
exit;