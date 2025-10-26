<?php
// Test script for Puppeteer cookie scanning

// Test the Puppeteer scanning function
function test_puppeteer_scan() {
    $script_path = plugin_dir_path(__FILE__) . 'puppeteer-scan.js';
    
    if (!file_exists($script_path)) {
        echo "Puppeteer script not found at: " . $script_path;
        return;
    }
    
    echo "Puppeteer script found. Testing execution...";
    
    // Test with a simple URL
    $test_url = 'https://example.com';
    $command = 'node ' . escapeshellarg($script_path) . ' ' . escapeshellarg($test_url) . ' 2>&1';
    
    echo "Executing command: " . $command . "\n";
    
    $output = shell_exec($command);
    
    echo "Output:\n";
    echo $output . "\n";
    
    // Check if results file was created
    $results_path = plugin_dir_path(__FILE__) . 'puppeteer-results.json';
    if (file_exists($results_path)) {
        echo "Results file created successfully.\n";
        $results = file_get_contents($results_path);
        echo "Results:\n";
        echo $results . "\n";
        
        // Remove the results file
        unlink($results_path);
    } else {
        echo "Results file not found.\n";
    }
}

// Run the test
test_puppeteer_scan();
?>