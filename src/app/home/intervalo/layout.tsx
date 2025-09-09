export default function FiltroLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <div className="relative">
      <div>{children}</div>
      <div>{modal}</div>
    </div>
  );
}
