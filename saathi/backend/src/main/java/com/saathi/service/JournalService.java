package com.saathi.service;

import com.saathi.dto.request.JournalRequest;
import com.saathi.entity.JournalEntry;
import java.util.List;

public interface JournalService {
    JournalEntry createEntry(Long userId, JournalRequest request);
    JournalEntry updateEntry(Long userId, Long entryId, JournalRequest request);
    void deleteEntry(Long userId, Long entryId);
    List<JournalEntry> getEntries(Long userId);
    JournalEntry getEntry(Long userId, Long entryId);
}
