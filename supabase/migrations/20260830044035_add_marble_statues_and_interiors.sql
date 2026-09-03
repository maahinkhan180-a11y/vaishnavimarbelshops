/*
# Add Marble Statues and Marble Home Interiors categories

1. New Categories
- "Marble Statues" — hand-carved deity murtis in premium white and coloured marble
- "Marble Home Interiors" — marble mandirs, carved fireplaces & bespoke interior stonework

2. New Subcategories
- Under Marble Statues: Radha Krishna, Sita Rama, Goddess Lakshmi, Maa Kali, Sai Baba
- Under Marble Home Interiors: Marble Mandir, Marble Fireplace

3. New Products
- Multiple products under each subcategory with full specifications

4. Security
- Same RLS policies as existing tables (public read, authenticated write)
*/

INSERT INTO categories (name, slug, description, image_url, display_order) VALUES
('Marble Statues', 'marble-statues', 'Hand-carved deity murtis in premium white and coloured marble. Radha Krishna, Sita Rama, Goddess Lakshmi, Maa Kali, Sai Baba and more.', 'https://images.pexels.com/photos/35587787/pexels-photo-35587787.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 7),
('Marble Home Interiors', 'marble-home-interiors', 'Marble mandirs, carved fireplaces & bespoke interior stonework for your home.', 'https://images.pexels.com/photos/37431602/pexels-photo-37431602.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 8)
ON CONFLICT (slug) DO NOTHING;

-- Subcategories for Marble Statues
INSERT INTO subcategories (category_id, name, slug, description, image_url, display_order)
SELECT c.id, v.name, v.slug, v.description, v.image_url, v.display_order
FROM (VALUES
  ('marble-statues', 'Radha Krishna Statue', 'radha-krishna-statue', 'Hand-carved Radha Krishna marble murti with intricate detailing.', 'https://images.pexels.com/photos/35587787/pexels-photo-35587787.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 1),
  ('marble-statues', 'Sita Rama Statue', 'sita-rama-statue', 'Premium marble Sita Rama murti with fine craftsmanship.', 'https://images.pexels.com/photos/18382817/pexels-photo-18382817.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 2),
  ('marble-statues', 'Goddess Lakshmi Statue', 'goddess-lakshmi-statue', 'Beautifully crafted Goddess Lakshmi marble statue with ornate details.', 'https://images.pexels.com/photos/15164157/pexels-photo-15164157.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 3),
  ('marble-statues', 'Maa Kali Statue', 'maa-kali-statue', 'Powerful Maa Kali marble murti hand-carved by master artisans.', 'https://images.pexels.com/photos/35446433/pexels-photo-35446433.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 4),
  ('marble-statues', 'Sai Baba Statue', 'sai-baba-statue', 'Serene Sai Baba marble statue with fine detailing and spiritual aura.', 'https://images.pexels.com/photos/35558431/pexels-photo-35558431.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 5)
) AS v(category_slug, name, slug, description, image_url, display_order)
JOIN categories c ON c.slug = v.category_slug
ON CONFLICT (slug) DO NOTHING;

-- Subcategories for Marble Home Interiors
INSERT INTO subcategories (category_id, name, slug, description, image_url, display_order)
SELECT c.id, v.name, v.slug, v.description, v.image_url, v.display_order
FROM (VALUES
  ('marble-home-interiors', 'Marble Mandir', 'marble-mandir', 'Exquisitely carved marble mandirs for home temples and pooja rooms.', 'https://images.pexels.com/photos/37431602/pexels-photo-37431602.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 1),
  ('marble-home-interiors', 'Marble Fireplace', 'marble-fireplace', 'Luxurious carved marble fireplaces for elegant home interiors.', 'https://images.pexels.com/photos/18362066/pexels-photo-18362066.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 2)
) AS v(category_slug, name, slug, description, image_url, display_order)
JOIN categories c ON c.slug = v.category_slug
ON CONFLICT (slug) DO NOTHING;

-- Products for Marble Statues
INSERT INTO products (subcategory_id, name, slug, description, image_url, brand, material, size, thickness, finish, color, design, coverage_per_box, pieces_per_box, suitable_for, price, mrp, stock_status, rating, specs, is_featured, display_order)
SELECT s.id, v.name, v.slug, v.description, v.image_url, v.brand, v.material, v.size, v.thickness, v.finish, v.color, v.design, v.coverage_per_box, v.pieces_per_box, v.suitable_for, v.price, v.mrp, v.stock_status, v.rating, v.specs::jsonb, v.is_featured, v.display_order
FROM (VALUES
  ('radha-krishna-statue', 'Radha Krishna Marble Murti', 'radha-krishna-marble-murti', 'Hand-carved Radha Krishna marble murti with intricate detailing. Crafted from premium white marble by master artisans.', 'https://images.pexels.com/photos/35587787/pexels-photo-35587787.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Vaishnavi', 'White Marble', '2 ft', NULL, 'Polished', 'White', 'Hand-Carved', NULL, NULL, 'Home Temple, Pooja Room', 15000.00, 22000.00, 'In Stock', 4.9, '{"Brand":"Vaishnavi","Material":"White Marble","Type":"Hand-Carved Murti","Color":"White","Height":"2 ft","Finish":"Polished","Warranty":"Lifetime"}', true, 1),
  ('radha-krishna-statue', 'Radha Krishna Coloured Marble Statue', 'radha-krishna-coloured-marble-statue', 'Beautifully coloured Radha Krishna marble statue with gold accents and fine painted details.', 'https://images.pexels.com/photos/35587787/pexels-photo-35587787.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Vaishnavi', 'White Marble', '3 ft', NULL, 'Polished', 'Multicolor', 'Hand-Carved & Painted', NULL, NULL, 'Home Temple, Pooja Room', 35000.00, 50000.00, 'In Stock', 5.0, '{"Brand":"Vaishnavi","Material":"White Marble","Type":"Hand-Carved & Painted","Color":"Multicolor","Height":"3 ft","Finish":"Polished","Warranty":"Lifetime"}', true, 2),
  ('sita-rama-statue', 'Sita Rama Marble Murti', 'sita-rama-marble-murti', 'Premium marble Sita Rama murti with fine craftsmanship and serene expressions.', 'https://images.pexels.com/photos/18382817/pexels-photo-18382817.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Vaishnavi', 'White Marble', '2.5 ft', NULL, 'Polished', 'White', 'Hand-Carved', NULL, NULL, 'Home Temple, Pooja Room', 25000.00, 35000.00, 'In Stock', 4.8, '{"Brand":"Vaishnavi","Material":"White Marble","Type":"Hand-Carved Murti","Color":"White","Height":"2.5 ft","Finish":"Polished","Warranty":"Lifetime"}', true, 1),
  ('sita-rama-statue', 'Sita Rama Lakshmana Hanuman Set', 'sita-rama-lakshmana-hanuman-set', 'Complete Sita Rama Lakshmana Hanuman marble statue set. Exquisitely carved in premium white marble.', 'https://images.pexels.com/photos/18382817/pexels-photo-18382817.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Vaishnavi', 'White Marble', '3 ft', NULL, 'Polished', 'White', 'Hand-Carved Set', NULL, NULL, 'Home Temple, Pooja Room', 65000.00, 95000.00, 'In Stock', 5.0, '{"Brand":"Vaishnavi","Material":"White Marble","Type":"Hand-Carved Set of 4","Color":"White","Height":"3 ft","Finish":"Polished","Warranty":"Lifetime"}', true, 2),
  ('goddess-lakshmi-statue', 'Goddess Lakshmi Marble Statue', 'goddess-lakshmi-marble-statue', 'Beautifully crafted Goddess Lakshmi marble statue with ornate details and lotus base.', 'https://images.pexels.com/photos/15164157/pexels-photo-15164157.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Vaishnavi', 'White Marble', '2 ft', NULL, 'Polished', 'White & Gold', 'Hand-Carved', NULL, NULL, 'Home Temple, Pooja Room', 18000.00, 28000.00, 'In Stock', 4.9, '{"Brand":"Vaishnavi","Material":"White Marble","Type":"Hand-Carved Murti","Color":"White & Gold","Height":"2 ft","Finish":"Polished","Warranty":"Lifetime"}', true, 1),
  ('goddess-lakshmi-statue', 'Goddess Lakshmi on Lotus Marble Murti', 'goddess-lakshmi-lotus-marble-murti', 'Goddess Lakshmi seated on lotus, hand-carved in premium white marble with gold accents.', 'https://images.pexels.com/photos/15164157/pexels-photo-15164157.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Vaishnavi', 'White Marble', '1.5 ft', NULL, 'Polished', 'White & Gold', 'Hand-Carved', NULL, NULL, 'Home Temple, Pooja Room', 12000.00, 18000.00, 'In Stock', 4.7, '{"Brand":"Vaishnavi","Material":"White Marble","Type":"Hand-Carved Murti","Color":"White & Gold","Height":"1.5 ft","Finish":"Polished","Warranty":"Lifetime"}', false, 2),
  ('maa-kali-statue', 'Maa Kali Marble Murti', 'maa-kali-marble-murti', 'Powerful Maa Kali marble murti hand-carved by master artisans. Intricate detailing with traditional design.', 'https://images.pexels.com/photos/35446433/pexels-photo-35446433.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Vaishnavi', 'White Marble', '2 ft', NULL, 'Polished', 'Black & White', 'Hand-Carved', NULL, NULL, 'Home Temple, Pooja Room', 20000.00, 30000.00, 'In Stock', 4.8, '{"Brand":"Vaishnavi","Material":"White Marble","Type":"Hand-Carved Murti","Color":"Black & White","Height":"2 ft","Finish":"Polished","Warranty":"Lifetime"}', true, 1),
  ('maa-kali-statue', 'Maa Kali Coloured Marble Statue', 'maa-kali-coloured-marble-statue', 'Vibrant Maa Kali coloured marble statue with traditional painting and gold detailing.', 'https://images.pexels.com/photos/35446433/pexels-photo-35446433.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Vaishnavi', 'White Marble', '3 ft', NULL, 'Polished', 'Multicolor', 'Hand-Carved & Painted', NULL, NULL, 'Home Temple, Pooja Room', 45000.00, 65000.00, 'In Stock', 4.9, '{"Brand":"Vaishnavi","Material":"White Marble","Type":"Hand-Carved & Painted","Color":"Multicolor","Height":"3 ft","Finish":"Polished","Warranty":"Lifetime"}', true, 2),
  ('sai-baba-statue', 'Sai Baba Marble Statue', 'sai-baba-marble-statue', 'Serene Sai Baba marble statue with fine detailing and spiritual aura. Hand-carved in premium white marble.', 'https://images.pexels.com/photos/35558431/pexels-photo-35558431.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Vaishnavi', 'White Marble', '2 ft', NULL, 'Polished', 'White', 'Hand-Carved', NULL, NULL, 'Home Temple, Pooja Room', 16000.00, 24000.00, 'In Stock', 4.8, '{"Brand":"Vaishnavi","Material":"White Marble","Type":"Hand-Carved Murti","Color":"White","Height":"2 ft","Finish":"Polished","Warranty":"Lifetime"}', true, 1),
  ('sai-baba-statue', 'Sai Baba Coloured Marble Murti', 'sai-baba-coloured-marble-murti', 'Sai Baba coloured marble murti with traditional painting and serene expression.', 'https://images.pexels.com/photos/35558431/pexels-photo-35558431.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Vaishnavi', 'White Marble', '1.5 ft', NULL, 'Polished', 'Multicolor', 'Hand-Carved & Painted', NULL, NULL, 'Home Temple, Pooja Room', 10000.00, 15000.00, 'In Stock', 4.6, '{"Brand":"Vaishnavi","Material":"White Marble","Type":"Hand-Carved & Painted","Color":"Multicolor","Height":"1.5 ft","Finish":"Polished","Warranty":"Lifetime"}', false, 2)
) AS v(subcat_slug, name, slug, description, image_url, brand, material, size, thickness, finish, color, design, coverage_per_box, pieces_per_box, suitable_for, price, mrp, stock_status, rating, specs, is_featured, display_order)
JOIN subcategories s ON s.slug = v.subcat_slug
ON CONFLICT (subcategory_id, slug) DO NOTHING;

-- Products for Marble Home Interiors
INSERT INTO products (subcategory_id, name, slug, description, image_url, brand, material, size, thickness, finish, color, design, coverage_per_box, pieces_per_box, suitable_for, price, mrp, stock_status, rating, specs, is_featured, display_order)
SELECT s.id, v.name, v.slug, v.description, v.image_url, v.brand, v.material, v.size, v.thickness, v.finish, v.color, v.design, v.coverage_per_box, v.pieces_per_box, v.suitable_for, v.price, v.mrp, v.stock_status, v.rating, v.specs::jsonb, v.is_featured, v.display_order
FROM (VALUES
  ('marble-mandir', 'Carved Marble Mandir', 'carved-marble-mandir', 'Exquisitely carved marble mandir for home temple. Features intricate pillar carvings and dome design.', 'https://images.pexels.com/photos/37431602/pexels-photo-37431602.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Vaishnavi', 'White Marble', '4x3 ft', NULL, 'Polished', 'White', 'Hand-Carved', NULL, NULL, 'Home Temple, Pooja Room', 85000.00, 125000.00, 'In Stock', 5.0, '{"Brand":"Vaishnavi","Material":"White Marble","Type":"Hand-Carved Mandir","Color":"White","Size":"4x3 ft","Finish":"Polished","Warranty":"Lifetime"}', true, 1),
  ('marble-mandir', 'Small Marble Mandir', 'small-marble-mandir', 'Compact marble mandir for smaller pooja spaces. Beautifully carved with traditional designs.', 'https://images.pexels.com/photos/37431602/pexels-photo-37431602.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Vaishnavi', 'White Marble', '2x1.5 ft', NULL, 'Polished', 'White', 'Hand-Carved', NULL, NULL, 'Home Temple, Pooja Room', 35000.00, 50000.00, 'In Stock', 4.7, '{"Brand":"Vaishnavi","Material":"White Marble","Type":"Hand-Carved Mandir","Color":"White","Size":"2x1.5 ft","Finish":"Polished","Warranty":"Lifetime"}', false, 2),
  ('marble-mandir', 'Designer Marble Mandir with Dome', 'designer-marble-mandir-dome', 'Large designer marble mandir with intricate dome carvings and pillar work. A centerpiece for your pooja room.', 'https://images.pexels.com/photos/37431602/pexels-photo-37431602.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Vaishnavi', 'White Marble', '5x4 ft', NULL, 'Polished', 'White & Gold', 'Hand-Carved Designer', NULL, NULL, 'Home Temple, Pooja Room', 150000.00, 220000.00, 'In Stock', 5.0, '{"Brand":"Vaishnavi","Material":"White Marble","Type":"Hand-Carved Designer Mandir","Color":"White & Gold","Size":"5x4 ft","Finish":"Polished","Warranty":"Lifetime"}', true, 3),
  ('marble-fireplace', 'Carved Marble Fireplace', 'carved-marble-fireplace', 'Luxurious carved marble fireplace for elegant home interiors. Features intricate detailing and premium finish.', 'https://images.pexels.com/photos/18362066/pexels-photo-18362066.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Vaishnavi', 'White Marble', '5x4 ft', NULL, 'Polished', 'White', 'Hand-Carved', NULL, NULL, 'Living Room, Interior', 95000.00, 140000.00, 'In Stock', 4.9, '{"Brand":"Vaishnavi","Material":"White Marble","Type":"Hand-Carved Fireplace","Color":"White","Size":"5x4 ft","Finish":"Polished","Warranty":"Lifetime"}', true, 1),
  ('marble-fireplace', 'Modern Marble Fireplace Surround', 'modern-marble-fireplace-surround', 'Modern marble fireplace surround with clean lines and contemporary design. Premium white marble construction.', 'https://images.pexels.com/photos/18362066/pexels-photo-18362066.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Vaishnavi', 'White Marble', '4x3 ft', NULL, 'Polished', 'White', 'Modern', NULL, NULL, 'Living Room, Interior', 65000.00, 95000.00, 'In Stock', 4.7, '{"Brand":"Vaishnavi","Material":"White Marble","Type":"Modern Fireplace Surround","Color":"White","Size":"4x3 ft","Finish":"Polished","Warranty":"Lifetime"}', false, 2)
) AS v(subcat_slug, name, slug, description, image_url, brand, material, size, thickness, finish, color, design, coverage_per_box, pieces_per_box, suitable_for, price, mrp, stock_status, rating, specs, is_featured, display_order)
JOIN subcategories s ON s.slug = v.subcat_slug
ON CONFLICT (subcategory_id, slug) DO NOTHING;