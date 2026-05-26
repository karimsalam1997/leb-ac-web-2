# Lebanese Academic Signal Desk

This is the local source-to-dashboard pipeline for `/signal-desk`.

Run it with:

```bash
python3 -m tools.signal_desk.run --only-rss --since 7d
```

It writes dated output into `store/output/<date>/` and copies the latest public
dashboard files into `public/data/signal-desk/`.

The first working version is RSS-first. Telegram and YouTube collectors are safe
stubs until real handles, sessions, and review rules are added. No secrets or
session files should be committed.

When live DNS or source access is blocked, the RSS collector can read local
snapshots without treating them as live reporting:

```bash
python3 -m tools.signal_desk.run --only-rss --dry-run --rss-snapshot-dir store/source-snapshots --rss-snapshot-only
```

Snapshot files are matched to feed names with lowercase dashed filenames. For
example, `The Times of Israel` maps to `the-times-of-israel.xml`, and
`L'Orient Today` maps to `l-orient-today.html`.
