SELECT
  v.id,
  u.Name,
  v.data,
  p.nome_produto,
  p.preco,
  p.unidadePesagem,
  vp.quantidade,
  vp.preco_produto_totaltotal
FROM
  User AS u
  JOIN Venda AS v ON v.userId = u.id
  JOIN venda_produto AS vp ON vp.vendaId = v.id
  JOIN Produto AS p ON p.id = vp.produtoId;