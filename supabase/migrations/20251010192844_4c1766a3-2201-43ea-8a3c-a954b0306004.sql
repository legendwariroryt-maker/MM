-- Remove existing cron job if it exists
SELECT cron.unschedule('daily-parent-reports');

-- Schedule daily parent report generation at midnight (12 AM)
SELECT cron.schedule(
  'daily-parent-reports',
  '0 0 * * *', -- Every day at midnight
  $$
  SELECT
    net.http_post(
        url:='https://srbimjnixzhpaiwongli.supabase.co/functions/v1/generate-parent-report',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNyYmltam5peHpocGFpd29uZ2xpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc3NzcyNTEsImV4cCI6MjA3MzM1MzI1MX0.LkKcxQmp0PvPVduGvu9O0BXMZ8XOwI7jMtPCPyGXKxg"}'::jsonb,
        body:=concat('{"time": "', now(), '"}')::jsonb
    ) as request_id;
  $$
);