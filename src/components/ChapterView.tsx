import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, ArrowRight, Clock, CheckCircle, ListChecks, Lightbulb, Heart, Target } from 'lucide-react';
import { Chapter } from '@/types';
interface ChapterViewProps {
  chapter: Chapter;
  nextChapterId?: string;
  prevChapterId?: string;
}
const ChapterView: React.FC<ChapterViewProps> = ({
  chapter,
  nextChapterId,
  prevChapterId
}) => {
  const navigate = useNavigate();
  const getIconForSectionType = (type?: string) => {
    switch (type) {
      case 'list':
        return <ListChecks className="h-5 w-5" />;
      case 'tips':
        return <Lightbulb className="h-5 w-5" />;
      case 'exercise':
        return <Target className="h-5 w-5" />;
      default:
        return <CheckCircle className="h-5 w-5" />;
    }
  };
  return <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <Button variant="ghost" onClick={() => navigate('/app')} className="mb-4 hover:bg-primary/10">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar ao Início
        </Button>
        
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          {chapter.title}
        </h1>
        {chapter.subtitle && <p className="text-lg text-muted-foreground">{chapter.subtitle}</p>}
        
        <div className="flex items-center gap-4 mt-4">
          
        </div>
      </div>

      {/* Content */}
      <Card className="p-8 bg-card/95 backdrop-blur-sm border-primary/10">
        {/* Main content */}
        <div className="prose prose-lg max-w-none">
          {chapter.content.split('\n\n').map((paragraph, index) => <p key={index} className="text-foreground mb-4 leading-relaxed">
              {paragraph}
            </p>)}
        </div>

        {/* Images */}
        {chapter.images && chapter.images.length > 0 && <>
            <Separator className="my-8" />
            <div className="grid md:grid-cols-2 gap-6">
              {chapter.images.map((image, index) => <div key={index} className="rounded-lg overflow-hidden shadow-lg">
                  <img src={image} alt={`Ilustração ${index + 1}`} className="w-full h-auto object-cover" />
                </div>)}
            </div>
          </>}

        {/* Sections */}
        {chapter.sections && chapter.sections.length > 0 && <>
            <Separator className="my-8" />
            <div className="space-y-6">
              {chapter.sections.map(section => <Card key={section.id} className="p-6 bg-gradient-to-r from-background to-primary/5 border-primary/20">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center text-primary-foreground">
                      {getIconForSectionType(section.type)}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">{section.title}</h3>
                      {section.content && <p className="text-muted-foreground mb-4">{section.content}</p>}
                    </div>
                  </div>
                  
                  {section.items && <ul className="space-y-3">
                      {section.items.map((item, index) => <li key={index} className="flex items-start gap-3">
                          <Heart className="h-4 w-4 text-secondary mt-1 flex-shrink-0" />
                          <span className="text-foreground">{item}</span>
                        </li>)}
                    </ul>}
                </Card>)}
            </div>
          </>}
      </Card>

      {/* Navigation */}
      <div className="flex justify-between items-center mt-8">
        {prevChapterId ? <Button variant="outline" onClick={() => navigate(`/app/${prevChapterId}`)} className="hover:bg-primary/10 hover:border-primary">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Capítulo Anterior
          </Button> : <div />}
        
        {nextChapterId && <Button onClick={() => navigate(`/app/${nextChapterId}`)} className="bg-gradient-to-r from-primary to-primary-glow hover:opacity-90">
            Próximo Capítulo
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>}
      </div>
    </div>;
};
export default ChapterView;