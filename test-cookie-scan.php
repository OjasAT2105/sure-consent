<?php
// Test script for cookie scanning functionality

// Set a test cookie
setcookie("test_cookie", "test_value", time() + 3600, "/", "", false, true);

// Output some HTML to test client-side cookie scanning
?>
<!DOCTYPE html>
<html>
<head>
    <title>Cookie Scan Test</title>
</head>
<body>
    <h1>Cookie Scan Test</h1>
    <p>This page sets a test cookie that should be detected by the scanner.</p>
    <script>
        // Set another client-side cookie
        document.cookie = "client_test_cookie=client_test_value; path=/";
        
        console.log("Test cookies set:");
        console.log(document.cookie);
    </script>
</body>
</html>