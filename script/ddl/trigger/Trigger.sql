CREATE TRIGGER trg_EstoqueBaixo
ON pecas
AFTER INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;


    INSERT INTO alertas_estoque (id_peca, descricao, estoque_atual)
    SELECT 
        i.id_peca,
        i.descricao,
        i.estoque
    FROM inserted AS i
    WHERE i.estoque < 30;
END;
