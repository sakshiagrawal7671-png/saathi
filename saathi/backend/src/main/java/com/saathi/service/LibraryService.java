package com.saathi.service;
import com.saathi.entity.ArticleInteraction;
import com.saathi.entity.LibraryArticle;
import java.util.List;
import java.util.Map;
public interface LibraryService {
    List<LibraryArticle> getArticles(LibraryArticle.LibraryType type, String theme);
    LibraryArticle getArticle(Long id);
    ArticleInteraction markRead(Long userId, Long articleId);
    ArticleInteraction toggleBookmark(Long userId, Long articleId);
    ArticleInteraction markHelpful(Long userId, Long articleId);
    List<LibraryArticle> getBookmarked(Long userId, LibraryArticle.LibraryType type);
    Map<String, Object> getStats(Long userId);
}
