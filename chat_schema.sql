-- ============================================================
-- LearnWave — Script de Chat
-- Cria as tabelas: conversas e mensagens
-- ============================================================

-- Tabela de conversas (par professor <-> aluno)
CREATE TABLE IF NOT EXISTS conversas (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    professor_id BIGINT NOT NULL,
    aluno_id     BIGINT NOT NULL,
    criada_em   DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_conversa_professor FOREIGN KEY (professor_id) REFERENCES usuarios(id),
    CONSTRAINT fk_conversa_aluno     FOREIGN KEY (aluno_id)     REFERENCES usuarios(id),
    CONSTRAINT uq_conversa           UNIQUE (professor_id, aluno_id)
);

-- Tabela de mensagens
CREATE TABLE IF NOT EXISTS mensagens (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    conversa_id   BIGINT       NOT NULL,
    remetente_id  BIGINT       NOT NULL,
    conteudo      TEXT         NOT NULL,
    enviada_em    DATETIME     DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_mensagem_conversa  FOREIGN KEY (conversa_id)  REFERENCES conversas(id) ON DELETE CASCADE,
    CONSTRAINT fk_mensagem_remetente FOREIGN KEY (remetente_id) REFERENCES usuarios(id)
);

-- Índices para acelerar buscas comuns
CREATE INDEX idx_mensagens_conversa ON mensagens(conversa_id, enviada_em);
