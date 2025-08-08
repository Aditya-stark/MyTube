from datetime import datetime, timezone

def recency_weight(upload_date_str):
    if isinstance(upload_date_str, dict) and "$date" in upload_date_str:
        upload_date_str = upload_date_str["$date"]

    if isinstance(upload_date_str, datetime):
        dt = upload_date_str
    else:
        s = str(upload_date_str).replace("Z", "+00:00")
        try:
            dt = datetime.fromisoformat(s)
        except ValueError:
            return 0.0

    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)

    now = datetime.now(timezone.utc)
    age_days = max((now - dt).days, 0)
    return 1 / (1 + age_days)