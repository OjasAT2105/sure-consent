<?php
/**
 * Test file to verify that the privacy preference modal opens correctly
 * This file can be used to test the fix for the modal not opening issue
 */

// Test function to simulate clicking the preferences button
function test_preferences_modal() {
    ?>
    <script>
    // Wait for the page to load
    document.addEventListener('DOMContentLoaded', function() {
        console.log('Test: Page loaded, checking for preferences button');
        
        // Check if we're in admin preview or frontend
        const isAdminPreview = document.querySelector('.sureconsent-preview-banner');
        const isFrontend = document.querySelector('.sureconsent-public-banner');
        
        if (isAdminPreview) {
            console.log('Test: Detected admin preview environment');
            // Try to find and click the preferences button in admin preview
            setTimeout(() => {
                const prefButton = document.querySelector('.sureconsent-preferences-btn');
                if (prefButton) {
                    console.log('Test: Found preferences button in admin preview');
                    prefButton.click();
                    console.log('Test: Clicked preferences button in admin preview');
                    
                    // Check if modal opened
                    setTimeout(() => {
                        const modal = document.querySelector('.fixed.inset-0');
                        if (modal) {
                            console.log('✅ SUCCESS: Preferences modal opened in admin preview');
                        } else {
                            console.log('❌ FAILURE: Preferences modal did not open in admin preview');
                        }
                    }, 1000);
                } else {
                    console.log('Test: Preferences button not found in admin preview');
                }
            }, 2000);
        } else if (isFrontend) {
            console.log('Test: Detected frontend environment');
            // Try to find and click the preferences button in frontend
            setTimeout(() => {
                const prefButton = document.querySelector('.sureconsent-preferences-btn');
                if (prefButton) {
                    console.log('Test: Found preferences button in frontend');
                    prefButton.click();
                    console.log('Test: Clicked preferences button in frontend');
                    
                    // Check if modal opened
                    setTimeout(() => {
                        const modal = document.querySelector('.fixed.inset-0');
                        if (modal) {
                            console.log('✅ SUCCESS: Preferences modal opened in frontend');
                        } else {
                            console.log('❌ FAILURE: Preferences modal did not open in frontend');
                        }
                    }, 1000);
                } else {
                    console.log('Test: Preferences button not found in frontend');
                }
            }, 2000);
        } else {
            console.log('Test: Could not detect environment (admin or frontend)');
        }
    });
    </script>
    <?php
}

// Add the test script to both admin and frontend
add_action('admin_footer', 'test_preferences_modal');
add_action('wp_footer', 'test_preferences_modal');

echo "<!-- Preferences Modal Test Script Loaded -->";
?>