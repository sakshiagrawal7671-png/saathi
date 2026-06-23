package com.saathi.repository;
import com.saathi.entity.InnerCircleMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
@Repository
public interface InnerCircleMemberRepository extends JpaRepository<InnerCircleMember, Long> {
    List<InnerCircleMember> findByUserIdOrderByNameAsc(Long userId);
}
