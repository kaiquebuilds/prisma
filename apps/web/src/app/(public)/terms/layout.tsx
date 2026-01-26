export default function MdxLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="md:max-w-4/12 max-w-10/12 my-24 m-auto prose dark:prose-invert">
      {children}
    </div>
  );
}
