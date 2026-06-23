package com.saathi.repository;
import com.saathi.entity.DreamCommunity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
@Repository
public interface DreamCommunityRepository extends JpaRepository<DreamCommunity, Long> {
    List<DreamCommunity> findByActiveTrueOrderByMemberCountDesc();
    List<DreamCommunity> findByGoal(DreamCommunity.CommunityGoal goal);
}
