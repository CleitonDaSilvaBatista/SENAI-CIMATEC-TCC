CREATE DATABASE if not exists jobee;
USE jobee;

-- ==========================================================
-- 0. TABELAS DE REFERÊNCIA
-- ==========================================================

CREATE TABLE tipos_usuario (
    id_tipo_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL UNIQUE
);

INSERT INTO tipos_usuario (nome)
VALUES ('cliente'), ('empreendedor'), ('admin');

CREATE TABLE tipos_endereco (
    id_tipo_endereco INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL UNIQUE
);

INSERT INTO tipos_endereco (nome)
VALUES ('residencial'), ('comercial');

CREATE TABLE tipos_item (
    id_tipo_item INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL UNIQUE
);

INSERT INTO tipos_item (nome)
VALUES ('produto'), ('servico');

CREATE TABLE formas_pagamento (
    id_forma_pagamento INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL UNIQUE
);

INSERT INTO formas_pagamento (nome)
VALUES ('cartao'), ('pix'), ('dinheiro');

CREATE TABLE status_pedido (
    id_status INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL UNIQUE
);

INSERT INTO status_pedido (nome)
VALUES ('pendente'), ('em andamento'), ('concluido'), ('cancelado');

CREATE TABLE status_suporte (
    id_status_suporte INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL UNIQUE
);

INSERT INTO status_suporte (nome)
VALUES ('aberto'), ('em andamento'), ('resolvido');

CREATE TABLE status_pagamento (
    id_status_pagamento INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL UNIQUE
);

INSERT INTO status_pagamento (nome)
VALUES ('pendente'), ('confirmado'), ('falhou');

-- ==========================================================
-- 1. USUÁRIOS E ENDEREÇOS
-- ==========================================================

CREATE TABLE usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    id_tipo_usuario INT NOT NULL,
    nome VARCHAR(120) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    senha_hash VARCHAR(255) NOT NULL,
    telefone VARCHAR(20),
    data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP,
    ativo BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (id_tipo_usuario) REFERENCES tipos_usuario(id_tipo_usuario)
        ON UPDATE CASCADE
);

CREATE TABLE enderecos (
    id_endereco INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_tipo_endereco INT NOT NULL,
    logradouro VARCHAR(150) NOT NULL,
    numero VARCHAR(20),
    bairro VARCHAR(100),
    cidade VARCHAR(100),
    estado CHAR(2),
    cep VARCHAR(10),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (id_tipo_endereco) REFERENCES tipos_endereco(id_tipo_endereco)
        ON UPDATE CASCADE
);

-- ==========================================================
-- 2. LOJAS
-- ==========================================================

CREATE TABLE lojas (
    id_loja INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    nome_fantasia VARCHAR(120) NOT NULL,
    descricao VARCHAR(150),
    cnpj VARCHAR(20),
    imagem_url VARCHAR(255),
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    ativo BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
        ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE categorias_loja (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao VARCHAR(150)
);

CREATE TABLE lojas_categorias (
    id_loja INT NOT NULL,
    id_categoria INT NOT NULL,
    PRIMARY KEY (id_loja, id_categoria),
    FOREIGN KEY (id_loja) REFERENCES lojas(id_loja)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (id_categoria) REFERENCES categorias_loja(id_categoria)
        ON DELETE CASCADE ON UPDATE CASCADE
);

-- ==========================================================
-- 3. ITENS (PRODUTOS E SERVIÇOS)
-- ==========================================================

CREATE TABLE itens (
    id_item INT AUTO_INCREMENT PRIMARY KEY,
    id_loja INT NOT NULL,
    id_tipo_item INT NOT NULL,
    nome VARCHAR(120) NOT NULL,
    descricao VARCHAR(150),
    preco DECIMAL(10,2) NOT NULL CHECK (preco >= 0),
    imagem_url VARCHAR(255),
    estoque INT DEFAULT 0,
    duracao_minutos INT DEFAULT NULL,
    ativo BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (id_loja) REFERENCES lojas(id_loja)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (id_tipo_item) REFERENCES tipos_item(id_tipo_item)
        ON UPDATE CASCADE
);

CREATE TABLE categorias_item (
    id_categoria_item INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    id_tipo_item INT NOT NULL,
    FOREIGN KEY (id_tipo_item) REFERENCES tipos_item(id_tipo_item)
        ON UPDATE CASCADE
);

CREATE TABLE itens_categorias (
    id_item INT NOT NULL,
    id_categoria_item INT NOT NULL,
    PRIMARY KEY (id_item, id_categoria_item),
    FOREIGN KEY (id_item) REFERENCES itens(id_item)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (id_categoria_item) REFERENCES categorias_item(id_categoria_item)
        ON DELETE CASCADE ON UPDATE CASCADE
);

-- ==========================================================
-- 4. PEDIDOS E PAGAMENTOS
-- ==========================================================

CREATE TABLE pedidos (
    id_pedido INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente INT NOT NULL,
    id_loja INT NOT NULL,
    id_endereco_entrega INT NULL,
    id_status INT NOT NULL,
    id_forma_pagamento INT NOT NULL,
    data_pedido DATETIME DEFAULT CURRENT_TIMESTAMP,
    valor_total DECIMAL(10,2) NOT NULL CHECK (valor_total >= 0),
    FOREIGN KEY (id_cliente) REFERENCES usuarios(id_usuario)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (id_loja) REFERENCES lojas(id_loja)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (id_endereco_entrega) REFERENCES enderecos(id_endereco)
        ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (id_status) REFERENCES status_pedido(id_status)
        ON UPDATE CASCADE,
    FOREIGN KEY (id_forma_pagamento) REFERENCES formas_pagamento(id_forma_pagamento)
        ON UPDATE CASCADE
);

CREATE TABLE itens_pedido (
    id_item_pedido INT AUTO_INCREMENT PRIMARY KEY,
    id_pedido INT NOT NULL,
    id_item INT NOT NULL,
    quantidade INT NOT NULL CHECK (quantidade > 0),
    preco_unitario DECIMAL(10,2) NOT NULL CHECK (preco_unitario >= 0),
    FOREIGN KEY (id_pedido) REFERENCES pedidos(id_pedido)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (id_item) REFERENCES itens(id_item)
        ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE pagamentos (
    id_pagamento INT AUTO_INCREMENT PRIMARY KEY,
    id_pedido INT NOT NULL,
    id_forma_pagamento INT NOT NULL,
    id_status_pagamento INT NOT NULL,
    valor DECIMAL(10,2) NOT NULL CHECK (valor >= 0),
    data_pagamento DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_pedido) REFERENCES pedidos(id_pedido)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (id_forma_pagamento) REFERENCES formas_pagamento(id_forma_pagamento)
        ON UPDATE CASCADE,
    FOREIGN KEY (id_status_pagamento) REFERENCES status_pagamento(id_status_pagamento)
        ON UPDATE CASCADE
);

-- ==========================================================
-- 5. AVALIAÇÕES E SUPORTE
-- ==========================================================

CREATE TABLE avaliacoes (
    id_avaliacao INT AUTO_INCREMENT PRIMARY KEY,
    id_item INT NOT NULL,
    id_cliente INT NOT NULL,
    nota INT NOT NULL CHECK (nota BETWEEN 1 AND 5),
    comentario VARCHAR(150),
    data_avaliacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_item) REFERENCES itens(id_item)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (id_cliente) REFERENCES usuarios(id_usuario)
        ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE mensagens_suporte (
    id_mensagem INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    assunto VARCHAR(150) NOT NULL,
    mensagem VARCHAR(150) NOT NULL,
    id_status_suporte INT NOT NULL,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (id_status_suporte) REFERENCES status_suporte(id_status_suporte)
        ON UPDATE CASCADE
);

-- ==========================================================
-- TRIGGERS E ETC
-- ==========================================================

DELIMITER $$

CREATE TRIGGER trg_diminuir_estoque_apos_pedido
AFTER INSERT ON itens_pedido
FOR EACH ROW
BEGIN
    UPDATE itens
    SET estoque = estoque - NEW.quantidade
    WHERE id_item = NEW.id_item
      AND estoque >= NEW.quantidade;
END$$

DELIMITER ;

DELIMITER $$

CREATE TRIGGER trg_repor_estoque_pedido_cancelado
AFTER UPDATE ON pedidos
FOR EACH ROW
BEGIN
    DECLARE status_cancelado_id INT;
    SELECT id_status INTO status_cancelado_id
    FROM status_pedido
    WHERE nome = 'cancelado'
    LIMIT 1;

    IF NEW.id_status = status_cancelado_id AND OLD.id_status <> status_cancelado_id THEN
        UPDATE itens i
        JOIN itens_pedido ip ON i.id_item = ip.id_item
        SET i.estoque = i.estoque + ip.quantidade
        WHERE ip.id_pedido = NEW.id_pedido;
    END IF;
END$$

DELIMITER ;
