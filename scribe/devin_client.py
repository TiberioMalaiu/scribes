import os
import requests
from pathlib import Path
from dotenv import load_dotenv

import config

load_dotenv(Path(__file__).parent / ".env")

API_KEY = os.getenv("DEVIN_API_KEY")
ORG_ID = os.getenv("DEVIN_ORG_ID")
BASE_URL = f"https://api.devin.ai/v3/organizations/{ORG_ID}"
REPO = "https://github.com/tiberiomalaiu/scribes"

def get_headers():
    return {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json",
    }

def create_playbook():
    """Create the shared migration playbook. Returns playbook_id."""
    body = {
        "title": config.PLAYBOOK_TITLE,
        "body": config.PLAYBOOK_BODY,
    }
    resp = requests.post(f"{BASE_URL}/playbooks", headers=get_headers(), json=body)
    resp.raise_for_status()
    data = resp.json()
    return data["playbook_id"]

def create_session(module, playbook_id):
    """Spawn a Devin session with the playbook attached."""
    if module.get('integration'):
        prompt = (
            f"The codebase has just been migrated to TypeScript in parallel chunks.\n\n"
            f"**Repository:** {REPO}\n"
            f"**Branch:** Create `ts-migrate/integration` from `main`.\n\n"
            f"Your task is to run `npm install`, then run `npx tsc --noEmit` or `npm run build`. "
            f"Fix any remaining TS errors, `any` types, missing dependencies in package.json, or conflicting interfaces across all modules. "
            f"Create a final PR when the entire project compiles successfully without any errors."
        )
    else:
        target_files = module.get('target', 'all `.js` and `.jsx` files')
        prompt = (
            f"Migrate {target_files} in `{module['path']}` "
            f"from JavaScript to TypeScript.\n\n"
            f"**Repository:** {REPO}\n"
            f"**Branch:** Create `ts-migrate/{module['name']}` from `main`.\n\n"
            f"Read every file in that directory, understand the code, and add proper types. "
            f"Follow the playbook. Create a PR when done."
        )

    body = {
        "prompt": prompt,
        "playbook_id": playbook_id,
        "tags": ["ts-migration", f"module:{module['name']}"],
        "title": f"TS Migration: {module['name']}",
    }

    resp = requests.post(f"{BASE_URL}/sessions", headers=get_headers(), json=body)
    resp.raise_for_status()
    data = resp.json()
    return data["session_id"], data.get("url", "")


def get_session_status(session_id):
    """Poll a session for its current status.
    The v3 API expects the devin- prefix on the session ID.
    """
    devin_id = session_id if session_id.startswith("devin-") else f"devin-{session_id}"
    resp = requests.get(f"{BASE_URL}/sessions/{devin_id}", headers=get_headers())
    resp.raise_for_status()
    return resp.json()
