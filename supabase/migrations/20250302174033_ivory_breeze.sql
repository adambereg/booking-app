/*
  # Initial schema for StayEasy booking platform

  1. New Tables
    - `profiles` - User profile information
    - `properties` - Property listings
    - `property_images` - Images for properties
    - `property_amenities` - Amenities for properties
    - `bookings` - Booking information
    - `reviews` - User reviews for properties
  
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name text,
  last_name text,
  avatar_url text,
  phone text,
  address text,
  city text,
  state text,
  zip_code text,
  country text,
  bio text,
  is_host boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Create properties table
CREATE TABLE IF NOT EXISTS properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  property_type text NOT NULL,
  address text NOT NULL,
  city text NOT NULL,
  state text NOT NULL,
  zip_code text NOT NULL,
  country text NOT NULL,
  price_per_night integer NOT NULL,
  bedrooms integer NOT NULL,
  beds integer NOT NULL,
  bathrooms numeric NOT NULL,
  max_guests integer NOT NULL,
  latitude numeric,
  longitude numeric,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active properties"
  ON properties
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Hosts can read their own properties"
  ON properties
  FOR SELECT
  TO authenticated
  USING (owner_id = auth.uid());

CREATE POLICY "Hosts can insert their own properties"
  ON properties
  FOR INSERT
  TO authenticated
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Hosts can update their own properties"
  ON properties
  FOR UPDATE
  TO authenticated
  USING (owner_id = auth.uid());

CREATE POLICY "Hosts can delete their own properties"
  ON properties
  FOR DELETE
  TO authenticated
  USING (owner_id = auth.uid());

-- Create property_images table
CREATE TABLE IF NOT EXISTS property_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid REFERENCES properties(id) ON DELETE CASCADE NOT NULL,
  url text NOT NULL,
  is_primary boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE property_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read property images"
  ON property_images
  FOR SELECT
  USING (true);

CREATE POLICY "Hosts can insert images for their properties"
  ON property_images
  FOR INSERT
  TO authenticated
  WITH CHECK (
    property_id IN (
      SELECT id FROM properties WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "Hosts can update images for their properties"
  ON property_images
  FOR UPDATE
  TO authenticated
  USING (
    property_id IN (
      SELECT id FROM properties WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "Hosts can delete images for their properties"
  ON property_images
  FOR DELETE
  TO authenticated
  USING (
    property_id IN (
      SELECT id FROM properties WHERE owner_id = auth.uid()
    )
  );

-- Create property_amenities table
CREATE TABLE IF NOT EXISTS property_amenities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid REFERENCES properties(id) ON DELETE CASCADE NOT NULL,
  amenity text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(property_id, amenity)
);

ALTER TABLE property_amenities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read property amenities"
  ON property_amenities
  FOR SELECT
  USING (true);

CREATE POLICY "Hosts can insert amenities for their properties"
  ON property_amenities
  FOR INSERT
  TO authenticated
  WITH CHECK (
    property_id IN (
      SELECT id FROM properties WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "Hosts can update amenities for their properties"
  ON property_amenities
  FOR UPDATE
  TO authenticated
  USING (
    property_id IN (
      SELECT id FROM properties WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "Hosts can delete amenities for their properties"
  ON property_amenities
  FOR DELETE
  TO authenticated
  USING (
    property_id IN (
      SELECT id FROM properties WHERE owner_id = auth.uid()
    )
  );

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid REFERENCES properties(id) ON DELETE CASCADE NOT NULL,
  guest_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  check_in_date date NOT NULL,
  check_out_date date NOT NULL,
  guests integer NOT NULL,
  total_price integer NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT check_dates CHECK (check_out_date > check_in_date)
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Guests can read their own bookings"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (guest_id = auth.uid());

CREATE POLICY "Hosts can read bookings for their properties"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (
    property_id IN (
      SELECT id FROM properties WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "Guests can insert their own bookings"
  ON bookings
  FOR INSERT
  TO authenticated
  WITH CHECK (guest_id = auth.uid());

CREATE POLICY "Guests can update their own bookings"
  ON bookings
  FOR UPDATE
  TO authenticated
  USING (guest_id = auth.uid());

CREATE POLICY "Hosts can update bookings for their properties"
  ON bookings
  FOR UPDATE
  TO authenticated
  USING (
    property_id IN (
      SELECT id FROM properties WHERE owner_id = auth.uid()
    )
  );

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid REFERENCES properties(id) ON DELETE CASCADE NOT NULL,
  booking_id uuid REFERENCES bookings(id) ON DELETE CASCADE NOT NULL,
  reviewer_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(booking_id)
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read reviews"
  ON reviews
  FOR SELECT
  USING (true);

CREATE POLICY "Guests can insert reviews for their bookings"
  ON reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (
    reviewer_id = auth.uid() AND
    booking_id IN (
      SELECT id FROM bookings 
      WHERE guest_id = auth.uid() AND status = 'completed'
    )
  );

CREATE POLICY "Guests can update their own reviews"
  ON reviews
  FOR UPDATE
  TO authenticated
  USING (reviewer_id = auth.uid());

CREATE POLICY "Guests can delete their own reviews"
  ON reviews
  FOR DELETE
  TO authenticated
  USING (reviewer_id = auth.uid());

-- Create function to create a profile after signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id)
  VALUES (new.id);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to call the function after signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to check for booking conflicts
CREATE OR REPLACE FUNCTION check_booking_availability(
  property_id_param uuid,
  check_in_date_param date,
  check_out_date_param date
) RETURNS boolean AS $$
DECLARE
  conflicts integer;
BEGIN
  SELECT COUNT(*)
  INTO conflicts
  FROM bookings
  WHERE 
    property_id = property_id_param AND
    status IN ('confirmed', 'pending') AND
    (
      (check_in_date <= check_in_date_param AND check_out_date > check_in_date_param) OR
      (check_in_date < check_out_date_param AND check_out_date >= check_out_date_param) OR
      (check_in_date >= check_in_date_param AND check_out_date <= check_out_date_param)
    );
    
  RETURN conflicts = 0;
END;
$$ LANGUAGE plpgsql;