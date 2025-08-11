export default function SideBar() {
  return (
    <div className="bg-amber-950 gap-5 w-50 min-h-screen">
      <p className="text-white mb-4">Hamburguer</p>
      <ul className="font-poppins flex flex-col gap-2 items-center [&_li]:cursor-pointer [&_li]:p-2 [&_li]:rounded [&_li:hover]:bg-blue-100 [&_li]:transition-colors **:text-white **:w-full text-center">
        <li>
          <p>Foto</p>
        </li>
        <li>
          <p>Home</p>
        </li>
        <li>
          <p>Perfil</p>
        </li>
        <li>
          <p>Página de Análise</p>
        </li>
      </ul>
    </div>
  );
}
