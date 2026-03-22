"""
Devin Parallel Migration Orchestrator
Spawns parallel Devin sessions to migrate TeamFlow JS/JSX modules to TypeScript.
Creates a shared Playbook with migration rules. Splits work by directory — Devin
figures out the typing challenges on its own.
Polls progress and generates a live HTML dashboard.
"""

import json
import time
from pathlib import Path

# Local imports
import config
import devin_client
import dashboard

POLL_INTERVAL = 30  # seconds between status checks

def main():
    if not getattr(devin_client, "API_KEY", None) or not getattr(devin_client, "ORG_ID", None):
        print("ERROR: Set DEVIN_API_KEY and DEVIN_ORG_ID in scribe/.env")
        return

    state_path = Path(__file__).parent / "sessions.json"

    # ── Step 1: Create shared playbook ──
    print("Creating shared Playbook...\n")
    try:
        playbook_id = devin_client.create_playbook()
        print(f"  Playbook created: {playbook_id}")
    except Exception as e:
        print(f"  FAILED to create playbook: {e}")
        return

    print()

    # ── Step 2 & 3: Spawn and poll waves ──
    sessions = []
    state = {"playbook_id": playbook_id, "sessions": sessions}

    try:
        for wave_idx, wave in enumerate(config.WAVES):
            print(f"=== Spawning Wave {wave_idx + 1}/{len(config.WAVES)} ({len(wave)} sessions) ===\n")
            
            wave_sessions = []
            for module in wave:
                try:
                    session_id, url = devin_client.create_session(module, playbook_id)
                    print(f"  ✓ {module['name']:20s} {module['path']:45s} → {session_id}")
                    s_data = {
                        "module": module["name"],
                        "path": module["path"],
                        "session_id": session_id,
                        "url": url,
                        "status": "new",
                        "status_detail": "",
                        "acus_consumed": 0,
                        "pull_requests": [],
                    }
                    sessions.append(s_data)
                    wave_sessions.append(s_data)
                except Exception as e:
                    print(f"  ✗ {module['name']:20s} → FAILED: {e}")
                    s_data = {
                        "module": module["name"],
                        "path": module["path"],
                        "session_id": None,
                        "url": "",
                        "status": "error",
                        "status_detail": str(e),
                        "acus_consumed": 0,
                        "pull_requests": [],
                    }
                    sessions.append(s_data)
                    wave_sessions.append(s_data)

            print()
            print(f"Dashboard: file://{dashboard.DASHBOARD_PATH.resolve()}")
            print(f"Polling Wave {wave_idx + 1}... (Ctrl+C to stop)\n")

            # Save state
            state = {
                "playbook_id": playbook_id,
                "sessions": sessions,
            }
            state_path.write_text(json.dumps(state, indent=2))
            dashboard.render_dashboard(sessions, playbook_id)

            # Poll loop for the current wave
            while True:
                for s in sessions:
                    if not s["session_id"] or s["status"] in ("exit", "error"):
                        continue
                    
                    try:
                        data = devin_client.get_session_status(s["session_id"])
                        old_status = s["status"]
                        s["status"] = data.get("status", s["status"])
                        s["status_detail"] = data.get("status_detail", "")
                        s["acus_consumed"] = data.get("acus_consumed", 0)
                        s["pull_requests"] = data.get("pull_requests", [])
                        s["url"] = data.get("url", s["url"])

                        if s["status"] != old_status:
                            print(f"  {s['module']:20s} {old_status} → {s['status']}")

                            if s["status"] == "exit" and s["pull_requests"]:
                                for pr in s["pull_requests"]:
                                    print(f"    PR: {pr['pr_url']}")
                    except Exception as e:
                        print(f"  {s['module']:20s} poll error: {e}")

                # Update dashboard and state
                dashboard.render_dashboard(sessions, playbook_id)
                state["sessions"] = sessions
                state_path.write_text(json.dumps(state, indent=2))

                wave_terminal = True
                for s in wave_sessions:
                    if s["session_id"] and s["status"] not in ("exit", "error"):
                        wave_terminal = False
                        break

                if wave_terminal:
                    print(f"\nWave {wave_idx + 1} finished!")
                    break

                time.sleep(POLL_INTERVAL)
                
            if wave_idx < len(config.WAVES) - 1:
                input(f"\n[ACTION REQUIRED] Please review and merge the PRs from Wave {wave_idx + 1} into `main`.\nPress Enter to start Wave {wave_idx + 2}...")
                print()

        print("\nAll waves completed successfully! Migration finished.")

    except KeyboardInterrupt:
        print("\nStopped polling. Dashboard saved. Sessions continue on Devin.")
        dashboard.render_dashboard(sessions, playbook_id)
        state["sessions"] = sessions
        state_path.write_text(json.dumps(state, indent=2))


if __name__ == "__main__":
    main()
