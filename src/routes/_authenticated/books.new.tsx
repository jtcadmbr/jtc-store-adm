import { createFileRoute } from "@tanstack/react-router";
import { ItemForm } from "@/components/item-form";

export const Route = createFileRoute("/_authenticated/books/new")({
  component: NewBookPage,
});

function NewBookPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <header>
        <p className="font-mono text-[11px] uppercase tracking-widest text-primary">Publicação</p>
        <h1 className="text-3xl md:text-4xl font-display font-semibold mt-2">Novo livro</h1>
        <p className="text-muted-foreground mt-1">Capa, arquivo e prints da loja.</p>
      </header>
      <ItemForm kind="book" onDoneRedirect="/books" />
    </div>
  );
}
