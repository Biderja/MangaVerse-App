js
// Supabase Integration for Manga Reader App
// This module handles all interactions with your existing Supabase backend

class MangaAPI {
    constructor() {
        this.baseURL = 'https://lightblue-coyote-949011.hostingersite.com/api'; // updated base URL
        this.mangaData = new Map();
        this.currentManga = null;
        this.currentChapter = null;
        this.init();
    }

    init() {
        this.setupAPIEndpoints();
        this.loadMangaList();
    }

    setupAPIEndpoints() {
        // API endpoints for your existing website
        this.endpoints = {
            mangaList: `${this.baseURL}/manga`,
            mangaDetails: `${this.baseURL}/manga/`,
            chapterPages: `${this.baseURL}/chapter/`,
            translations: `${this.baseURL}/translation/`,
            search: `${this.baseURL}/search`
        };
    }

    async fetchMangaList() {
        try {
            const response = await fetch(this.endpoints.mangaList);
            const data = await response.json();
            
            // Store manga data
            data.forEach(manga => {
                this.mangaData.set(manga.id, {
                    id: manga.id,
                    title: manga.title,
                    arabicTitle: manga.arabic_title || manga.title,
                    author: manga.author,
                    coverImage: manga.cover_image,
                    genre: manga.genre,
                    status: manga.status,
                    chapters: manga.chapters || [],
                    description: manga.description,
                    arabicDescription: manga.arabic_description || manga.description
                });
            });
            
            return Array.from(this.mangaData.values());
        } catch (error) {
            console.error('Error fetching manga list:', error);
            // Fallback to local data
            return this.getFallbackMangaList();
        }
    }

    async fetchMangaDetails(mangaId) {
        try {
            const response = await fetch(`${this.endpoints.mangaDetails}${mangaId}`);
            const data = await response.json();
            
            this.currentManga = {
                id: data.id,
                title: data.title,
                arabicTitle: data.arabic_title || data.title,
                author: data.author,
                coverImage: data.cover_image,
                genre: data.genre,
                status: data.status,
                chapters: data.chapters || [],
                description: data.description,
                arabicDescription: data.arabic_description || data.description
            };
            
            return this.currentManga;
        } catch (error) {
            console.error('Error fetching manga details:', error);
            return this.getFallbackMangaData(mangaId);
        }
    }

    async fetchChapterPages(mangaId, chapterNumber) {
        try {
            const response = await fetch(`${this.endpoints.chapterPages}${mangaId}/${chapterNumber}`);
            const data = await response.json();
            
            this.currentChapter = {
                mangaId: mangaId,
                chapterNumber: chapterNumber,
                pages: data.pages.map(page => ({
                    id: page.id,
                    pageNumber: page.page_number,
                    imageUrl: page.image_url,
                    arabicTranslation: page.arabic_translation || '',
                    derjaTranslation: page.derja_translation || page.arabic_translation || '',
                    position: page.position || 'bottom'
                }))
            };
            
            return this.currentChapter;
        } catch (error) {
            console.error('Error fetching chapter pages:', error);
            return this.getFallbackChapterData(mangaId, chapterNumber);
        }
    }

    async searchManga(query) {
        try {
            const response = await fetch(`${this.endpoints.search}?q=${encodeURIComponent(query)}`);
            const data = await response.json();
            return data.results || [];
        } catch (error) {
            console.error('Error searching manga:', error);
            return this.searchFallbackManga(query);
        }
    }

    // Fallback data for when API is not available
    getFallbackMangaList() {
        return [
            // fallback manga list as previous
        ];
    }

    getFallbackMangaData(mangaId) {
        const mangaList = this.getFallbackMangaList();
        return mangaList.find(manga => manga.id === mangaId) || mangaList[0];
    }

    getFallbackChapterData(mangaId, chapterNumber) {
        const samplePages = [
            // fallback pages as previous
        ];

        return {
            mangaId: mangaId,
            chapterNumber: chapterNumber,
            pages: samplePages
        };
    }

    searchFallbackManga(query) {
        const mangaList = this.getFallbackMangaList();
        const lowercaseQuery = query.toLowerCase();
        
        return mangaList.filter(manga => 
            manga.title.toLowerCase().includes(lowercaseQuery) ||
            manga.arabicTitle.toLowerCase().includes(lowercaseQuery) ||
            manga.genre.toLowerCase().includes(lowercaseQuery)
        );
    }

    // Utility methods...

    // Reading progress tracking...

    // Bookmark functionality...
}

// Initialize API instance
const mangaAPI = new MangaAPI();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MangaAPI;
}
