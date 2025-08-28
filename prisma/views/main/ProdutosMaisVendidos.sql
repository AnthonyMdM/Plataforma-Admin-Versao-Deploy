SELECT
  vp.produtoId,
  p.Nome AS nome,
  p.unidadePesagem,
  CAST(SUM(vp.quantidade) AS INTEGER) AS total_vendido,
  CAST(SUM(vp.preco_produto_totaltotal) AS INTEGER) AS valor_total
FROM
  venda_produto AS vp
  JOIN Produto AS p ON p.id = vp.produtoId
GROUP BY
  vp.produtoId;