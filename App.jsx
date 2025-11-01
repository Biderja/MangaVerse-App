
import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { useSearchParams, Routes, Route, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import MangaReader from '@/components/MangaReader';
import PWAInstaller from '@/components/PWAInstaller';
import WelcomeCover from '@/components/WelcomeCover';
import PlaceholderPage from '@/components/PlaceholderPage';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Library, Heart, Settings as SettingsIcon } from 'lucide-react';

const ReaderView = () => {
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  
  const mangaId = useMemo(() => searchParams.get('manga'), [searchParams]);
  const chapterId = useMemo(() => parseInt(searchParams.get('chapter') || '1', 10), [searchParams]);
  const pageId = useMemo(() => parseInt(searchParams.get('page') || '0', 10), [searchParams]);
  
  const [manga, setManga] = useState(null);
  const [currentEpisode, setCurrentEpisode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isReaderOpen, setReaderOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (mangaId && chapterId) {
      setReaderOpen(true);
    } else {
      setReaderOpen(false);
    }
  }, [mangaId, chapterId]);

  useEffect(() => {
    if (!mangaId) {
      setLoading(false);
      return;
    }

    const fetchManga = async () => {
      setLoading(true);
      const { data: mangaData, error } = await supabase
        .from('mangas')
        .select('*')
        .eq('id', mangaId)
        .single();
      
      if (error || !mangaData) {
        toast({
          title: "خطأ",
          description: "لم يتم العثور على المانجا",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }
      setManga(mangaData);
      
      const episodeData = mangaData.episodes.find(ep => ep.number === chapterId);
      if (!episodeData) {
        toast({
          title: "خطأ",
          description: "لم يتم العثور على الفصل",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }
      
      const pagesWithUrls = episodeData.pages.map(page => {
        const { data: { publicUrl } } = supabase.storage.from('manga_pages').getPublicUrl(`${mangaId}/${chapterId}/${page.image}`);
        return { ...page, url: publicUrl, imageUrl: publicUrl };
      });

      setCurrentEpisode({ ...episodeData, pages: pagesWithUrls });
      setLoading(false);
    };

    fetchManga();
  }, [mangaId, chapterId, toast]);

  const handleReaderClose = () => {
    navigate('/');
    setReaderOpen(false);
  };
  
  const handleEpisodeChange = (newEpisodeNumber) => {
    if (!manga) return;
    const nextEpisode = manga.episodes.find(ep => ep.number === newEpisodeNumber);
    if(nextEpisode) {
       navigate(`?manga=${mangaId}&chapter=${newEpisodeNumber}&page=0`);
    } else {
        toast({ title: "هذا هو آخر فصل", variant: "info" });
    }
  };

  return (
    <>
      <div style={{ display: isReaderOpen ? 'none' : 'block' }}>
        <Header mangaTitle="Biderja" chapter="اختر مانجا للبدء" />
        <main className="px-4 pb-32 pt-40">
           <div className="text-center mb-6">
              <h2 className="font-display text-2xl font-bold text-white mb-2 gradient-text">
                  مرحباً بك في Biderja
              </h2>
              <p className="text-gray-300 text-sm">اعمل جو وإنت تقرا المانغا اليابانية بالدارجة التونسية</p>
          </div>
          <WelcomeCover />
        </main>
      </div>
      
      {isReaderOpen && manga && currentEpisode && (
        <MangaReader
          manga={manga}
          startEpisodeData={currentEpisode}
          startPage={pageId}
          onClose={handleReaderClose}
          onEpisodeChange={handleEpisodeChange}
        />
      )}
    </>
  );
};

function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white" dir="rtl">
      <Helmet>
        <title>قارئ المانغا Biderja</title>
        <meta name="description" content="اعمل جو وإنت تقرا المانغا اليابانية بالدارجة التونسية" />
        <meta name="theme-color" content="#1a1a1a" />
      </Helmet>
      
      <Routes>
        <Route path="/" element={<ReaderView />} />
        <Route path="/library" element={<PlaceholderPage title="المكتبة" icon={Library} />} />
        <Route path="/favorites" element={<PlaceholderPage title="المفضلة" icon={Heart} />} />
        <Route path="/settings" element={<PlaceholderPage title="الإعدادات" icon={SettingsIcon} />} />
      </Routes>
      
      <BottomNav />
      <PWAInstaller />
    </div>
  );
}

export default App;
