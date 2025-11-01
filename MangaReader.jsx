
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Maximize } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/components/ui/use-toast';
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import { cn } from '@/lib/utils';
import { useNavigate, useSearchParams } from 'react-router-dom';

const Page = React.forwardRef(({ pageNumber, children, onImageLoad, isFirstImage }, ref) => {
  const imgRef = useRef(null);

  useEffect(() => {
    const imageElement = imgRef.current;
    if (imageElement && isFirstImage) {
      const handleLoad = () => {
        if (imageElement.naturalWidth > 0 && onImageLoad) {
          onImageLoad({
            naturalWidth: imageElement.naturalWidth,
            naturalHeight: imageElement.naturalHeight,
          });
        }
      };

      if (imageElement.complete) {
        handleLoad();
      } else {
        imageElement.addEventListener('load', handleLoad);
      }
      
      return () => {
        if (imageElement) {
          imageElement.removeEventListener('load', handleLoad);
        }
      }
    }
  }, [onImageLoad, children, isFirstImage]);

  const child = React.Children.only(children);
  const isImage = child.type === 'img';

  return (
    <div ref={ref} className="flex items-center justify-center bg-white overflow-hidden">
      <div className="w-full h-full flex flex-col relative">
        {isImage ? React.cloneElement(child, { ref: imgRef }) : child}
        <div className="absolute bottom-2 left-2 text-xs text-gray-400 bg-white/50 px-1 rounded">
          {pageNumber}
        </div>
      </div>
    </div>
  );
});

const MangaReader = ({ 
  manga, 
  startEpisodeData, 
  startPage, 
  onClose, 
  onEpisodeChange
}) => {
  const [currentEpisode] = useState(startEpisodeData);
  const [currentPage, setCurrentPage] = useState(startPage || 0);
  const [totalPages, setTotalPages] = useState(0);
  const [readingDirection] = useState('rtl');
  const [showUI, setShowUI] = useState(true);
  const [scaledDimensions, setScaledDimensions] = useState({ width: 0, height: 0 });
  const [naturalImageSize, setNaturalImageSize] = useState(null);
  
  const fullScreenHandle = useFullScreenHandle();
  const flipBook = useRef(null);
  const uiTimeoutRef = useRef(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    const setRealVh = () => {
      const vh = window.visualViewport?.height || window.innerHeight;
      document.documentElement.style.setProperty('--vh', `${vh * 0.01}px`);
    };
    setRealVh();
    window.visualViewport?.addEventListener('resize', setRealVh);
    return () => window.visualViewport?.removeEventListener('resize', setRealVh);
  }, []);
  
  const handleFlip = useCallback((e) => {
    const newPage = e.data;
    setCurrentPage(newPage);
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage);
    navigate(`?${params.toString()}`, { replace: true });

    const pageCount = flipBook.current?.pageFlip()?.getPageCount() || 0;
    if (pageCount > 0 && newPage >= pageCount - 1) {
        setTimeout(() => {
            const nextEpisodeNumber = currentEpisode.number + 1;
            onEpisodeChange(nextEpisodeNumber);
        }, 1500);
    }
  }, [searchParams, navigate, currentEpisode, onEpisodeChange]);

  const handleImageLoad = useCallback((imageData) => {
    setNaturalImageSize(imageData);
  }, []);

  const updateScaledDimensions = useCallback(() => {
    if (!naturalImageSize) return;
    
    const viewportHeight = window.visualViewport?.height || window.innerHeight;
    const viewportWidth = window.visualViewport?.width || window.innerWidth;
    
    if (viewportWidth < 200 || viewportHeight < 200) return;

    const widthRatio = viewportWidth / naturalImageSize.naturalWidth;
    const heightRatio = viewportHeight / naturalImageSize.naturalHeight;
    const scaleRatio = Math.min(widthRatio, heightRatio, 1);

    const newWidth = Math.round(naturalImageSize.naturalWidth * scaleRatio);
    const newHeight = Math.round(naturalImageSize.naturalHeight * scaleRatio);

    if (newWidth > 0 && (newWidth !== scaledDimensions.width || newHeight !== scaledDimensions.height)) {
        setScaledDimensions({ width: newWidth, height: newHeight });
    }
  }, [naturalImageSize, scaledDimensions.width, scaledDimensions.height]);

  useEffect(() => {
    requestAnimationFrame(updateScaledDimensions);
    const handleResize = () => requestAnimationFrame(updateScaledDimensions);
    window.addEventListener('resize', handleResize);
    window.visualViewport?.addEventListener('resize', handleResize);
    return () => {
        window.removeEventListener('resize', handleResize);
        window.visualViewport?.removeEventListener('resize', handleResize);
    };
  }, [updateScaledDimensions]);

  useEffect(() => {
    if (currentEpisode && currentEpisode.pages) {
      const pageCount = flipBook.current?.pageFlip()?.getPageCount() || 0;
      setTotalPages(pageCount);
       if (flipBook.current && flipBook.current.pageFlip()) {
         const pageNumber = Math.max(0, Math.min(currentPage, pageCount - 1));
         if (flipBook.current.pageFlip().getCurrentPageIndex() !== pageNumber) {
           flipBook.current.pageFlip().turnToPage(pageNumber);
         }
       }
    }
  }, [currentEpisode, currentPage, scaledDimensions]);

  const handlePrevEpisode = () => {
    const prevEpisodeNumber = currentEpisode.number - 1;
    if (prevEpisodeNumber > 0) {
        onEpisodeChange(prevEpisodeNumber);
    } else {
        toast({ title: "هذا هو الفصل الأول" });
    }
  };

  const handleNextEpisode = () => onEpisodeChange(currentEpisode.number + 1);

  const orderedPages = useMemo(() => {
    if (!currentEpisode.pages) return [];
    let pages = [...currentEpisode.pages];
    if (pages.length === 0) return [];
    
    if (pages.length % 2 !== 0) {
      if (readingDirection === 'rtl') {
        pages.unshift({ type: 'blank', url: null });
      } else {
        pages.push({ type: 'blank', url: null });
      }
    }
    
    return pages.map((page, index) => ({
      url: page.url,
      type: page.type || 'page',
      originalIndex: index,
      translation: page.translation
    }));
  }, [currentEpisode.pages, readingDirection]);

  const handleInteraction = useCallback(() => {
    setShowUI(true);
    if (uiTimeoutRef.current) clearTimeout(uiTimeoutRef.current);
    uiTimeoutRef.current = setTimeout(() => setShowUI(false), 3000);
  }, []);

  useEffect(() => {
    handleInteraction();
    window.addEventListener('mousemove', handleInteraction);
    window.addEventListener('touchstart', handleInteraction);
    return () => {
      if (uiTimeoutRef.current) clearTimeout(uiTimeoutRef.current);
      window.removeEventListener('mousemove', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
    };
  }, [handleInteraction]);

  const firstImageIndex = useMemo(() => orderedPages.findIndex(p => p.type === 'page'), [orderedPages]);
  
  return (
    <FullScreen handle={fullScreenHandle}>
      <div 
        className={cn("fixed inset-0 z-50 flex flex-col bg-gray-900 text-white", fullScreenHandle.active && 'bg-black')}
        dir={readingDirection}
      >
        <AnimatePresence>
          {showUI && (
            <motion.header
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.3 }}
              className="absolute top-0 left-0 right-0 flex justify-between items-center p-2 bg-black/50 backdrop-blur-sm z-20"
            >
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:text-gray-300"><X /></Button>
                <div>
                  <h1 className="text-lg font-bold">{manga.title}</h1>
                  <p className="text-sm">{manga.episode_label || 'الفصل'} {currentEpisode.number}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => fullScreenHandle.active ? fullScreenHandle.exit() : fullScreenHandle.enter()} title="Full Screen" className="text-white hover:text-gray-300">
                  <Maximize />
                </Button>
              </div>
            </motion.header>
          )}
        </AnimatePresence>
  
        <main className="flex-1 flex items-center justify-center relative p-4">
          {!naturalImageSize && orderedPages.length > 0 && (
            <>
              <div className="flex items-center justify-center w-full h-full text-gray-400">
                جاري التحميل...
              </div>
              <div className='w-0 h-0 overflow-hidden'>
                <Page 
                  key={`${currentEpisode.number}-preloader`} 
                  onImageLoad={handleImageLoad}
                  isFirstImage={true}
                >
                  <img src={orderedPages[firstImageIndex]?.url} alt="preloader" />
                </Page>
              </div>
            </>
          )}
          
          {scaledDimensions.width > 0 && (
            <HTMLFlipBook
                key={`${currentEpisode.number}-${readingDirection}`}
                width={scaledDimensions.width}
                height={scaledDimensions.height}
                size="stretch"
                minWidth={315}
                maxWidth={1000}
                minHeight={420}
                maxHeight={1350}
                maxShadowOpacity={0.5}
                showCover={false}
                mobileScrollSupport={true}
                onFlip={handleFlip}
                ref={flipBook}
                startPage={currentPage}
                flippingTime={400}
                usePortrait={true}
            >
              {orderedPages.map((page, index) => {
                const pageNumberToDisplay = readingDirection === 'rtl' ? (totalPages - index) || 1 : index + 1;
                return (
                  <Page 
                    key={`${currentEpisode.number}-${page.originalIndex}`} 
                    pageNumber={page.type === 'blank' ? '' : pageNumberToDisplay} 
                  >
                    {page.type === 'blank' ? (
                      <div className="w-full h-full bg-gray-100" />
                    ) : (
                      <div className="w-full h-full relative">
                        <img 
                          src={page.url} 
                          alt={`Page ${pageNumberToDisplay}`} 
                          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                        />
                        {page.translation && (
                          <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-70 text-white p-2 rounded-lg backdrop-blur-sm">
                            <p className="font-arabic text-center text-sm md:text-base">{page.translation}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </Page>
                );
              })}
            </HTMLFlipBook>
          )}
        </main>
  
        <AnimatePresence>
          {showUI && (
            <motion.footer
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.3 }}
              className="absolute bottom-0 left-0 right-0 flex justify-between items-center p-2 bg-black/50 backdrop-blur-sm z-20"
            >
              <Button variant="ghost" onClick={handlePrevEpisode} className="text-white hover:text-gray-300">الفصل السابق</Button>
              <div className="flex-1 mx-4">
                <div className="flex justify-between text-sm mb-1 px-1">
                  <span>صفحة {currentPage + 1}</span>
                  <span>{totalPages}</span>
                </div>
                <Slider
                  min={0}
                  max={totalPages > 0 ? totalPages - 1 : 0}
                  step={1}
                  value={[currentPage]}
                  onValueChange={(value) => flipBook.current?.pageFlip()?.turnToPage(value[0])}
                  dir="ltr"
                />
              </div>
              <Button variant="ghost" onClick={handleNextEpisode} className="text-white hover:text-gray-300">الفصل التالي</Button>
            </motion.footer>
          )}
        </AnimatePresence>
      </div>
    </FullScreen>
  );
};

export default MangaReader;
