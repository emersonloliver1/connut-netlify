-- Update the foreign key constraint to cascade delete
ALTER TABLE stock_movements
DROP CONSTRAINT stock_movements_product_id_fkey,
ADD CONSTRAINT stock_movements_product_id_fkey
  FOREIGN KEY (product_id)
  REFERENCES products(id)
  ON DELETE CASCADE;