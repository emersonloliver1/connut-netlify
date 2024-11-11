-- Create products table
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users NOT NULL,
    code TEXT NOT NULL,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    unit TEXT NOT NULL,
    min_stock NUMERIC(10,2) NOT NULL DEFAULT 0,
    current_stock NUMERIC(10,2) NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create stock_movements table
CREATE TABLE IF NOT EXISTS stock_movements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users NOT NULL,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('in', 'out')),
    quantity NUMERIC(10,2) NOT NULL,
    unit_price NUMERIC(10,2),
    notes TEXT,
    movement_date TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_products_user_id ON products(user_id);
CREATE INDEX IF NOT EXISTS idx_products_code ON products(code);
CREATE INDEX IF NOT EXISTS idx_stock_movements_user_id ON stock_movements(user_id);
CREATE INDEX IF NOT EXISTS idx_stock_movements_product_id ON stock_movements(product_id);
CREATE INDEX IF NOT EXISTS idx_stock_movements_type ON stock_movements(type);
CREATE INDEX IF NOT EXISTS idx_stock_movements_date ON stock_movements(movement_date);

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_movements ENABLE ROW LEVEL SECURITY;

-- Create policies for products
CREATE POLICY "Users can view their own products"
    ON products FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own products"
    ON products FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own products"
    ON products FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own products"
    ON products FOR DELETE
    USING (auth.uid() = user_id);

-- Create policies for stock_movements
CREATE POLICY "Users can view their own stock movements"
    ON stock_movements FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own stock movements"
    ON stock_movements FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own stock movements"
    ON stock_movements FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own stock movements"
    ON stock_movements FOR DELETE
    USING (auth.uid() = user_id);

-- Create function to update current_stock
CREATE OR REPLACE FUNCTION update_product_stock()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        IF NEW.type = 'in' THEN
            UPDATE products 
            SET current_stock = current_stock + NEW.quantity
            WHERE id = NEW.product_id;
        ELSE
            UPDATE products 
            SET current_stock = current_stock - NEW.quantity
            WHERE id = NEW.product_id;
        END IF;
    ELSIF TG_OP = 'DELETE' THEN
        IF OLD.type = 'in' THEN
            UPDATE products 
            SET current_stock = current_stock - OLD.quantity
            WHERE id = OLD.product_id;
        ELSE
            UPDATE products 
            SET current_stock = current_stock + OLD.quantity
            WHERE id = OLD.product_id;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for stock movements
CREATE TRIGGER stock_movement_insert
    AFTER INSERT ON stock_movements
    FOR EACH ROW
    EXECUTE FUNCTION update_product_stock();

CREATE TRIGGER stock_movement_delete
    AFTER DELETE ON stock_movements
    FOR EACH ROW
    EXECUTE FUNCTION update_product_stock();