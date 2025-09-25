import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, BookOpen } from 'lucide-react';
import { bookContent } from '@/data/bookContent';

const BonusBook: React.FC = () => {
  const { bookId } = useParams<{ bookId: string }>();
  const navigate = useNavigate();
  
  const book = bookContent.bonusBooks.find(b => b.id === bookId);
  
  if (!book) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-muted-foreground">
          Bônus não encontrado
        </h2>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <Button
        variant="ghost"
        onClick={() => navigate('/app')}
        className="mb-4 hover:bg-primary/10"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Voltar ao Início
      </Button>

      <Card className="p-8 bg-gradient-to-br from-card to-secondary/5 border-secondary/20">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">{book.icon}</div>
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
            {book.title}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {book.description}
          </p>
        </div>

        <div className="flex justify-center gap-4">
          <Button className="bg-gradient-to-r from-secondary to-secondary/80 hover:opacity-90">
            <BookOpen className="h-4 w-4 mr-2" />
            Ler Agora
          </Button>
          <Button 
            variant="outline" 
            className="hover:bg-secondary/10 hover:border-secondary"
            onClick={() => {
              if (book.pdfUrl) {
                const link = document.createElement('a');
                link.href = book.pdfUrl;
                link.download = `${book.title}.pdf`;
                link.click();
              }
            }}
            disabled={!book.pdfUrl}
            data-testid="button-download-pdf"
          >
            <Download className="h-4 w-4 mr-2" />
            Baixar PDF
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default BonusBook;