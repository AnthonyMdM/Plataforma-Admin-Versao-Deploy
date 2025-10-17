SELECT
  v.id AS id,
  u.Name AS Name,
  v.data AS data,
  p.Nome AS nome_produto,
  p.preco AS preco,
  p.unidadePesagem AS unidadePesagem,
  vp.quantidade AS quantidade,
  vp.preco_produto_totaltotal AS preco_produto_totaltotal
FROM
  Venda AS v
  JOIN User AS u ON v.userId = u.id
  JOIN venda_produto AS vp ON vp.vendaId = v.id
  JOIN Produto AS p ON p.id = vp.produtoId
ORDER BY
  v.data DESC;