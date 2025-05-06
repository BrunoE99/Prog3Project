export default function ReviewLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
      <div>
        <h1>Review's layout</h1>

        <div>{children}</div>
      </div>
    );
  }