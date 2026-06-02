-- Execute este SQL no Supabase apenas se quiser salvar TODOS os campos da tela cadastrar-loja.html.
-- A rota funciona sem isso, mas sem estas colunas o backend salva somente os campos básicos da loja.

ALTER TABLE lojas
ADD COLUMN IF NOT EXISTS razao_social TEXT,
ADD COLUMN IF NOT EXISTS porte TEXT,
ADD COLUMN IF NOT EXISTS data_fundacao DATE,
ADD COLUMN IF NOT EXISTS segmento TEXT,
ADD COLUMN IF NOT EXISTS cnae TEXT,
ADD COLUMN IF NOT EXISTS site TEXT,
ADD COLUMN IF NOT EXISTS telefone TEXT,
ADD COLUMN IF NOT EXISTS whatsapp TEXT,
ADD COLUMN IF NOT EXISTS responsavel_legal TEXT,
ADD COLUMN IF NOT EXISTS cargo_responsavel TEXT,
ADD COLUMN IF NOT EXISTS cpf_responsavel TEXT,
ADD COLUMN IF NOT EXISTS email_corporativo TEXT,
ADD COLUMN IF NOT EXISTS gestor_operacional TEXT,
ADD COLUMN IF NOT EXISTS email_gestor TEXT,
ADD COLUMN IF NOT EXISTS cep TEXT,
ADD COLUMN IF NOT EXISTS logradouro TEXT,
ADD COLUMN IF NOT EXISTS numero TEXT,
ADD COLUMN IF NOT EXISTS complemento TEXT,
ADD COLUMN IF NOT EXISTS bairro TEXT,
ADD COLUMN IF NOT EXISTS cidade TEXT,
ADD COLUMN IF NOT EXISTS area_atuacao TEXT,
ADD COLUMN IF NOT EXISTS modelo_operacao TEXT,
ADD COLUMN IF NOT EXISTS quantidade_usuarios TEXT,
ADD COLUMN IF NOT EXISTS volume_mensal TEXT,
ADD COLUMN IF NOT EXISTS banco TEXT,
ADD COLUMN IF NOT EXISTS agencia TEXT,
ADD COLUMN IF NOT EXISTS conta_bancaria TEXT,
ADD COLUMN IF NOT EXISTS titular_conta TEXT,
ADD COLUMN IF NOT EXISTS pix TEXT,
ADD COLUMN IF NOT EXISTS banner_url TEXT,
ADD COLUMN IF NOT EXISTS sobre_loja TEXT,
ADD COLUMN IF NOT EXISTS slug TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS lojas_slug_unique ON lojas(slug) WHERE slug IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS lojas_cnpj_unique ON lojas(cnpj) WHERE cnpj IS NOT NULL;
