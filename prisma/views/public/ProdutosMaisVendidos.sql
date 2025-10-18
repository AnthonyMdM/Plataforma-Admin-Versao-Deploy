SELECT
  vp."produtoId",
  p."Nome" AS nome,
  p."unidadePesagem",
  sum(vp.quantidade) AS total_vendido,
  sum(vp.preco_produto_totaltotal) AS valor_total
FROM
  (
    venda_produto vp
    JOIN "Produto" p ON ((p.id = vp."produtoId"))
  )
GROUP BY
  vp."produtoId",
  p."Nome",
  p."unidadePesagem";