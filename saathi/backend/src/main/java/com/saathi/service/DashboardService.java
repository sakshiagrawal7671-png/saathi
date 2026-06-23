package com.saathi.service;

import com.saathi.dto.response.DashboardResponse;

public interface DashboardService {
    DashboardResponse getDashboard(Long userId);
}
