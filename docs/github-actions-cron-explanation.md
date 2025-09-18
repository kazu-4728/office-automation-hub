# GitHub Actions Cron Schedule Explanation

## Overview

This document explains the cron schedule configuration used in our GitHub Actions workflows.

## Current Cron Configuration

Both `agent.yml` and `agent-main.yml` workflows use the following cron schedule:

```yaml
schedule:
  - cron: "0 22 * * *"  # Daily at 07:00 JST (22:00 UTC)
```

## Cron Syntax Breakdown

The cron expression `"0 22 * * *"` breaks down as follows:

| Position | Value | Meaning |
|----------|-------|---------|
| 1st | `0` | Minute (0-59) - Execute at minute 0 |
| 2nd | `22` | Hour (0-23) - Execute at hour 22 (10 PM) |
| 3rd | `*` | Day of month (1-31) - Any day |
| 4th | `*` | Month (1-12) - Any month |
| 5th | `*` | Day of week (0-6 or SUN-SAT) - Any day of the week (0/SUN = Sunday) |

## Time Zone Considerations

### UTC vs JST
- **UTC Time**: 22:00 (10:00 PM)
- **JST Time**: 07:00 (7:00 AM) the next day
- **Time Difference**: JST is UTC+9

### Why This Schedule?
1. **Business Hours**: 07:00 JST is early morning in Japan, suitable for daily processing before business hours
2. **Resource Availability**: GitHub Actions runners are typically less congested during off-peak hours
3. **Error Handling**: Issues can be addressed during Japanese business hours if they occur

## Schedule Impact

### Daily Execution
- The workflow runs **once per day** at the specified time
- This provides consistent, predictable automation
- Reduces unnecessary resource consumption compared to more frequent schedules

### Workflow Coordination
- Both `agent.yml` and `agent-main.yml` use the same schedule to coordinate execution
- The `agent.yml` performs preflight checks (OpenAI secret validation)
- The `agent-main.yml` handles the main orchestration tasks

## Alternative Schedule Examples

For reference, here are other common cron patterns:

```yaml
# Every 6 hours
- cron: "0 */6 * * *"

# Twice daily (6 AM and 6 PM JST)
- cron: "0 21,9 * * *"

# Weekdays only at 7 AM JST (adjusted: runs at 22:00 UTC on Sun-Thu, which is 07:00 JST Mon-Fri)
- cron: "0 22 * * 0-4"

# Every Monday at 7 AM JST (adjusted: runs at 22:00 UTC on Sun, which is 07:00 JST Mon)
- cron: "0 22 * * 0"
```

## Troubleshooting

### Common Issues
1. **Time Zone Confusion**: Remember that GitHub Actions uses UTC time
2. **Schedule Delays**: GitHub Actions may have slight delays during high traffic periods
3. **Missed Executions**: If a runner is unavailable, the execution may be skipped

### Monitoring
- Check the Actions tab to verify scheduled runs
- Review workflow logs for execution details
- Monitor for any failed runs or errors

## References

- [GitHub Actions Schedule Documentation](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#schedule)
- [Cron Expression Reference](https://crontab.guru/)
- [UTC Time Zone Information](https://time.is/UTC)