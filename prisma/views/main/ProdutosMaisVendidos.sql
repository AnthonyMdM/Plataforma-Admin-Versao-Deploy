SELECT
  p.id AS produtoId,
  p.Nome AS nome,
  p.unidadePesagem AS unidadePesagem,
  SUM(vp.quantidade) AS total_vendido,
  SUM(vp.preco_produto_totaltotal) AS valor_total
FROM
  Produto AS p
  JOIN venda_produto AS vp ON vp.produtoId = p.id
GROUP BY
  p.id,
  p.Nome,
  p.unidadePesagem
ORDER BY
  total_vendido DESC;