export default function Header() {
  return (
    <nav className="pt-5 bg-white">
      <ul className="flex text-lg items-center justify-evenly w-full group gap-10 [&_li:hover]:opacity-75 [&_li]:cursor-pointer **:text-black **:font-roboto **:font-medium">
        <li>
          <p>Resumo Ano</p>
        </li>
        <li>
          <p>Projeção por Dia</p>
        </li>
        <li>
          <p>Projeção por Semana</p>
        </li>
        <li>
          <p>Projeção por Mês</p>
        </li>
      </ul>
    </nav>
  );
}
