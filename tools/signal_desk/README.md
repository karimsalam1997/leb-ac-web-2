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
