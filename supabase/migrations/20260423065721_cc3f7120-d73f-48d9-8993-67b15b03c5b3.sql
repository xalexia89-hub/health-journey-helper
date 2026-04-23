
DROP VIEW IF EXISTS public.agent_performance;

CREATE VIEW public.agent_performance
WITH (security_invoker = true)
AS
SELECT
  task,
  model_used,
  date_trunc('day', created_at) AS day,
  count(*) AS total_calls,
  avg(latency_ms)::int AS avg_latency_ms,
  sum(tokens_input + tokens_output) AS total_tokens,
  sum(cost_usd) AS total_cost_usd,
  count(*) FILTER (WHERE status = 'error') AS error_count,
  round(100.0 * count(*) FILTER (WHERE status = 'success') / nullif(count(*), 0), 2) AS success_rate
FROM public.ai_observability
GROUP BY task, model_used, date_trunc('day', created_at);
