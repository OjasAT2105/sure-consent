<!DOCTYPE html>
<html>
<head>
    <title>Frontend Custom Cookies Test</title>
    <script>
        // Simulate the AJAX response that would be sent to the frontend
        window.sureConsentAjax = {
            ajaxurl: '/wp-admin/admin-ajax.php',
            nonce: 'test-nonce'
        };
        
        // Mock the AJAX call to get public settings
        window.fetch = function(url, options) {
            console.log('Mock fetch called with:', url, options);
            
            // Return mock data with custom cookies
            return Promise.resolve({
                json: function() {
                    return Promise.resolve({
                        success: true,
                        data: {
                            cookie_categories: [
                                {
                                    id: "essential",
                                    name: "Essential Cookies",
                                    description: "These cookies are necessary for the website to function...",
                                    icon: "Shield",
                                    required: true
                                },
                                {
                                    id: "functional",
                                    name: "Functional Cookies",
                                    description: "These cookies enable the website to provide enhanced functionality...",
                                    icon: "Settings",
                                    required: true
                                }
                            ],
                            custom_cookies: [
                                {
                                    id: "cookie_1",
                                    name: "Test Custom Cookie 1",
                                    description: "A test custom cookie",
                                    category: "essential",
                                    duration: "30",
                                    provider: "Test Provider",
                                    domain: ".example.com",
                                    type: "custom",
                                    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
                                },
                                {
                                    id: "cookie_2",
                                    name: "Test Custom Cookie 2",
                                    description: "Another test custom cookie",
                                    category: "functional",
                                    duration: "60",
                                    provider: "Another Provider",
                                    domain: ".example.com",
                                    type: "custom",
                                    expires: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString()
                                }
                            ]
                        }
                    });
                }
            });
        };
    </script>
</head>
<body>
    <h1>Frontend Custom Cookies Test</h1>
    <p>This page tests the frontend custom cookies functionality.</p>
    
    <div id="root"></div>
    
    <script type="module">
        // Import and render the PublicApp component
        import PublicApp from './src/public/PublicApp.jsx';
        
        // Render the component
        const root = document.getElementById('root');
        // In a real implementation, we would use ReactDOM.render here
        root.innerHTML = '<p>PublicApp component would be rendered here</p>';
        
        console.log('Frontend test initialized');
    </script>
</body>
</html>