CREATE FUNCTION fn_PecasNaoUsadas()
RETURNS TABLE
AS
RETURN
(
    SELECT
        P.descricao AS Peca_Em_Estoque_Nao_Usada,
        P.estoque
    FROM
        pecas P
    LEFT JOIN
        itens_peca IP ON P.id_peca = IP.id_peca
    WHERE
        IP.id_peca IS NULL
        AND P.estoque > 0
);
