-- Adicionar a tabela de clientes
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    document VARCHAR(18) UNIQUE,
    email VARCHAR(255),
    phone VARCHAR(15),
    birth_date DATE,
    cep VARCHAR(9),
    street TEXT,
    city VARCHAR(100),
    state VARCHAR(2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Trigger para atualização automática do updated_at
CREATE TRIGGER update_clients_updated_at
    BEFORE UPDATE ON clients
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Política RLS para clientes
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view clients from their establishment"
    ON clients FOR SELECT
    USING (
        EXISTS (
            SELECT 1 
            FROM profiles 
            WHERE profiles.id = auth.uid()
        )
    );

CREATE POLICY "Users can insert clients"
    ON clients FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 
            FROM profiles 
            WHERE profiles.id = auth.uid()
        )
    );

CREATE POLICY "Users can update clients"
    ON clients FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 
            FROM profiles 
            WHERE profiles.id = auth.uid()
        )
    );

CREATE POLICY "Users can delete clients"
    ON clients FOR DELETE
    USING (
        EXISTS (
            SELECT 1 
            FROM profiles 
            WHERE profiles.id = auth.uid()
        )
    );