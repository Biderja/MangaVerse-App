
import React from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from '@/components/ui/button';

const ChapterNavigation = ({ chapters, progress, onChapterChange, currentChapter }) => {
  const { toast } = useToast();

  const handleToggle = () => {
    toast({
      title: "🚧 قيد الإنشاء",
      description: "ميزة تبديل الاتجاه ليست جاهزة بعد! 🚀",
    });
  };

  return (
    <>
      <div className="mt-6 max-w-md mx-auto">
        <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-4 border border-white/10 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-medium">الفصول</h3>
            <Button
              onClick={handleToggle}
              size="sm"
              className="px-3 py-1 rounded-full text-sm bg-coral text-white hover:bg-coral/80"
              style={{'--accent-coral': '#e85a4f'}}
            >
              RTL
            </Button>
          </div>
          <Select onValueChange={onChapterChange} value={currentChapter}>
            <SelectTrigger className="w-full bg-white/90 text-gray-800 border-none">
              <SelectValue placeholder="اختر فصل..." />
            </SelectTrigger>
            <SelectContent>
              {chapters.map((chapter) => (
                <SelectItem key={chapter.id} value={chapter.id} className="font-arabic text-right">
                  {chapter.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="mt-4 max-w-md mx-auto">
        <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-4 border border-white/10 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white text-sm">تقدم القراءة</span>
            <span className="text-sm font-bold" style={{color: 'var(--accent-coral)'}}>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-600 rounded-full h-2 overflow-hidden">
            <div className="h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%`, backgroundColor: 'var(--accent-coral)' }}></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChapterNavigation;
