export default function Footer() {
  return (
    <footer className="border-t">
      <div className="container py-8 text-center text-xs text-foreground/60">
        <span>&copy; {new Date().getFullYear()} Nairabuild</span>
      </div>
    </footer>
  );
}
