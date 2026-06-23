package com.saathi.repository;
import com.saathi.entity.LibraryArticle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
@Repository
public interface LibraryArticleRepository extends JpaRepository<LibraryArticle, Long> {
    List<LibraryArticle> findByLibraryTypeAndPublishedTrueOrderByDisplayOrderAsc(LibraryArticle.LibraryType type);
    List<LibraryArticle> findByLibraryTypeAndThemeAndPublishedTrueOrderByDisplayOrderAsc(
            LibraryArticle.LibraryType type, LibraryArticle.LibraryTheme theme);
}
