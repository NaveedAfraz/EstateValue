-- EstateValue Demo Seed Script
-- Use this to populate your database with realistic data for presentation.

USE estate_value;

-- 1. Create Demo Admin User
-- Password: 12341234
INSERT INTO users (username, email, password) 
VALUES ('admin', 'admin@estatevalue.com', '$2a$10$HnS6WGwC1Ku80o110Qt4Y.s33Ml5PGhFU5zYr1aFiVsyDIriXuRTK')
ON DUPLICATE KEY UPDATE username=username;

-- 2. Add Realistic Bengaluru Properties
SET @admin_id = (SELECT id FROM users WHERE email = 'admin@estatevalue.com');

INSERT INTO properties (title, location, bedrooms, bathrooms, square_feet, actual_price, predicted_price, status, description, image_url, user_id)
VALUES 
(
    'Luxury Villa in Whitefield', 'Whitefield', 4, 4, 3200, 245.00, 238.50, 'fair',
    'Stunning 4BHK independent villa with private garden and modern amenities. Located in a premium gated community.',
    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=1200',
    @admin_id
),
(
    'Modern Apartment near HSR', 'HSR Layout', 3, 3, 1850, 125.00, 142.50, 'underpriced',
    'Spacious 3BHK flat with balconies and excellent ventilation. Close to tech parks and shopping centers.',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200',
    @admin_id
),
(
    'Cozy 2BHK in JP Nagar', 'JP Nagar', 2, 2, 1100, 85.00, 88.20, 'fair',
    'Neat and clean 2BHK in a quiet neighborhood. Perfect for young families or professionals.',
    'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&q=80&w=1200',
    @admin_id
),
(
    'Penthouse in Indiranagar', 'Indiranagar', 3, 4, 2800, 420.00, 310.00, 'overpriced',
    'Ultra-luxury penthouse with panoramic city views and private terrace pool. Premium location.',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200',
    @admin_id
),
(
    'Budget Flat in Electronic City', 'Electronic City', 2, 1, 950, 45.00, 48.00, 'fair',
    'Affordable 2BHK apartment ideal for IT employees. Includes parking and 24/7 security.',
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1200',
    @admin_id
),
(
    'Riverside Estate in Sarjapur', 'Sarjapur Road', 5, 5, 4500, 310.00, 325.00, 'fair',
    'Massive 5BHK estate with expansive lawns and intelligent home automation systems.',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1200',
    @admin_id
);
