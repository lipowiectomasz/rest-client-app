export default function Box({
  children,
  className,
}: Readonly<{
  children: React.ReactNode;
  className?: string;
}>) {
  const defaultClasses =
    'flex flex-col gap-3 w-full px-4 min-h-100 sm:mt-[15vmax] md:mt-[10vmax] dark:bg-slate-800 bg-slate-50 rounded-t-lg inset-shadow-sm inset-shadow-slate-300 dark:inset-shadow-gray-600';
  return <section className={`${defaultClasses} ${className ?? ''}`}>{children}</section>;
}
