SELECT
  v.id,
  u."Name",
  v.data,
  p."Nome" AS nome_produto,
  vp.preco_unitario AS preco,
  p."unidadePesagem",
  vp.quantidade,
  vp.preco_produto_totaltotal
FROM
  (
    (
      (
        "Venda" v
        JOIN "User" u ON ((u.id = v."userId"))
      )
      JOIN venda_produto vp ON ((vp."vendaId" = v.id))
    )
    JOIN "Produto" p ON ((p.id = vp."produtoId"))
  )
ORDER BY
  v.data DESC;