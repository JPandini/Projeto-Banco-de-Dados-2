CREATE PROCEDURE sp_ResumoPorModelo
    @Modelo VARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        V.modelo AS Modelo_Veiculo,
        V.placa AS Placa,
        SUM(O.orcamento) AS Custo_Total,
        SUM(SR.tempo_gasto) AS Tempo_Total_Horas
    FROM
        veiculos V
    JOIN
        ordens_servico O ON V.id_veiculo = O.id_veiculo
    JOIN
        servicos_realizados SR ON O.id_ordem = SR.id_ordem
    WHERE
        V.modelo = @Modelo
    GROUP BY
        V.modelo, V.placa;
END;
