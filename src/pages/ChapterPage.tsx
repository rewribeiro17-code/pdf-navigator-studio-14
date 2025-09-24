import React from 'react';
import { useParams } from 'react-router-dom';
import ChapterView from '@/components/ChapterView';
import { bookContent } from '@/data/bookContent';

const ChapterPage: React.FC = () => {
  const { chapterId } = useParams<{ chapterId: string }>();
  
  const chapterIndex = bookContent.chapters.findIndex(c => c.id === chapterId);
  const chapter = bookContent.chapters[chapterIndex];
  
  if (!chapter) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-muted-foreground">
          Capítulo não encontrado
        </h2>
      </div>
    );
  }

  const nextChapter = bookContent.chapters[chapterIndex + 1];
  const prevChapter = bookContent.chapters[chapterIndex - 1];

  return (
    <ChapterView 
      chapter={chapter}
      nextChapterId={nextChapter?.id}
      prevChapterId={prevChapter?.id}
    />
  );
};

export default ChapterPage;